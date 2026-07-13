// ===== KSO — Shared Script =====

document.addEventListener('DOMContentLoaded', () => {
    // --- Header scroll effect ---
    const header = document.querySelector('header');
    if (header) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    header.classList.toggle('scrolled', window.scrollY > 50);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // --- Sticky RDV bar (scroll-triggered) ---
    const stickyBar = document.getElementById('stickyRdvBar');
    const stickyClose = document.getElementById('stickyRdvClose');
    if (stickyBar) {
        let barDismissed = sessionStorage.getItem('rdvBarClosed') === '1';
        let barVisible = false;
        const TRIGGER_PX = 300;

        const updateBar = () => {
            if (barDismissed) return;
            const shouldShow = window.scrollY > TRIGGER_PX;
            if (shouldShow !== barVisible) {
                barVisible = shouldShow;
                stickyBar.classList.toggle('visible', shouldShow);
            }
        };

        window.addEventListener('scroll', updateBar, { passive: true });

        if (stickyClose) {
            stickyClose.addEventListener('click', () => {
                barDismissed = true;
                barVisible = false;
                stickyBar.classList.remove('visible');
                sessionStorage.setItem('rdvBarClosed', '1');
            });
        }
    }

    // --- Mobile menu ---
    const menuToggle = document.getElementById('menuToggle');
    const navContent = document.getElementById('navContent');
    if (menuToggle && navContent) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navContent.classList.toggle('open');
        });
        navContent.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navContent.classList.remove('open');
            });
        });
    }

    // --- Mobile CTA central (reachability) ---
    const mobileCta = document.querySelector('.mobile-cta-reach');
    if (mobileCta) {
        const TRIGGER_PX = 180;
        let shown = false;
        const isMobile = () => window.matchMedia('(max-width: 600px)').matches;

        const update = () => {
            // Ne jamais afficher sur desktop
            if (!isMobile()) {
                shown = false;
                mobileCta.classList.remove('visible');
                return;
            }

            const shouldShow = window.scrollY > TRIGGER_PX;
            if (shouldShow && !shown) {
                shown = true;
                mobileCta.classList.add('visible');
            } else if (!shouldShow && shown) {
                shown = false;
                mobileCta.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        update();
    }




    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // --- Reveal on scroll (IntersectionObserver) ---
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length > 0) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target); // stop observing once revealed
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        reveals.forEach(el => revealObserver.observe(el));
    }
});

