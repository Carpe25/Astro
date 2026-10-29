export const prerender = false;

import type { APIRoute } from 'astro';
import { clearAuthCookie } from '../../lib/auth';

// POST only: a GET logout lets any page log the admin out via a link or <img>
export const POST: APIRoute = async ({ cookies }) => {
  clearAuthCookie(cookies);
  return new Response(
    JSON.stringify({ success: true, message: 'Logged out successfully.' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
