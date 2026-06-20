// ==========================================================================
// Jesús Capdevielle — QA Portfolio
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    /* ---------------------------------------------------------------- */
    /* Navbar: scrolled state + mobile burger                            */
    /* ---------------------------------------------------------------- */

    const navbar = document.querySelector('.navbar');
    const burger = document.querySelector('.nav-burger');
    const navLinks = document.querySelector('.nav-links');

    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
        backToTop.classList.toggle('visible', window.scrollY > 600);
    };

    if (burger) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });

    /* ---------------------------------------------------------------- */
    /* Scroll-spy: highlight active nav link based on visible section    */
    /* ---------------------------------------------------------------- */

    const sections = document.querySelectorAll('main section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(sec => spyObserver.observe(sec));

    /* ---------------------------------------------------------------- */
    /* Reveal on scroll                                                   */
    /* ---------------------------------------------------------------- */

    const revealEls = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    /* ---------------------------------------------------------------- */
    /* Back to top                                                       */
    /* ---------------------------------------------------------------- */

    const backToTop = document.querySelector('.back-to-top');
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------------------------------------------------------------- */
    /* Project filters                                                   */
    /* ---------------------------------------------------------------- */

    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            projectItems.forEach(item => {
                const cats = (item.dataset.category || '').split(' ');
                const show = filter === 'all' || cats.includes(filter);
                item.classList.toggle('hidden-filter', !show);
            });
        });
    });

    /* ---------------------------------------------------------------- */
    /* Glitch / cyberpunk atmosphere effects                             */
    /* ---------------------------------------------------------------- */

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduceMotion) {

        // Inject overlay layers
        const scanBar = document.createElement('div');
        scanBar.id = 'scan-bar';
        document.body.appendChild(scanBar);

        const crtFlicker = document.createElement('div');
        crtFlicker.id = 'crt-flicker';
        document.body.appendChild(crtFlicker);

        const glitchFlash = document.createElement('div');
        glitchFlash.id = 'glitch-flash';
        document.body.appendChild(glitchFlash);

        // Mark section titles as glitch targets
        document.querySelectorAll('.section-title').forEach(el => el.classList.add('glitch-target'));

        const glitchTargets = Array.from(document.querySelectorAll('.glitch-target'));

        function isInViewport(el) {
            const r = el.getBoundingClientRect();
            return r.top < window.innerHeight && r.bottom > 0;
        }

        function randomGlitchPulse() {
            const visible = glitchTargets.filter(isInViewport);
            if (visible.length) {
                const target = visible[Math.floor(Math.random() * visible.length)];
                target.classList.add('glitching');
                setTimeout(() => target.classList.remove('glitching'), 400);
            }
            scheduleNext();
        }

        function scheduleNext() {
            const delay = 1500 + Math.random() * 2200;
            setTimeout(randomGlitchPulse, delay);
        }

        scheduleNext();

        // Occasional full-screen glitch burst
        function screenBurst() {
            glitchFlash.classList.remove('burst');
            // restart animation
            void glitchFlash.offsetWidth;
            glitchFlash.classList.add('burst');
            setTimeout(() => glitchFlash.classList.remove('burst'), 400);
            setTimeout(screenBurst, 3800 + Math.random() * 5500);
        }

        setTimeout(screenBurst, 2200);
    }

});

// ==========================================================================
// Circuit-grid animated background (canvas)
// Subtle network of nodes + connecting lines, drifting slowly.
// ==========================================================================

(() => {
    const canvas = document.createElement('canvas');
    canvas.id = 'circuit-bg';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let w, h, nodes;
    const SPACING = 86;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Occasional signal-interference jolt: brief horizontal tear + RGB-split lines
    let joltUntil = 0;
    let joltOffset = 0;

    function scheduleJolt() {
        const delay = 2200 + Math.random() * 3500;
        setTimeout(() => {
            joltUntil = performance.now() + 220;
            joltOffset = (Math.random() < 0.5 ? -1 : 1) * (8 + Math.random() * 14);
            scheduleJolt();
        }, delay);
    }
    if (!reduceMotion) scheduleJolt();

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        buildNodes();
    }

    function buildNodes() {
        nodes = [];
        const cols = Math.ceil(w / SPACING) + 2;
        const rows = Math.ceil(h / SPACING) + 2;
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const baseX = i * SPACING;
                const baseY = j * SPACING;
                nodes.push({
                    baseX, baseY,
                    x: baseX, y: baseY,
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.0006 + Math.random() * 0.0006,
                    pulsePhase: Math.random() * Math.PI * 2,
                    active: Math.random() < 0.06
                });
            }
        }
    }

    function draw(t) {
        ctx.clearRect(0, 0, w, h);

        // dim grid dots + lines
        ctx.strokeStyle = 'rgba(56,189,248,0.05)';
        ctx.lineWidth = 1;

        for (const n of nodes) {
            if (!reduceMotion) {
                n.x = n.baseX + Math.sin(t * n.speed + n.phase) * 6;
                n.y = n.baseY + Math.cos(t * n.speed + n.phase) * 6;
            }
        }

        // horizontal + vertical faint connective lines
        const jolting = performance.now() < joltUntil;
        const jx = jolting ? joltOffset : 0;

        ctx.beginPath();
        for (const n of nodes) {
            ctx.moveTo(n.x - 14 + jx, n.y);
            ctx.lineTo(n.x + 14 + jx, n.y);
            ctx.moveTo(n.x, n.y - 14);
            ctx.lineTo(n.x, n.y + 14);
        }
        ctx.stroke();

        if (jolting) {
            // RGB-split echo of the horizontal lines for a glitch tear effect
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255,30,230,0.08)';
            for (const n of nodes) {
                ctx.moveTo(n.x - 14 - jx * 0.6, n.y);
                ctx.lineTo(n.x + 14 - jx * 0.6, n.y);
            }
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = 'rgba(34,232,255,0.08)';
            for (const n of nodes) {
                ctx.moveTo(n.x - 14 + jx * 1.4, n.y);
                ctx.lineTo(n.x + 14 + jx * 1.4, n.y);
            }
            ctx.stroke();
        }

        // nodes
        for (const n of nodes) {
            const pulse = reduceMotion ? 0.5 : (Math.sin(t * 0.0012 + n.pulsePhase) + 1) / 2;
            const alpha = n.active ? 0.18 + pulse * 0.35 : 0.10 + pulse * 0.08;
            const radius = n.active ? 2.1 : 1.3;
            ctx.beginPath();
            ctx.fillStyle = n.active
                ? `rgba(125,211,252,${alpha})`
                : `rgba(56,189,248,${alpha})`;
            ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
            ctx.fill();

            if (n.active && pulse > 0.7) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(125,211,252,${(pulse - 0.7) * 0.6})`;
                ctx.arc(n.x, n.y, radius + (pulse - 0.7) * 30, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        if (!reduceMotion) {
            requestAnimationFrame(draw);
        }
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();
    requestAnimationFrame(draw);
    if (reduceMotion) draw(0);
})();
