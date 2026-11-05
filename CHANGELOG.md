# changelog

## v0.05
### folder layout (same as mgmt.srvcs v04 and 2nd.fndt)
- `elements/`: navbar.html, footer.html, rght-clmn.html, rght-clmn-about.html, rght-clmn-all.html, about.html, all-pages.html, lmnts.css (was code/elements.css).
- `contents/`: page-00-publications.html joins the other content pages.
- every link and component loader points at the new paths (all pages checked locally). old root addresses are gone.
- frameworks/index.html: fixed `/code/element.css` -> `/elements/lmnts.css`. code/herond.html: removed the missing `code/herond.js` include and the second slider start (index.html starts it).

### from 2nd.fndt
- code/herond.ctrl.js v0.05: hero auto-play (10 s per slide, `intervalTime`); pauses while dragging, timer resets after any click or swipe.
- code/barnd.ctrl.js: dragging the carousel no longer also clicks the card under the mouse.
- code/barnd.css: simpler layout without the 100vw trick; fixed a broken comment that dropped the scrollbar style.
- global.css section 6: `.grid-two-one` uses `minmax(0, 1fr)` on phones, so the carousel can't stretch the page sideways.
- footer dropup (round button, small menu upward): elements/footer.html + global.css section 13. plain css + one-line onclick, no js file.

### from mgmt.srvcs
- navbar dropdown (parent link + triangle; hover on desktop, tap the triangle on phones, one open at a time): elements/navbar.html + global.css section 12.
- logo_prsnt.png: new prsnt-cms logo. favicon.png (64x64) made from it; every page links `/favicon.png`.

### from pubs
- pg/b02/index.html: gate redirect detects the bXX folder from the URL; relative redirect on localhost, absolute `/pg/<folder>/page-00-00-title.html` on Vercel. New decks: copy pg/b02 to pg/bXX and set `authType` (matching env key on Vercel).
- contents/page-00-01-flow-exmp.html + diagram-00-01-01.txt: new diagram page template (ASCII diagram, mermaid source, draw.io xml companion, second external breadcrumb line).
- contents/page-00-02-formula.html: new method/formula page template built from `<pre>` blocks.
- pg/b02/page-02-00-mdl.html: image slot pattern inside a slide card.
- index.html: loader skips placeholders that already have markup.
- elements/all-pages.html: links to the new templates.
- protection hardened (Vercel only, localhost unchanged):
  - new `gates.config.js`: list of protected folders and their password env keys.
  - new `lib/gate.js`: shared helpers (signed cookies, constant-time compare).
  - `middleware.js`: checks a signed, per-folder HttpOnly cookie; gates every file in a protected folder (including .txt); fails closed without `SESSION_SECRET`.
  - `api/verify.js`: only accepts keys from gates.config.js, sets the signed cookie, answers "already logged in?" checks, slows down wrong guesses.
  - gate pages (`pg/b02`, `posts/p01`): ask the server for the login state instead of reading a cookie; no longer set the forgeable `b_access` cookie.
  - new Vercel env var needed: `SESSION_SECRET`.
- .gitignore: tree.txt. git-files.txt: tracked-file manifest.
