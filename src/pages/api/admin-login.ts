export const prerender = false;

import type { APIRoute } from 'astro';
import {
  checkRateLimit,
  recordFailedAttempt,
  recordSuccessfulLogin,
  verifyPassword,
  createSessionToken,
  setAuthCookie,
} from '../../lib/auth';

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  try {
    // Never read x-forwarded-for directly: clients can spoof it to dodge the lockout
    const ip = clientAddress || '127.0.0.1';

    // Check rate limit
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({
          error: `Too many failed attempts. Please wait ${rateCheck.waitSeconds} seconds before trying again.`,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(rateCheck.waitSeconds || 60),
          },
        }
      );
    }

    const body = await request.json().catch(() => ({}));
    const password = typeof body.password === 'string' ? body.password : '';

    if (!password) {
      return new Response(
        JSON.stringify({ error: 'Password is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const isValid = verifyPassword(password);
    if (!isValid) {
      const attempt = recordFailedAttempt(ip);
      if (attempt.locked) {
        return new Response(
          JSON.stringify({
            error: 'Too many incorrect attempts. Access locked for 15 minutes.',
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': '900',
            },
          }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Incorrect password. Access denied.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Success: reset attempts & set httpOnly session cookie
    recordSuccessfulLogin(ip);
    const token = createSessionToken();
    setAuthCookie(cookies, token);

    return new Response(
      JSON.stringify({ success: true, message: 'Authentication successful.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('admin-login failed:', err);
    return new Response(
      JSON.stringify({ error: 'Server error during authentication.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
