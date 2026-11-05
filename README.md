# prsnt-cms
publications for prsnt-cms

# quick start
clone and install:

```bash

git clone https://github.com/fndt-xyz/prsnt-cms.git

cd prsnt-cms

./start.sh

xdg-open http://localhost:8085

```

# folder layout
- root: index.html, global.css, logos, vercel/middleware config.
- `elements/`: shared parts loaded into every page (navbar, footer, right columns) and the about / all-pages pages.
- `code/`: home page blocks (hero slider, row, brand carousel).
- `contents/`: content pages. `posts/`: posts. `pg/`: presentations (b02 is password protected on vercel).
- `frameworks/`: framework pages.

# protected folders (vercel)

Protection only runs on Vercel. Locally (`./start.sh`, also when opened from another machine on the LAN) every folder is open.

Vercel environment variables:
- `SESSION_SECRET`: one long random string per site, used to sign login cookies (e.g. `openssl rand -hex 32`). Without it, protected folders return an error instead of opening.
- one password variable per protected folder, named in `gates.config.js` (e.g. `B02_KEY`).

To protect a folder or page:
1. add `{ path: '/your/folder', key: 'YOUR_KEY' }` to `gates.config.js`
2. add `YOUR_KEY` (the password) on Vercel
3. if the folder is outside `/pg/` and `/posts/`, add it to `matcher` in `middleware.js`
4. give the folder a gate `index.html` (copy `pg/b02/index.html`) and set the same key in it

Each folder gets its own HttpOnly signed cookie, so one password never opens another folder. Everything inside a protected folder (pages, .txt, images, css) needs the login.
