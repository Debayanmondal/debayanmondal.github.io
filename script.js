document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Theme Management (Light / Dark Mode)
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        htmlElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Show theme change toast
        showToast(`Switched to ${newTheme} mode!`, 'info');
    });

    // 2. Mobile Nav Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navLinkItems = document.querySelectorAll('.nav-links a');
    
    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('open');
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', !isOpen);
    });
    
    // Close nav on clicking links (mobile behavior)
    navLinkItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // 3. Scroll Reveal & Scroll Spy Active Navigation Link
    const sections = document.querySelectorAll('section');
    const navLinksList = document.querySelectorAll('.nav-links a');
    const reveals = document.querySelectorAll('.reveal');
    
    const scrollObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Scroll Reveal animation trigger
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's the skills section, animate the progress bars
                if (entry.target.id === 'skills') {
                    animateSkills();
                }
            }
            
            // Scroll Spy active state logic
            if (entry.isIntersecting && entry.target.id) {
                const id = entry.target.id;
                navLinksList.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, scrollObserverOptions);
    
    sections.forEach(section => scrollObserver.observe(section));
    reveals.forEach(reveal => scrollObserver.observe(reveal));

    // 4. Skills Progress Animation
    function animateSkills() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        });
    }

    // 5. Timeline Details Toggle Expansion
    const toggleButtons = document.querySelectorAll('.timeline-toggle-btn');
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            const isCurrentlyOpen = targetEl.classList.contains('open');
            
            // Close all other expansions first for accordion effect
            document.querySelectorAll('.timeline-expanded-details').forEach(el => {
                el.classList.remove('open');
            });
            document.querySelectorAll('.timeline-toggle-btn').forEach(b => {
                b.innerHTML = `Show technical breakdown <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>`;
            });
            
            if (!isCurrentlyOpen) {
                targetEl.classList.add('open');
                btn.innerHTML = `Hide technical breakdown <svg style="width: 16px; height: 16px; transform: rotate(180deg);" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>`;
            }
        });
    });

    // 6. Project Card Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all filters and add to clicked
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Add fade-out transition
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue || (filterValue === 'cloud' && category === 'cloud')) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 250);
            });
        });
    });

    // 7. Interactive Background Mouse Tracking
    const ambient1 = document.querySelector('.ambient-1');
    const ambient2 = document.querySelector('.ambient-2');
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        if (ambient1) {
            ambient1.style.transform = `translate(${mouseX * 50}px, ${mouseY * 50}px)`;
        }
        if (ambient2) {
            ambient2.style.transform = `translate(${mouseX * -50}px, ${mouseY * -50}px)`;
        }
    });

    // 8. Contact Form Handling & Toast Notifications
    const contactForm = document.getElementById('contact-form');
    const toastContainer = document.getElementById('toast-container');
    
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast show`;
        
        let color = '#06b6d4'; // Cyan for info
        if (type === 'success') color = '#10b981'; // Emerald
        if (type === 'error') color = '#ef4444'; // Red
        
        toast.style.borderColor = color;
        toast.style.borderLeftColor = color;
        
        const iconSvg = type === 'success' 
            ? `<svg style="width: 18px; height: 18px; fill: ${color};" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`
            : `<svg style="width: 18px; height: 18px; fill: ${color};" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`;
            
        toast.innerHTML = `
            ${iconSvg}
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Slide out and remove toast after 4s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 4000);
    }
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameVal = document.getElementById('name').value;
        const emailVal = document.getElementById('email').value;
        const msgVal = document.getElementById('message').value;
        
        if (!nameVal || !emailVal || !msgVal) {
            showToast('Please fill out all fields.', 'error');
            return;
        }
        
        // Mocking API call submission
        showToast(`Thank you, ${nameVal}! Your message has been sent successfully.`);
        contactForm.reset();
    });

});
