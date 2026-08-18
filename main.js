/* ═══════════════════════════════════════════════════════════════
   HRITISH.SPACE — ISSUE 01
   Interactions: reveal-on-scroll, portrait parallax, ASCII scramble
   All motion respects prefers-reduced-motion.
   ═══════════════════════════════════════════════════════════════ */

(() => {
    "use strict";

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ── 1. Reveal projects on scroll ────────────────────────────── */
    const projects = document.querySelectorAll(".project");

    if ("IntersectionObserver" in window && !prefersReducedMotion) {
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        io.unobserve(entry.target);
                    }
                }
            },
            { threshold: 0.18 }
        );
        projects.forEach((p) => io.observe(p));
    } else {
        projects.forEach((p) => p.classList.add("in-view"));
    }

    /* ── 2. Hero portrait parallax on mouse ──────────────────────── */
    const portrait = document.getElementById("heroPortrait");

    if (portrait && !prefersReducedMotion && matchMedia("(pointer: fine)").matches) {
        const img = portrait.querySelector(".hero-portrait-img");
        const texture = portrait.querySelector(".hero-portrait-texture");
        const word = portrait.querySelector(".hero-portrait-word");

        let rafId = null;
        let targetX = 0, targetY = 0;
        let curX = 0, curY = 0;

        const lerp = (a, b, t) => a + (b - a) * t;

        const tick = () => {
            curX = lerp(curX, targetX, 0.08);
            curY = lerp(curY, targetY, 0.08);

            img.style.transform = `translate(${curX * -8}px, ${curY * -6}px)`;
            texture.style.transform = `rotate(0.6deg) translate(${curX * 14}px, ${curY * 10}px)`;
            word.style.transform = `rotate(-2deg) translate(${curX * 18}px, ${curY * 14}px)`;

            if (Math.abs(curX - targetX) > 0.001 || Math.abs(curY - targetY) > 0.001) {
                rafId = requestAnimationFrame(tick);
            } else {
                rafId = null;
            }
        };

        portrait.addEventListener("mousemove", (e) => {
            const rect = portrait.getBoundingClientRect();
            targetX = (e.clientX - rect.left) / rect.width - 0.5;
            targetY = (e.clientY - rect.top) / rect.height - 0.5;
            if (!rafId) rafId = requestAnimationFrame(tick);
        });

        portrait.addEventListener("mouseleave", () => {
            targetX = 0;
            targetY = 0;
            if (!rafId) rafId = requestAnimationFrame(tick);
        });
    }

    /* ── 3. ASCII scramble on project titles ───────────────────────
       On hover, headline letters briefly cycle through ASCII glyphs
       before settling back — a printed page glitching into terminal. */
    const GLYPHS = "█▓▒░╬╠╣╔╗╚╝#%&@$0101/\\|<>*+=~";

    const scramble = (el) => {
        if (prefersReducedMotion) return;
        const original = el.dataset.original;
        if (!original || el.dataset.scrambling === "1") return;
        el.dataset.scrambling = "1";

        const chars = [...original];
        let frame = 0;
        const total = 14;

        const step = () => {
            const settled = Math.floor((frame / total) * chars.length);
            let out = "";
            for (let i = 0; i < chars.length; i++) {
                const c = chars[i];
                if (c === "\n") { out += "<br>"; continue; }
                if (/\s/.test(c)) { out += c; continue; }
                out += i < settled ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
            }
            el.innerHTML = out;
            frame++;
            if (frame <= total) {
                setTimeout(step, 34);
            } else {
                el.innerHTML = original.replace(/\n/g, "<br>");
                el.dataset.scrambling = "0";
            }
        };
        step();
    };

    document.querySelectorAll(".project-title a").forEach((link) => {
        // store plain-text original with \n for <br>
        link.dataset.original = link.innerHTML.replace(/<br\s*\/?>/gi, "\n");
        link.closest(".project").addEventListener("mouseenter", () => scramble(link));
    });

    /* ── 4. Scramble project titles on phone scroll ────────────────
       Touch devices have no cursor hover, so trigger the same effect
       once when a project title enters the viewport. Desktop/mouse
       devices remain hover-only. */
    const isTouchDevice = matchMedia("(pointer: coarse)").matches && !matchMedia("(hover: hover)").matches;

    if (isTouchDevice && "IntersectionObserver" in window && !prefersReducedMotion) {
        const mobileTitleObserver = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    const title = entry.target.querySelector(".project-title a");
                    if (title && title.dataset.mobileScrambled !== "1") {
                        title.dataset.mobileScrambled = "1";
                        // Small delay lets the heading settle after the scroll.
                        setTimeout(() => scramble(title), 100);
                    }
                    mobileTitleObserver.unobserve(entry.target);
                }
            },
            { threshold: 0.5 }
        );
        document.querySelectorAll(".project").forEach((project) => mobileTitleObserver.observe(project));
    }

    /* ── 5. Date-aware issue label + footer year ────────────────────
       Evaluated on every page load using the visitor's local date. */
    const now = new Date();
    const currentYear = now.getFullYear();
    const isNewYear = now.getMonth() === 0 && now.getDate() === 1;
    const isBirthday = now.getMonth() === 8 && now.getDate() === 16;
    const volumeLabel = document.getElementById("volumeLabel");

    if (volumeLabel) {
        if (isBirthday) {
            volumeLabel.textContent = "It's my birthday !";
        } else if (isNewYear) {
            volumeLabel.textContent = "It's a new year, IDK what should come here loll";
        } else {
            volumeLabel.textContent = `VOL. ${currentYear}`;
        }
    }

    const yearEl = document.querySelector(".footer-year");
    if (yearEl) {
        yearEl.textContent = `© ${currentYear} — ISSUE 01`;
    }

    /* ── 6. Scale ASCII diagrams to fit their containers ───────────
       On every resize, measure each .project-ascii and .contact-ascii.
       If the <pre> content is wider than the container, apply a CSS
       transform: scale() to shrink it down. This keeps the ASCII art
       readable on mobile while staying full-size on desktop. */
    const scaleAsciiDiagrams = () => {
        // Scale project and contact ASCII diagrams
        document.querySelectorAll(".project-ascii, .contact-ascii").forEach((container) => {
            const pre = container.querySelector("pre");
            if (!pre) return;

            // Reset scale to measure natural width
            pre.style.transform = "";
            pre.style.transformOrigin = "top left";
            container.classList.add("js-scaled");

            const containerWidth = container.clientWidth;
            const preWidth = pre.scrollWidth;

            if (preWidth > containerWidth) {
                const scale = containerWidth / preWidth;
                pre.style.transform = `scale(${scale})`;
                // Adjust container height to match scaled content
                container.style.height = `${pre.scrollHeight * scale}px`;
            } else {
                container.style.height = "";
            }
        });

        // Scale hero ASCII background to cover the viewport
        const heroAscii = document.querySelector(".hero-ascii-bg");
        if (heroAscii) {
            const viewportWidth = window.innerWidth;
            // The pre is absolutely positioned, so we check if the text
            // content extends beyond the viewport
            heroAscii.style.transform = "";
            heroAscii.style.transformOrigin = "top left";
            
            if (heroAscii.scrollWidth > viewportWidth) {
                const scale = viewportWidth / heroAscii.scrollWidth;
                heroAscii.style.transform = `scale(${scale})`;
                heroAscii.style.height = `${heroAscii.scrollHeight * scale}px`;
            } else {
                heroAscii.style.height = "";
            }
        }
    };

    // Run on load and resize
    scaleAsciiDiagrams();
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(scaleAsciiDiagrams, 150);
    });

    // Also re-scale when projects become visible (lazy content)
    if ("IntersectionObserver" in window) {
        const asciiObserver = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        scaleAsciiDiagrams();
                        asciiObserver.unobserve(entry.target);
                    }
                }
            },
            { threshold: 0.05 }
        );
        document.querySelectorAll(".project-ascii, .contact-ascii").forEach((el) => asciiObserver.observe(el));
    }
})();
