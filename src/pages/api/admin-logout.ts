export const prerender = false;

import type { APIRoute } from 'astro';
import { clearAuthCookie } from '../../lib/auth';

const handleLogout: APIRoute = async ({ cookies, redirect, request }) => {
  clearAuthCookie(cookies);

  const acceptHeader = request.headers.get('accept') || '';
  if (acceptHeader.includes('text/html')) {
    return redirect('/admin-carousel', 303);
  }

  return new Response(
    JSON.stringify({ success: true, message: 'Logged out successfully.' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

export const POST: APIRoute = handleLogout;
export const GET: APIRoute = handleLogout;
