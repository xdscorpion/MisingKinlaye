/* ==========================================
   MisingKinlaye
   Main JavaScript
========================================== */

/* ===============================
   Reveal Animation
=============================== */

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, {
    threshold: 0.15
});

document.querySelectorAll("section").forEach((section) => {
    section.classList.add("hidden");
    observer.observe(section);
});

/* ===============================
   Sticky Header Shadow
=============================== */

const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

/* ===============================
   Active Navigation
=============================== */

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach((section) => {

        const sectionTop = section.offsetTop - 150;

        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute("id");
        }

    });

    navLinks.forEach((link) => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }

    });

});

/* ===============================
   Button Ripple
=============================== */

document.querySelectorAll(".btn").forEach((button) => {

    button.addEventListener("click", function (e) {

        const circle = document.createElement("span");

        circle.classList.add("ripple");

        this.appendChild(circle);

        const d = Math.max(this.clientWidth, this.clientHeight);

        circle.style.width = d + "px";
        circle.style.height = d + "px";

        const rect = this.getBoundingClientRect();

        circle.style.left = (e.clientX - rect.left - d / 2) + "px";
        circle.style.top = (e.clientY - rect.top - d / 2) + "px";

        setTimeout(() => {
            circle.remove();
        }, 600);

    });

});

/* ===============================
   Audio Players
   Toggles any button/audio pair built like:
   <button class="audio-button" id="xButton"><span>▶</span></button>
   <audio id="xAudio">...</audio>
   Add a pair's ids to `audioPlayerIds` below — no page-specific
   script is needed anywhere else in the project.
=============================== */

document.addEventListener("DOMContentLoaded", function () {

    const audioPlayerIds = [
        { audio: "opinAudio", button: "opinButton" },
        { audio: "erangAudio", button: "erangButton" }
    ];

    const audioPlayers = audioPlayerIds
        .map(function (ids) {
            return {
                audio: document.getElementById(ids.audio),
                button: document.getElementById(ids.button)
            };
        })
        .filter(function (item) {
            return item.audio && item.button;
        });

    audioPlayers.forEach(function (item) {

        const icon = item.button.querySelector("span") || item.button;

        item.button.addEventListener("click", function () {

            // Stop all other audio
            audioPlayers.forEach(function (other) {

                if (other.audio !== item.audio) {

                    other.audio.pause();
                    other.audio.currentTime = 0;

                    other.button.classList.remove("playing");
                    (other.button.querySelector("span") || other.button).textContent = "▶";

                }

            });

            // Toggle current audio
            if (item.audio.paused) {

                item.audio.play();

                item.button.classList.add("playing");
                icon.textContent = "⏸";

            } else {

                item.audio.pause();

                item.button.classList.remove("playing");
                icon.textContent = "▶";

            }

        });

        // Reset after finish
        item.audio.addEventListener("ended", function () {

            item.button.classList.remove("playing");
            icon.textContent = "▶";

        });

    });

});

/* ===============================
   Always Start Page From Left
=============================== */

window.addEventListener("pageshow", () => {

    window.scrollTo({
        left: 0,
        top: 0,
        behavior: "instant"
    });

});

window.addEventListener("load", () => {

    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;

});