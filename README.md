# prsnt-cms

A plain HTML, CSS and JavaScript website template for publications and presentations. It has no framework, no build step and no `npm install`.

prsnt-cms gives you a front page (hero slider, content row, brand carousel), content pages, framework-style pages, and a card-based presentation module. Any folder can be password protected when the site is hosted on Vercel. During development on localhost everything stays open, so you never type a password while you work.

Sister template for Next.js: [wrt-cms](https://github.com/fndt-xyz/wrt-cms)

---

## Why prsnt-cms exists

prsnt-cms comes from [wrt-cms](https://github.com/fndt-xyz/wrt-cms), a Next.js template built on the same idea: keep content apart from code, so writers write and developers build.

Deploying and maintaining a Next.js site on Vercel can take more effort than a simple site needs. prsnt-cms rebuilds the same modules and the same layout rules in plain HTML, CSS and JavaScript, so you can:

1. **Run it as a real website.** Open it with any static web server, or deploy it to Vercel as it is.
2. **Use it as a mock-up for a Next.js site.** Every module is small and readable, which makes prsnt-cms an easy blueprint for an AI assistant or a developer to port to Next.js.

Fixes and new modules are made here first, in plain code, and then carried over to wrt-cms.

## Design philosophy: two columns on a laptop, one column on a phone

Most visitors read on a phone, and on a phone every website ends up as a single column. prsnt-cms is designed around that fact:

- **Laptop and desktop:** two main columns. The wide left column holds the content and can split into two or three columns inside a card. The narrow right column holds navigation and context.
- **Phone:** everything falls back into one readable column, in a deliberate order: content first, then the right column. Nothing is hidden or squeezed.
- **Menus stay menus.** The navbar never collapses into a hamburger icon. On a phone the menu moves under the logo. Dropdowns open below their parent, the footer has a small drop-up menu, and both close when you tap anywhere else or press Esc.
- **The navbar is sticky.** On a phone the logo row scrolls away and only the menu row stays at the top, so the bar takes as little of the screen as possible.

The same rules hold on complex pages. A presentation built with the card module works as a presentation on a laptop and still reads well on a phone.

## Features

| Module | Where | What it does |
| --- | --- | --- |
| Hero slider | `code/herond.html`, `herond.css`, `herond.ctrl.js` | Full-width slides with arrows, labels and dots. Swipe or drag to change slides, and auto-play pauses while you touch it. |
| Content row | `code/row01.html`, `row01.css` | A row of three image or text tiles that wraps on small screens. |
| Brand carousel | `code/barnd.html`, `barnd.css`, `barnd.ctrl.js` | A horizontal track of cards you can scroll, drag or move with buttons. A drag never opens the card by accident. |
| Frameworks | `frameworks/` | One page whose content changes without changing the page or its link. Sections load from small HTML files listed in `frworks.js`. |
| Presentation (card method) | `pg/b02/`, `posts/p01/` | Slides with a left and a right card area. Buttons load cards from `.txt` files into the same slide, and the first card loads by itself. A slide can also hold its content directly in the HTML. |
| Content pages | `contents/` | Ready-made page templates: an example page, a diagram page (ASCII, Mermaid and draw.io sources) and a formula/method page. |
| Shared elements | `elements/` | Navbar, footer and right-column menus, loaded into every page, plus the about and all-pages pages. |
| Folder protection | `middleware.js`, `api/verify.js`, `lib/gate.js`, `gates.config.js` | Password protection per folder on Vercel, using signed HttpOnly cookies. Off on localhost. |

The styling is split into layers:

- `global.css` is the template base and stays generic. Fonts are set once there by role (`--font-head`, `--font-text`, `--font-body`, `--font-mono`).
- A site built on the template adds its own look in a separate file loaded right after it, for example `code/site.css`.
- A page's `local.css` only adds that page's blocks.

## Quick start

```bash
git clone https://github.com/fndt-xyz/prsnt-cms.git
cd prsnt-cms
./start.sh          # starts python3 -m http.server on port 8085
xdg-open http://localhost:8085
```

Any static file server works. `start.sh` is only a shortcut. To stop it, run `fuser -k 8085/tcp`.

## Folder layout

```
prsnt-cms/
├── index.html          front page (hero, row, carousel)
├── global.css          template base styles
├── elements/           navbar, footer, right columns, about, all-pages
├── code/               front page modules
├── contents/           content pages
├── frameworks/         framework pages (content changes, link stays)
├── pg/b02/             presentation, password protected on Vercel
├── posts/              posts; posts/p01 is a copy of the presentation, open by default
├── middleware.js       Vercel folder protection
├── api/verify.js       password check endpoint
├── lib/gate.js         signed cookie helpers
└── gates.config.js     list of protected folders
```

## How to use it

### Add a page

1. Copy `contents/page-00-00-example.html` and rename it.
2. Write your text inside `.view-content`. The navbar, footer and right column load by themselves.
3. Link the new page from `elements/navbar.html`, `elements/footer.html` or `elements/all-pages.html`.

### Edit the menus

- **Navbar:** in `elements/navbar.html`, copy one whole `<div class="nav-dd">` block to add a dropdown. To turn a dropdown back into a plain link, keep only its parent `<a>`.
- **Footer drop-up:** edit the links inside `.dropup-menu` in `elements/footer.html`.

### Build a presentation with cards

Each slide is one HTML page, and its cards are small `.txt` files in the same folder, named `page-<slide>-<area>-<card>.txt`:

- `page-02-01-aa.txt` is slide 02, right area, card aa.
- `page-02-02-aa.txt` is slide 02, left area, card aa.

Each card button loads its card into the slide, and the page link stays the same. The right area has `data-first="aa"`, so card aa shows when the slide opens, and you never copy a card into the HTML. If you want a slide without cards, write the content directly in the HTML, as slide 04 does.

To start a new presentation, copy `pg/b02` to `pg/bXX`. On localhost, cards are fetched fresh every time, so you see your edits as soon as you reload. On Vercel the browser may cache cards, so slides open faster.

### Protect a folder (Vercel only)

Protection runs only on Vercel. On localhost every folder is open, including when you open it from another machine on your network.

Set these environment variables on Vercel:

- `SESSION_SECRET`: one long random string per site, used to sign login cookies (for example `openssl rand -hex 32`). Without it, protected folders return an error instead of opening.
- One password variable per protected folder, named in `gates.config.js` (for example `B02_KEY`).

Then follow these steps:

1. Add `{ path: '/your/folder', key: 'YOUR_KEY' }` to `gates.config.js`.
2. Add `YOUR_KEY` (the password) on Vercel.
3. If the folder is outside `/pg/` and `/posts/`, add it to `matcher` in `middleware.js`.
4. Give the folder a gate `index.html` (copy `pg/b02/index.html`) and set the same key in it.

Each folder gets its own signed cookie, so one password never opens another folder. Everything inside a protected folder needs the login, including pages, `.txt` cards, images and CSS. `pg/b02` is protected by default. `posts/p01` is the same presentation left open, so you can show both a protected and an open version.

## Example workflow: from mock-up to Next.js

1. **Build the site in prsnt-cms.** Write the real pages, menus and presentations, and check them on a laptop and a phone with `./start.sh`.
2. **Give an AI assistant two inputs:** the [wrt-cms](https://github.com/fndt-xyz/wrt-cms) template and your prsnt-cms site.
3. **Ask it to produce a Next.js site:** wrt-cms structure and components, your content and layout. Ask for the result as a zip.
4. **Deploy the Next.js site.** wrt-cms does not need the folder protection from prsnt-cms, because Next.js can protect pages in other ways.

You can also skip steps 2 to 4 and publish the prsnt-cms site directly.

## Deploy

- **Vercel:** import the repository and deploy. No build command or framework preset is needed. Set `SESSION_SECRET` and the folder passwords if you use protection.
- **Any static host:** upload the files. Everything works except folder protection, which needs Vercel's middleware and `api/` functions.

## Credits

- [Vercel](https://vercel.com) for hosting, Edge Middleware and serverless functions, which make the folder protection possible.
- [Next.js](https://nextjs.org), created by Vercel and its open-source contributors. Its ideas shaped the structure of wrt-cms and, through it, prsnt-cms, even though this template is plain HTML.
- [Node.js](https://nodejs.org), created by Ryan Dahl and maintained by the OpenJS Foundation and its contributors. It runs the protection functions on Vercel.
- Fonts from [Google Fonts](https://fonts.google.com): Open Sans (Steve Matteson), Inter (Rasmus Andersson) and Lato (Łukasz Dziedzic).

## License

- Code: [GNU General Public License v3.0](LICENSE) (GPL-3.0)
- Content: [Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/) (CC BY-SA 4.0)

See [LICENSE.html](LICENSE.html) for details.
