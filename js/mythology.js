/* ==========================================
   MisingKinlaye — Mythology
   Page-specific behaviour. Loaded after
   /js/script.js on mythology.html only.
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ===============================
       Scroll reveal for myth blocks
    =============================== */

    const revealTargets = document.querySelectorAll(".myth-reveal");

    if (revealTargets.length) {

        const revealObserver = new IntersectionObserver((entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("myth-show");
                    revealObserver.unobserve(entry.target);
                }

            });

        }, { threshold: 0.2 });

        revealTargets.forEach((el) => revealObserver.observe(el));

    }

    /* ===============================
       Light up timeline nodes as
       they enter view (works for
       both the horizontal desktop
       strip and the vertical mobile
       stack, since it observes the
       node itself rather than scroll
       position)
    =============================== */

    const timelineWrap = document.querySelector(".myth-timeline-wrap");
    const nodes = document.querySelectorAll(".myth-node");

    if (nodes.length) {

        const nodeObserver = new IntersectionObserver((entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("myth-lit");
                }

            });

        }, {
            root: timelineWrap && window.innerWidth > 950 ? timelineWrap : null,
            threshold: 0.6
        });

        nodes.forEach((node) => nodeObserver.observe(node));

    }

    /* ===============================
       Pédong rain particles
    =============================== */

    const rain = document.querySelector(".myth-rain");

    if (rain) {

        const dropCount = 26;

        for (let i = 0; i < dropCount; i++) {

            const drop = document.createElement("span");

            drop.style.left = Math.random() * 100 + "%";
            drop.style.animationDuration = (1.4 + Math.random() * 1.6) + "s";
            drop.style.animationDelay = (Math.random() * 3) + "s";
            drop.style.opacity = (0.3 + Math.random() * 0.5).toString();

            rain.appendChild(drop);

        }

    }

    /* ===============================
       Ending shimmer particles
    =============================== */

    const particles = document.querySelector(".myth-particles");

    if (particles) {

        const particleCount = 18;

        for (let i = 0; i < particleCount; i++) {

            const p = document.createElement("span");

            p.style.left = Math.random() * 100 + "%";
            p.style.animationDuration = (4 + Math.random() * 4) + "s";
            p.style.animationDelay = (Math.random() * 6) + "s";

            particles.appendChild(p);

        }

    }

});
