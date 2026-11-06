# Changelog

All notable changes to prsnt-cms are listed here.

## v0.05

### Security

v0.04 did not really protect folders. Its login cookie (`b_access=granted`) was a fixed value that anyone could set in their own browser. Any address containing the word "index" skipped the check. The password endpoint would also compare against any environment variable the request named. v0.05 replaces all of this:

- Login cookies are signed with a new required secret, `SESSION_SECRET`, and each protected folder gets its own HttpOnly cookie. One password never opens another folder.
- If `SESSION_SECRET` is not set, protected folders return an error instead of opening.
- Everything inside a protected folder needs a login: pages, `.txt` cards, images and CSS. `/posts/` is covered as well as `/pg/`.
- `gates.config.js` (new) lists the protected folders and the environment variable that holds each password. `api/verify.js` only accepts those keys.
- `lib/gate.js` (new) holds the shared helpers: signed tokens and a constant-time password compare.
- `api/verify.js` can also answer whether the visitor is already logged in, and it slows down wrong guesses.
- The gate pages (`pg/b02/index.html`, `posts/p01/index.html`) ask the server for the login state instead of setting their own cookie. The redirect after login works for any `pg/bXX` folder.
- Localhost is unchanged: every folder stays open during development.
- **Upgrade note:** add `SESSION_SECRET` to your Vercel environment variables.

### Added

- **Navbar dropdowns:** a parent link plus a small triangle. They open on hover on desktop and on a tap of the triangle on phones. The menu never collapses into a hamburger icon.
- **Footer drop-up menu:** a round button that opens a small menu upward.
- **Menus close by themselves:** a dropdown or the drop-up closes when you tap anywhere else or press Esc. Only one menu is open at a time, and hovering a dropdown hides one opened earlier by click.
- **Sticky navbar:** it stays at the top while you scroll. On phones, where the navbar has two rows, the logo row scrolls away and the menu row stays.
- **Hero slider auto-play:** 10 seconds per slide (`intervalTime` in `code/herond.ctrl.js`). It pauses while you drag, and the timer restarts after any click or swipe.
- **Presentation cards:**
  - The first card loads by itself when a slide opens (`data-first="aa"`), so you no longer copy it into the slide HTML.
  - The button of the card on screen is highlighted.
  - The contents list marks the current slide.
  - Cards that buttons pointed at but that were missing are added as empty cards.
- **New page templates:**
  - `contents/page-00-01-flow-exmp.html` is a diagram page (ASCII diagram, Mermaid source, draw.io companion file).
  - `contents/page-00-02-formula.html` is a method or formula page.
  - `pg/b02/page-02-00-mdl.html` shows the image slot inside a slide card.
- **Font roles** in `global.css`: `--font-head`, `--font-text`, `--font-body` and `--font-mono`. Change a font in one place.
- **Link styles:** links look like normal text by default. Add `lnk-bold` or `lnk-line` to a link for a visible style.
- **New logo:** `logo_prsnt.png`, with a matching `favicon.png` used by every page.
- **Docs:** a rewritten README and this changelog.

### Changed

- **Folder layout:**
  - Shared parts moved to `elements/`: navbar, footer, right columns, about, all-pages and `lmnts.css` (was `code/elements.css`).
  - `page-00-publications.html` moved to `contents/`.
  - Every link and component loader points to the new paths. The old root addresses no longer exist.
- **Frameworks:** the page uses absolute paths, and its controller is now `frameworks/frworks.js` (`window.Frmwrk`).
- **`vercel.json`:** `cleanUrls: false` and `trailingSlash: true`, so folder gate pages resolve correctly.
- **Brand carousel (`code/barnd.css`):** a simpler layout without the full-viewport-width trick.
- **`code/herond.css`:** the slider was defined twice in one file and is now a single block with the same result.

### Fixed

- **Hero slider:** it started twice. `code/herond.html` no longer starts it or includes the missing `code/herond.js`, and `index.html` starts it once.
- **Hero dots:** the dots under the slides were invisible because their styles depended on classes the template does not load.
- **Brand carousel:**
  - Dragging no longer opens the card under the mouse.
  - A slightly shaky click still opens it, because a drag only starts after 5px.
- **Phone layout:** wide rows such as the carousel no longer stretch the page sideways (`.grid-two-one` uses `minmax(0, 1fr)`).
- **Broken scrollbar style:** a broken comment in `code/barnd.css` silently dropped it.
- **Frameworks stylesheet:** `frameworks/index.html` linked the missing `code/element.css`.
- **Component loading:** the component loader in `index.html` skips placeholders that already contain markup.

### Removed

- The forgeable `b_access` cookie and the "index" bypass in `middleware.js`.
- Redundant CSS rules in `global.css`.
