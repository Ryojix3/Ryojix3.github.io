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
        ctx.beginPath();
        for (const n of nodes) {
            ctx.moveTo(n.x - 14, n.y);
            ctx.lineTo(n.x + 14, n.y);
            ctx.moveTo(n.x, n.y - 14);
            ctx.lineTo(n.x, n.y + 14);
        }
        ctx.stroke();

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
