/**
 * PROTECTED FOLDERS / PAGES (Vercel only)
 *
 * Each entry gates one folder (and everything inside it, including .txt,
 * images and css). `key` is the name of the Vercel environment variable
 * that holds that folder's password.
 *
 * To protect a new folder or page:
 *   1. add an entry here,
 *   2. add the password env var on Vercel (and SESSION_SECRET once per site),
 *   3. if the folder is outside /pg/ and /posts/, add it to `matcher` in middleware.js,
 *   4. give the folder a gate index.html (copy pg/b02/index.html) with the same key.
 *
 * On localhost (python3 -m http.server) none of this runs: everything is open.
 */
export const GATES = [
  { path: '/pg/b02', key: 'B02_KEY' },
  // { path: '/posts/p01', key: 'P01_KEY' },   // uncomment to gate the example post
];

// How long a login lasts.
export const SESSION_HOURS = 24;
