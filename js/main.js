/* ==========================================================================
   Ahmad Ali Portfolio V2 - Main JS Interactivity
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Custom Cursor Glow Tracker ---
    const cursorGlow = document.getElementById('cursor-glow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursorGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        
        if (cursorGlow) {
            cursorGlow.style.left = `${glowX}px`;
            cursorGlow.style.top = `${glowY}px`;
        }
        requestAnimationFrame(animateCursorGlow);
    }
    animateCursorGlow();


    // --- 2. Header Scroll transitions ---
    const header = document.querySelector('.header');
    const scrollTopBtn = document.getElementById('scroll-top-btn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.pointerEvents = 'auto';
            scrollTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.pointerEvents = 'none';
            scrollTopBtn.style.transform = 'translateY(15px)';
        }
    });


    // --- 3. Mobile Navigation Menu Toggle ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
                mobileToggle.classList.remove('open');
                navMenu.classList.remove('open');
            }
        });
    }


    // --- 4. Interactive Card Border Glow System ---
    const glowCards = document.querySelectorAll('.skill-card, .project-card, .profile-card');

    glowCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);

            const customGlowColor = card.getAttribute('data-glow-color');
            if (customGlowColor) {
                card.style.setProperty('--glow-color', customGlowColor);
            }
        });
    });


    // --- 5. Intersection Observer: Enhanced Scroll Animations ---
    // Targets all elements with the .scroll-reveal class
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve to run animation only once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    // --- 6. Active Nav Link Scroll Spy ---
    const sections = document.querySelectorAll('section[id]');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.35,
        rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => {
        navObserver.observe(section);
    });


    // --- 7. Contact Form Handling ---
    const contactForm = document.getElementById('contact-form');
    const formSubmitBtn = document.getElementById('form-submit-btn');
    const formStatusBanner = document.getElementById('form-status-banner');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitText = formSubmitBtn.querySelector('.submit-text');
            const submitIcon = formSubmitBtn.querySelector('.submit-icon');
            const originalText = submitText.textContent;
            
            submitText.textContent = 'Sending Message...';
            submitIcon.className = 'fa-solid fa-spinner fa-spin submit-icon';
            formSubmitBtn.disabled = true;

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            setTimeout(() => {
                // Success banner display (uses success theme color #00E676)
                formStatusBanner.className = 'form-status-banner success';
                formStatusBanner.innerHTML = `
                    <strong>Message Sent Successfully!</strong> Thank you, ${formData.name}. I'll get back to you shortly.
                    <br><span style="font-size: 11px; opacity: 0.9;">Laravel route config is ready. Post parameters to dynamic controllers.</span>
                `;

                // Reset button
                submitText.textContent = originalText;
                submitIcon.className = 'fa-solid fa-paper-plane submit-icon';
                formSubmitBtn.disabled = false;
                
                contactForm.reset();

                setTimeout(() => {
                    formStatusBanner.style.display = 'none';
                }, 8000);

            }, 1200);
        });
    }
});
