/**
 * PURE WEB MIDDLEWARE FOR VERCEL
 * No Next.js dependencies. Works with pure HTML/JS projects.
 *
 * Runs on Vercel only. Locally (python3 -m http.server) there is no middleware,
 * so every folder is open for testing, including from other machines on the LAN.
 *
 * Which folders are protected is set in gates.config.js.
 */
import { findGate, cookieName, checkToken, readCookie } from './lib/gate.js';

export const config = {
  // Folders the middleware looks at. A protected folder outside these
  // must be added here too (Vercel needs this list to be written out literally).
  matcher: ['/pg/:path*', '/posts/:path*'],
};

const pass = () => new Response(null, { headers: { 'x-middleware-next': '1' } });

export default async function middleware(req) {
  const url = new URL(req.url);
  const path = url.pathname;

  // 1. Not a protected folder: serve as normal.
  const gate = findGate(path);
  if (!gate) return pass();

  // 2. The gate page itself (the folder's index.html) must always load,
  //    so the visitor can type the password.
  if (path === gate.path || path === gate.path + '/' || path === gate.path + '/index.html') {
    return pass();
  }

  // 3. Fail closed if the site has no signing secret configured.
  const secret = process.env.SESSION_SECRET;
  if (!secret) return new Response('Gate not configured (SESSION_SECRET missing).', { status: 500 });

  // 4. A valid signed cookie for THIS folder: let it through.
  const token = readCookie(req.headers.get('cookie'), cookieName(gate));
  if (await checkToken(gate, secret, token)) return pass();

  // 5. Not logged in.
  //    Pages: show the gate instead (URL stays, so the visitor returns here after login).
  //    Everything else (.txt, images, css, js): refuse.
  const last = path.split('/').pop();
  const isPage = !last.includes('.') || last.endsWith('.html');
  if (isPage) {
    return new Response(null, {
      headers: { 'x-middleware-rewrite': new URL(gate.path + '/', req.url).toString() },
    });
  }
  return new Response('Unauthorized', { status: 401, headers: { 'Cache-Control': 'no-store' } });
}
