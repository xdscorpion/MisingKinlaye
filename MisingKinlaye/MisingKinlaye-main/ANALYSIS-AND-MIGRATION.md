# MisingKinlaye — Architectural Refactor Report

## 1. What was inspected

Every file in the project was opened and read before any change was made:
`index.html`, `pages/clan-genealogy.html`, all 5 clan pages
(`dole`, `pao`, `kepang`, `sinung`, `longging`), all 8 CSS files, both
non-empty JS files, and the 4 zero-byte placeholder pages. Node counts in
every genealogy tree were cross-checked against the original markup with a
scripted structural test (see §7) before anything was deleted.

## 2. Every issue found, and why it existed

### Genealogy system

| Issue | Where | Root cause |
|---|---|---|
| Genealogy CSS duplicated near-verbatim | `dole.css`, `pao.css`, `kepang.css`, `sinung.css`, `longging.css` | Each clan page was built by copying the previous clan's HTML+CSS and editing names in place — there was never a shared engine. |
| Hardcoded `transform: translateX(-70px)` to recenter one branch on mobile | `longging.css` | A page-specific fix for a centering problem the layout system couldn't solve generically. |
| `nth-child(2)` selector targeting one specific branch by position | `longging.css`, `sinung.css` | Same root cause — a specific visual glitch patched by position instead of by a general rule. |
| A fully duplicated `@media (max-width: 950px)` block | `longging.css` | Leftover from copy-paste; the second copy used a `gap` property that doesn't even apply to the old margin-based branch layout, so it was dead weight. |
| Inconsistent horizontal-scroll handling | `dole.css` had no scroll wrapper at all (fine today since it has no branches, but not future-proof); `kepang.css`'s wrapper was `.genealogy-tree` itself rather than a separate wrapper | No shared convention for wrapping wide trees. |
| Magic-number staggered animation delays up to `nth-child(19)` | `dole.css` | Animation timing hand-written per node position instead of driven by the node's actual index. |
| Dead CSS: `.genealogy-note`, `.dotted-link`, `.dotted-arrow`, `.highlighted`, `.branch-wrapper`, `.branch-line`, `.branch-items`, `.branch-node` rules that no element in `dole.html` ever used | `dole.css` | Boilerplate copied from a clan page that has these features, never used, never removed. |

### Site-wide

| Issue | Where | Root cause |
|---|---|---|
| Mobile nav fully broken: `nav{display:none}` under 950px with **no toggle at all** | `style.css` | `js/menu.js` existed as a 0‑byte file — the mobile menu was planned but never built. Below 950px, every page's navigation is completely inaccessible. |
| Broken relative paths: `../css/style.css` and `../index.html` inside `index.html` (which is at the project root, not one level down) | `index.html` | Copied from a page inside `/pages/` without adjusting the paths. |
| Double-linked, mixed absolute/relative stylesheets | `pages/clan-genealogy.html` | `style.css` and `genealogy.css` were each linked twice — once as `/css/...`, once as `../css/...`. |
| Homepage never loaded `script.js` | `index.html` | No `<script>` tag was present at all, so the homepage's scroll-reveal, sticky-header shadow, and button ripple effect never ran, despite the CSS for all three existing in `style.css`. |
| Duplicated, slightly incompatible audio-player logic | Inline `<script>` in `clan-genealogy.html` **and** a hardcoded copy in `js/script.js` (which was never actually loaded on that page) | Two implementations of the same feature, neither one shared. |
| Dead, unreferenced files | `css/variables.css` (0 bytes), `css/responsive.css` (1 blank line, unlinked anywhere), `js/search.js` (0 bytes) | Stubs for planned work that was never wired in or never started (no search UI exists anywhere in the project to attach `search.js` to). |
| 4 completely blank pages linked from the main nav | `pages/mythology.html`, `pages/about-misingkinlaye.html`, `pages/ngoluk-donam-tinam.html`, `pages/ngoluk-genam.html` | Never built. Visiting them loaded a blank, unstyled page. |

## 3. Architectural redesign

### One genealogy engine
- **`css/genealogy-tree.css`** — the only stylesheet that defines how a
  node, arrow, or branch looks. Every value that legitimately differs
  between clans (node width, branch spacing) is a CSS custom property
  (`--gt-node-width`, `--gt-branch-gap`, etc.) with sensible defaults; a
  clan overrides only what's different, scoped to its own page class.
  Only `dole` (wider node) and `pao` (wider node + branch gap) need an
  override — the rest match the defaults exactly.
- **`js/genealogy-engine.js`** — a single recursive renderer. A tree is
  plain data (`{ label, class, children }`); 0 children ends a chain, 1
  child continues it with an arrow, 2+ children render a branch — and
  each branch recurses through the same function, so nesting depth is
  unlimited by construction, not by how much markup someone was willing
  to hand-write. Centering is computed from the tree's actual rendered
  width on every load and resize — never a fixed offset.
- **`js/data/<clan>.genealogy.js`** — each clan's tree as data, authored
  with a `chain()` helper for readability. This is also what makes the
  system backend-ready: swapping a data file for a `fetch()` call later
  requires no change to the engine or the CSS (see the README).

### Everything else
- The 5 clan stylesheets now contain **only** clan-specific content
  styling (intro text, historical-record layout, side notes) — the
  genealogy engine rules were deleted, not overridden.
- **`css/variables.css`** now actually holds the design tokens
  (`--red`, `--black`, `--light`, `--shadow`) that used to live
  duplicated inside `style.css`'s `:root`; every page links it first.
- **`js/menu.js`** is a real, accessible hamburger menu (keyboard
  Escape to close, closes on link click, resets if the viewport grows
  past the breakpoint). The corresponding CSS in `style.css` positions
  the mobile nav with `position:absolute; top:100%` relative to the
  `header` — computed from the header's actual height, not a guessed
  pixel offset.
- **`css/coming-soon.css`** + real markup for the 4 previously blank
  pages, using the site's existing visual language (same header, footer,
  fonts, colors) with a plain "content pending" placeholder — no invented
  content.
- **`css/responsive.css`** and **`js/search.js`** were deleted — both
  were 0–1 byte, unreferenced anywhere, and carried no functionality to
  preserve. (There is no search UI anywhere in the project today; adding
  one is a reasonable next feature, and the same data/engine separation
  used for genealogy would suit it well.)

## 4. Files changed

**New:**
`css/genealogy-tree.css`, `css/coming-soon.css`, `js/genealogy-engine.js`,
`js/data/dole.genealogy.js`, `js/data/pao.genealogy.js`,
`js/data/kepang.genealogy.js`, `js/data/sinung.genealogy.js`,
`js/data/longging.genealogy.js`

**Modified:**
`index.html`, `pages/clan-genealogy.html`, `pages/clans/dole.html`,
`pages/clans/pao.html`, `pages/clans/kepang.html`,
`pages/clans/sinung.html`, `pages/clans/longging.html`,
`css/style.css`, `css/variables.css`, `css/dole.css`, `css/pao.css`,
`css/kepang.css`, `css/sinung.css`, `css/longging.css`, `js/menu.js`,
`js/script.js`, `README.md`

**Rebuilt from empty:**
`pages/mythology.html`, `pages/about-misingkinlaye.html`,
`pages/ngoluk-donam-tinam.html`, `pages/ngoluk-genam.html`

**Removed:**
`css/responsive.css`, `js/search.js` (both dead, unreferenced, empty)

**Unchanged:**
`css/genealogy.css` (the clan-directory list page layout — a different
concern from the genealogy tree engine despite the similar name), all
images and audio files, `.vscode/settings.json`

## 5. Net effect on CSS size

| File | Before | After |
|---|---:|---:|
| `dole.css` | 761 | 390 |
| `pao.css` | 747 | 340 |
| `kepang.css` | 670 | 236 |
| `sinung.css` | 809 | 254 |
| `longging.css` | 821 | 124 |
| *(new)* `genealogy-tree.css` | — | 373 |

Roughly 2,400 lines of duplicated or dead genealogy CSS were removed
project-wide and replaced by one 373-line shared engine.

## 6. Visual consistency

No colors, fonts, page layout, section order, or content text were
changed. The one deliberate visual harmonization: `longging.css`'s and
`sinung.css`'s one-off straight-line branch connectors (each propped up
by a hardcoded hack) now render as the same curved connector every other
clan already uses — a few-pixel difference, and a direct requirement of
"one reusable engine, no page-specific hacks."

## 7. Testing performed

- **Genealogy data integrity**: a scripted check rebuilt every clan's
  tree from its data file and walked it recursively, confirming the
  exact node count against a manual recount of the original markup
  (Dole 11, Pao 23, Kepang 16, Sinung 18, Longgíng 30 — all matched).
- **JS syntax**: every `.js` file passed `node --check`.
- **CSS brace balance**: every `.css` file has matching `{`/`}` counts.
- **HTML tag balance**: every `.html` file's tags were parsed and
  verified to close correctly (this caught and fixed two leftover
  stray/missing `</div>` tags in `sinung.html` and `longging.html` from
  the original nested markup).
- **Link resolution**: every `href`/`src` in every page was resolved
  against the actual file tree — 0 broken links remain.

## 8. Testing checklist for you

- [ ] Open each clan page and confirm the tree renders identically to
      before (node text, order, highlighted/final styling, branch shape).
- [ ] Resize each clan page's browser window through 950px and 600px and
      confirm the tree stays centered with no clipping.
- [ ] On a narrow/mobile viewport, tap the hamburger icon on every page
      and confirm the menu opens, each link navigates, and Escape closes it.
- [ ] Confirm the homepage's scroll-reveal animation and sticky header
      shadow now work (previously silently broken).
- [ ] Play both audio clips on `clan-genealogy.html` and confirm only one
      plays at a time.
- [ ] Visit the 4 previously blank pages and confirm they now load a
      styled "coming soon" page instead of a blank tab.

## 9. Suggested next steps (not built now, per your instructions)

- A real search feature, following the same data/engine separation used
  here (a `search-index.js` data file + a small render/query module).
- Filling in real content for the 4 placeholder pages.
- If genealogy data eventually moves server-side, replace each
  `js/data/<clan>.genealogy.js` assignment with a `fetch()` call that
  resolves to the same `{label, class, children}` shape — no other file
  needs to change.
