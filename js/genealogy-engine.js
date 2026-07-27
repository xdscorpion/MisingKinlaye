/* ==========================================
   MisingKinlaye — Genealogy Engine
   One reusable renderer for every clan's
   genealogy tree.

   A tree is plain data:

     {
       label: "Do:ni (Tani)",
       class: "root",           // optional: root | final | highlighted
       children: [ ...more nodes, recursively... ]
     }

   - 0 children  -> chain ends here.
   - 1 child     -> linear chain, connected by an arrow.
   - 2+ children -> a branch: rendered inside
                    .branch-wrapper > .branch-items > .branch-node,
                    and each branch-node recurses through this same
                    function, so branches can nest to any depth.

   Today the data lives in /js/data/<clan>.genealogy.js as a plain
   object. Later it can just as easily come from an API response —
   nothing else in this file, or in genealogy-tree.css, needs to
   change for that.
========================================== */

(function () {

    "use strict";

    let nodeCounter = 0;

    function makeNode(nodeData) {

        const el = document.createElement("div");
        el.className = "genealogy-node" + (nodeData.class ? " " + nodeData.class : "");
        el.textContent = nodeData.label;
        el.style.setProperty("--gt-i", String(nodeCounter++));
        return el;

    }

    function makeArrow(dotted) {

        const el = document.createElement("div");

        if (dotted) {
            el.className = "arrow dotted";
            el.setAttribute("aria-hidden", "true");
            el.innerHTML = '<div class="dotted-line"></div><div class="arrow-head">\u2193</div>';
        } else {
            el.className = "arrow";
            el.setAttribute("aria-hidden", "true");
            el.textContent = "\u2193";
        }

        return el;

    }

    /**
     * Renders `node` and its descendants into `container`,
     * following a straight chain until a branch point is hit.
     */
    function renderChain(container, node) {

        let current = node;

        while (current) {

            container.appendChild(makeNode(current));

            const children = current.children || [];

            if (children.length === 0) {
                return;
            }

            if (children.length === 1) {
                container.appendChild(makeArrow(children[0].linkStyle === "dotted"));
                current = children[0];
                continue;
            }

            // Branch point: multiple children share one connector bar.
            const wrapper = document.createElement("div");
            wrapper.className = "branch-wrapper";

            const items = document.createElement("div");
            items.className = "branch-items";

            children.forEach(function (child) {
                const branchNode = document.createElement("div");
                branchNode.className = "branch-node";
                renderChain(branchNode, child);
                items.appendChild(branchNode);
            });

            wrapper.appendChild(items);
            container.appendChild(wrapper);
            return;

        }

    }

    /**
     * Centers the tree horizontally inside its scroll wrapper.
     * Computed from the tree's actual rendered width every time —
     * never a fixed offset — so it stays correct at any viewport
     * size and for any tree shape.
     */
    function centerTree(wrapper) {

        if (!wrapper) return;

        requestAnimationFrame(function () {
            const overflow = wrapper.scrollWidth - wrapper.clientWidth;
            if (overflow > 0) {
                wrapper.scrollLeft = overflow / 2;
            }
        });

    }

    /**
     * Renders a genealogy tree into the element with id `mountId`,
     * using the data object `data`. Call once per clan page.
     */
    function renderGenealogy(mountId, data) {

        const mount = document.getElementById(mountId);

        if (!mount || !data) return;

        nodeCounter = 0;
        mount.innerHTML = "";
        renderChain(mount, data);

        const wrapper = mount.closest(".genealogy-wrapper");
        centerTree(wrapper);

        window.addEventListener("resize", function () {
            centerTree(wrapper);
        });

    }

    /**
     * Builds a linear chain node from a flat, readable list — this is
     * how clan data files are authored, instead of hand-nesting
     * objects to match each generation's depth.
     *
     *   chain(["Do:ni (Tani)", "Nibo", "Bogo"], { label: "Pao", class: "highlighted" })
     *
     * `items` is an array of ancestor names. Each item is either a
     * plain string, or a [label, class] pair when a step needs a
     * modifier (e.g. ["Sinung", "highlighted"], or ["Do:ni (Tani)",
     * "root"] for the very first ancestor of a full tree). chain()
     * is also used to build branch subtrees, so it never guesses
     * which node is the root — tag it explicitly.
     *
     * `tail` is the node the chain continues into — a plain leaf
     * ({ label, class: "final" }), or a branch point ({ label,
     * children: [ ...subtrees, each built with chain() too... ] }).
     */
    function chain(items, tail) {

        let root = null;
        let prev = null;

        items.forEach(function (item, i) {

            let label = item;
            let cls;
            let linkStyle;

            if (Array.isArray(item)) {
                label = item[0];
                cls = item[1];
                linkStyle = item[2];
            }

            const node = { label: label, class: cls, linkStyle: linkStyle, children: [] };

            if (prev) {
                prev.children.push(node);
            } else {
                root = node;
            }

            prev = node;

        });

        if (tail) {
            prev.children.push(tail);
        }

        return root;

    }

    window.MisingGenealogy = { render: renderGenealogy, chain: chain };

}());
