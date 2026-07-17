// ===========================
// Navigation — mobile menu, smooth scroll, navbar effect,
// keyboard navigation, mobile bottom-nav scroll-spy, back-to-top.
// ===========================

// Shared helper exposed for the terminal (Task 10) and nav links.
export function scrollToSection(id) {
    const target = globalThis.document.getElementById(id);
    if (target) {
        // scrollIntoView may be absent in some environments (e.g. jsdom); fall
        // back to a no-op so navigation never throws.
        if (typeof target.scrollIntoView === 'function') {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

export function initNavigation() {
    // Mobile Menu Toggle
    const hamburger = globalThis.document.getElementById('hamburger');
    const navMenu = globalThis.document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        });

        // Close menu when clicking on a link
        globalThis.document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', 'Open navigation menu');
            });
        });
    }

    // Smooth Scrolling
    globalThis.document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = globalThis.document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const navbar = globalThis.document.querySelector('.navbar');
        if (!navbar) return;
        const currentTheme = globalThis.document.documentElement.getAttribute('data-theme') || 'dark';

        if (window.scrollY > 100) {
            if (currentTheme === 'light') {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(10, 14, 26, 0.98)';
                navbar.style.boxShadow = '0 4px 16px rgba(0, 217, 255, 0.1)';
            }
        } else {
            if (currentTheme === 'light') {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            } else {
                navbar.style.background = 'rgba(10, 14, 26, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
    });

    // Keyboard Navigation
    globalThis.document.addEventListener('keydown', (e) => {
        const sections = ['home', 'about', 'skills', 'projects', 'experience', 'architecture', 'certifications', 'contact'];
        const currentSection = sections.findIndex(section => {
            const element = globalThis.document.getElementById(section);
            if (!element) return false;
            const rect = element.getBoundingClientRect();
            return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
        });

        if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
            const nextSection = globalThis.document.getElementById(sections[currentSection + 1]);
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (e.key === 'ArrowUp' && currentSection > 0) {
            const prevSection = globalThis.document.getElementById(sections[currentSection - 1]);
            if (prevSection) {
                prevSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // Back to Top Button
    createBackToTopButton();

    // Mobile Bottom Navigation Active State
    const mobileNavItems = globalThis.document.querySelectorAll('.mobile-bottom-nav .nav-item');
    const sections = globalThis.document.querySelectorAll('.section');

    function updateMobileNav() {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;

            if (window.pageYOffset >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });

        mobileNavItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    }

    if (window.innerWidth <= 768) {
        window.addEventListener('scroll', updateMobileNav);
    }
}

function createBackToTopButton() {
    const button = globalThis.document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'back-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 16px rgba(0, 217, 255, 0.3);
    `;

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    globalThis.document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });

    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-5px) scale(1.1)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0) scale(1)';
    });
}

export default initNavigation;
