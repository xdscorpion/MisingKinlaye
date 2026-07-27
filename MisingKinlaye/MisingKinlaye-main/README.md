# MisingKinlaye

A digital archive dedicated to preserving the history, language, culture and
heritage of the Mising people.

## Project structure

```
index.html                  Homepage
pages/
  clan-genealogy.html        Directory of all clans
  clans/<clan>.html           One page per clan
  mythology.html, about-misingkinlaye.html,
  ngoluk-donam-tinam.html, ngoluk-genam.html   Placeholder pages (content pending)
css/
  variables.css               Design tokens (colors, shadows) — linked first, on every page
  style.css                   Site-wide layout, header/nav, homepage sections
  genealogy-tree.css          The genealogy tree engine — shared by every clan page
  genealogy.css               Layout for the clan directory page (pages/clan-genealogy.html)
  coming-soon.css             Shared styling for placeholder pages
  <clan>.css                  Page-specific content styling for one clan (no tree/engine CSS)
js/
  genealogy-engine.js         Recursive renderer for genealogy trees + chain() data helper
  menu.js                     Mobile hamburger menu toggle, shared by every page
  script.js                   Site-wide interactions: scroll reveal, sticky header, audio players
  data/<clan>.genealogy.js    One clan's genealogy tree, as plain data
```

## Adding a new clan's genealogy tree

The genealogy engine is shared — a new clan page needs no new CSS or JS of
its own for its tree. Only:

1. **Write the data** in `js/data/<clan>.genealogy.js`:

   ```js
   window.MISING_GENEALOGY_<CLAN> = MisingGenealogy.chain(
       [["Do:ni (Tani)", "root"], "Nibo", "Bogo", ["<Clan>", "highlighted"]],
       { label: "Descendant", class: "final" }
   );
   ```

   `chain()` builds a linear ancestor list. Pass a `tail` node with a
   `children` array to branch into multiple descendant lines — each child
   can itself be built with `chain()`, to any depth.

2. **Add the mount point** to the page's HTML:

   ```html
   <div class="genealogy-wrapper">
       <div class="genealogy-tree" id="genealogy-root" role="img"
           aria-label="Genealogy chain from ... to ..."></div>
   </div>

   <script src="/js/genealogy-engine.js"></script>
   <script src="/js/data/<clan>.genealogy.js"></script>
   <script>MisingGenealogy.render("genealogy-root", window.MISING_GENEALOGY_<CLAN>);</script>
   ```

3. Link `/css/genealogy-tree.css` in the page `<head>` (after `style.css`).

That's it — no branch markup to hand-write, no page-specific CSS to copy.
If a clan needs different node sizing or branch spacing than the default,
set it once via custom properties scoped to that page's root class, e.g.:

```css
.<clan>-page{
    --gt-node-width: 230px;
    --gt-branch-gap: 50px;
}
```

## Design tokens

Colors and shared values (`--red`, `--black`, `--light`, `--shadow`, etc.)
live in `css/variables.css`. Every page links it before `style.css`.

## Future: data from an API

`js/data/<clan>.genealogy.js` files currently assign a plain object to a
global variable. `genealogy-engine.js` only ever consumes that object —
it has no knowledge of where it came from. Swapping a static data file for
an API response later is a matter of replacing the assignment with a
`fetch()` call that resolves to the same shape; nothing in the engine or
CSS needs to change.
