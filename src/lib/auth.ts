import type { AstroCookies } from 'astro';
import crypto from 'node:crypto';

export const SESSION_COOKIE_NAME = 'sd_admin_session';
const SESSION_TTL_SECONDS = 24 * 60 * 60; // 24 hours

// In-memory rate limiting map: ip -> { count, lockedUntil }
interface RateLimitInfo {
  count: number;
  lockedUntil: number;
}

const rateLimitMap = new Map<string, RateLimitInfo>();

// Vite loads .env into import.meta.env in dev; hosts like Vercel provide process.env
export function env(name: string): string | null {
  const value = process.env[name] || import.meta.env[name];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

export function getAdminPassword(): string | null {
  return env('ADMIN_PASSWORD');
}

// No password and no secret = no valid sessions (never fall back to a known key)
function getSecretKey(): string | null {
  const secret = env('SESSION_SECRET');
  if (secret) return secret;
  const adminPass = getAdminPassword();
  return adminPass ? crypto.createHash('sha256').update(`${adminPass}::sd_salt_key`).digest('hex') : null;
}

export function checkRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const info = rateLimitMap.get(ip);

  if (!info) {
    return { allowed: true };
  }

  if (info.lockedUntil > now) {
    const waitSeconds = Math.ceil((info.lockedUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  // Lockout expired, reset if it was locked
  if (info.lockedUntil > 0) {
    rateLimitMap.delete(ip);
  }

  return { allowed: true };
}

export function recordFailedAttempt(ip: string): { locked: boolean; waitSeconds?: number } {
  const now = Date.now();
  const info = rateLimitMap.get(ip) || { count: 0, lockedUntil: 0 };
  info.count += 1;

  if (info.count >= 5) {
    info.lockedUntil = now + 15 * 60 * 1000; // 15-minute lockout
    rateLimitMap.set(ip, info);
    return { locked: true, waitSeconds: 15 * 60 };
  }

  rateLimitMap.set(ip, info);
  return { locked: false };
}

export function recordSuccessfulLogin(ip: string): void {
  rateLimitMap.delete(ip);
}

export function verifyPassword(providedPassword: string): boolean {
  const expected = getAdminPassword();
  if (!expected || !providedPassword) {
    return false;
  }

  // Hash both with sha256 to produce fixed-length buffers for constant-time comparison
  const h1 = crypto.createHash('sha256').update(providedPassword).digest();
  const h2 = crypto.createHash('sha256').update(expected).digest();

  return crypto.timingSafeEqual(h1, h2);
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const nonce = crypto.randomBytes(16).toString('hex');
  const data = `${expiresAt}.${nonce}`;
  const key = getSecretKey();
  if (!key) throw new Error('ADMIN_PASSWORD or SESSION_SECRET must be set');
  const signature = crypto.createHmac('sha256', key).update(data).digest('hex');
  return `${data}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  const [expiresAtStr, nonce, signature] = parts;
  const expiresAt = Number(expiresAtStr);

  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    return false;
  }

  const key = getSecretKey();
  if (!key) {
    return false;
  }

  const data = `${expiresAtStr}.${nonce}`;
  const expectedSig = crypto.createHmac('sha256', key).update(data).digest('hex');

  const sigBuf = Buffer.from(signature, 'hex');
  const expectedBuf = Buffer.from(expectedSig, 'hex');

  if (sigBuf.length !== expectedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(sigBuf, expectedBuf);
}

export function isAuthenticated(cookies: AstroCookies): boolean {
  const cookie = cookies.get(SESSION_COOKIE_NAME);
  return verifySessionToken(cookie?.value);
}

export function setAuthCookie(cookies: AstroCookies, token: string): void {
  cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearAuthCookie(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE_NAME, {
    path: '/',
  });
}
