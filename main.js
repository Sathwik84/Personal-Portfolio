import './src/styles/global.css';

document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
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

    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // Reveal Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Custom Cursor
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with delay (using animate() for smoothness)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effect for links and buttons
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(0)';
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Resume Request Modal Logic
    const requestResumeBtn = document.getElementById('request-resume-btn');
    const resumeModal = document.getElementById('resume-modal');
    const closeResumeModal = document.getElementById('close-resume-modal');
    const resumeRequestForm = document.getElementById('resume-request-form');
    const modalSuccess = document.getElementById('modal-success');
    const successEmail = document.getElementById('success-email');

    if (requestResumeBtn && resumeModal) {
        requestResumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resumeModal.classList.add('active');
            
            // Reset modal state
            if (resumeRequestForm) resumeRequestForm.style.display = 'flex';
            if (modalSuccess) modalSuccess.style.display = 'none';
        });
    }

    if (closeResumeModal && resumeModal) {
        closeResumeModal.addEventListener('click', () => {
            resumeModal.classList.remove('active');
        });

        // Close on overlay click
        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) {
                resumeModal.classList.remove('active');
            }
        });
    }

    if (resumeRequestForm) {
        resumeRequestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('request-email');
            const email = emailInput ? emailInput.value : '';
            
            // Get selected document type (resume or cv)
            const docType = resumeRequestForm.querySelector('input[name="document-type"]:checked').value;
            
            const submitBtn = resumeRequestForm.querySelector('.modal-submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');
            
            // Show loading animation
            if (btnText) btnText.style.display = 'none';
            if (btnLoader) btnLoader.style.display = 'inline-block';
            if (submitBtn) submitBtn.disabled = true;
            
            // -------------------------------------------------------------
            // NOTE FOR DEPLOYMENT: Actual Auto-Send Email Automation
            // You can easily use a free frontend email service like EmailJS
            // or Web3Forms to send this email to your inbox automatically:
            // 
            // fetch('https://api.web3forms.com/submit', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         access_key: 'YOUR_FREE_ACCESS_KEY_HERE',
            //         subject: (docType === 'cv' ? 'CV' : 'Resume') + ' Request from ' + email,
            //         message: 'Hi, please send your ' + docType + ' to ' + email,
            //         email: email
            //     })
            // });
            // -------------------------------------------------------------

            // Simulate server request delay
            setTimeout(() => {
                // Restore submit button state
                if (btnText) btnText.style.display = 'inline-block';
                if (btnLoader) btnLoader.style.display = 'none';
                if (submitBtn) submitBtn.disabled = false;
                
                // Switch to success state
                resumeRequestForm.style.display = 'none';
                if (modalSuccess) modalSuccess.style.display = 'flex';
                if (successEmail) successEmail.textContent = email;
                
                const successDocType = document.getElementById('success-doc-type');
                if (successDocType) {
                    successDocType.textContent = docType === 'cv' ? 'Curriculum Vitae (CV)' : 'Resume';
                }
                
                // Trigger INSTANT browser download of the correct file
                const downloadLink = document.createElement('a');
                if (docType === 'cv') {
                    downloadLink.href = '/cv.pdf';
                    downloadLink.download = 'Kaparthy_Sathwik_CV.pdf';
                } else {
                    downloadLink.href = '/resume.pdf';
                    downloadLink.download = 'Kaparthy_Sathwik_Resume.pdf';
                }
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                
            }, 1500); // 1.5 second premium loader delay
        });
    }
});
