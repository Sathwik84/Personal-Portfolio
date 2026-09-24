import './src/styles/global.css';

document.addEventListener('DOMContentLoaded', () => {
    // 1. PRELOADER LOGIC (Fade out under 1 second)
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 700);
    }

    // 2. SCROLL PROGRESS INDICATOR BAR & HEADER STICKY SCROLLED STATE
    const scrollProgress = document.getElementById('scroll-progress');
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0 && scrollProgress) {
            const progress = (window.scrollY / totalHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }

        if (header) {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // 3. THEME TOGGLE (Default to Dark Mode)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';

    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            if (isLight) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // 4. MOBILE MENU TOGGLE
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 5. SMOOTH SCROLLING & ACTIVE SECTION HIGHLIGHTING
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');

    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href.startsWith('#')) return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-desktop a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // 6. SCROLL REVEAL ANIMATIONS (Triggered on Scroll Into View)
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 7. PROJECT FILTERING TABS (All, AI/ML, Web Dev, Java, Computer Vision)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category') || '';
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.classList.remove('filtered-out');
                } else {
                    card.classList.add('filtered-out');
                }
            });
        });
    });

    // 8. CUSTOM CURSOR WITH MAGNETIC HOVER EFFECT
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    if (cursorDot && cursorOutline && window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 400, fill: "forwards" });
        });

        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card, .service-card, .focus-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering');
            });
        });
    }

    // 9. RESUME / CV REQUEST MODAL LOGIC
    const heroResumeBtn = document.getElementById('hero-request-resume-btn');
    const navResumeBtn = document.getElementById('nav-request-resume-btn');
    const resumeModal = document.getElementById('resume-modal');
    const closeResumeModal = document.getElementById('close-resume-modal');
    const resumeRequestForm = document.getElementById('resume-request-form');
    const modalSuccess = document.getElementById('modal-success');
    const successDocType = document.getElementById('success-doc-type');
    const successEmail = document.getElementById('success-email');

    const openModal = (e) => {
        if (e) e.preventDefault();
        if (resumeModal) {
            resumeModal.classList.add('active');
            if (resumeRequestForm) resumeRequestForm.style.display = 'flex';
            if (modalSuccess) modalSuccess.style.display = 'none';
        }
    };

    const closeModal = () => {
        if (resumeModal) resumeModal.classList.remove('active');
    };

    if (heroResumeBtn) heroResumeBtn.addEventListener('click', openModal);
    if (navResumeBtn) navResumeBtn.addEventListener('click', openModal);
    if (closeResumeModal) closeResumeModal.addEventListener('click', closeModal);

    if (resumeModal) {
        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) closeModal();
        });
    }

    if (resumeRequestForm) {
        resumeRequestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = resumeRequestForm.querySelector('button[type="submit"]');
            const emailInput = document.getElementById('request-email');
            const selectedDoc = document.querySelector('input[name="document-type"]:checked')?.value || 'resume';

            const userEmail = emailInput ? emailInput.value : '';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending...';
            }

            // Simulate server request & trigger direct browser file download
            setTimeout(() => {
                if (resumeRequestForm) resumeRequestForm.style.display = 'none';
                if (modalSuccess) {
                    if (successDocType) successDocType.textContent = selectedDoc === 'cv' ? 'Curriculum Vitae (CV)' : 'Resume';
                    if (successEmail) successEmail.textContent = userEmail;
                    modalSuccess.style.display = 'flex';
                }

                // Trigger direct file download
                const downloadLink = document.createElement('a');
                downloadLink.href = selectedDoc === 'cv' ? '/cv.pdf' : '/resume.pdf';
                downloadLink.download = selectedDoc === 'cv' ? 'Sathwik_Kaparthy_CV.pdf' : 'Sathwik_Kaparthy_Resume.pdf';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span class="btn-text">Send Document</span>';
                }
            }, 800);
        });
    }
});
