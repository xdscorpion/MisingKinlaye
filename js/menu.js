/* ==========================================
   MisingKinlaye — Mobile Navigation
   Toggles the primary nav as a slide-in panel
   below 950px, where the nav is otherwise
   hidden. Shared by every page — no page-
   specific menu logic.
========================================== */

(function () {

    "use strict";

    document.addEventListener("DOMContentLoaded", function () {

        const toggle = document.querySelector(".nav-toggle");
        const nav = document.getElementById("site-nav");

        if (!toggle || !nav) {
            return;
        }

        function closeMenu() {
            nav.classList.remove("open");
            toggle.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open menu");
        }

        function openMenu() {
            nav.classList.add("open");
            toggle.classList.add("open");
            toggle.setAttribute("aria-expanded", "true");
            toggle.setAttribute("aria-label", "Close menu");
        }

        toggle.addEventListener("click", function () {
            if (nav.classList.contains("open")) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close after choosing a link, and on Escape.
        nav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && nav.classList.contains("open")) {
                closeMenu();
                toggle.focus();
            }
        });

        // If the viewport grows past the mobile breakpoint while the
        // menu is open, reset it so it doesn't get stuck mid-transition.
        window.addEventListener("resize", function () {
            if (window.innerWidth > 950 && nav.classList.contains("open")) {
                closeMenu();
            }
        });

    });

}());
