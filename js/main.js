// Main JavaScript for Ben Lorenzo Magbanua Portfolio
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.getElementById('chat').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    // Header background on scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.background = 'linear-gradient(to bottom, rgba(10, 10, 10, 0.95), rgba(10, 10, 10, 0.8))';
            } else {
                header.style.background = 'linear-gradient(to bottom, rgba(10, 10, 10, 0.9), transparent)';
            }
        });
    }
    
    // Typing effect for hero greeting
    const heroGreeting = document.querySelector('.hero-greeting');
    if (heroGreeting) {
        const text = heroGreeting.textContent;
        heroGreeting.textContent = '';
        heroGreeting.style.minHeight = '2rem';
        let index = 0;
        
        function typeGreeting() {
            if (index < text.length) {
                heroGreeting.textContent += text.charAt(index);
                index++;
                setTimeout(typeGreeting, 100);
            }
        }
        
        setTimeout(typeGreeting, 500);
    }
    
    // Animate hero elements on load
    const heroElements = [
        '.hero-photo-wrapper',
        '.hero-name',
        '.hero-title',
        '.hero-description',
        '.hero-social'
    ];
    
    heroElements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            setTimeout(() => {
                element.style.transition = 'all 0.8s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 200 * (index + 1));
        }
    });
    
    // Parallax effect for hero photo
    const heroPhoto = document.querySelector('.hero-photo-wrapper');
    if (heroPhoto) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX - window.innerWidth / 2) / 100;
            const y = (e.clientY - window.innerHeight / 2) / 100;
            
            heroPhoto.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        // Reset on mouse leave
        document.addEventListener('mouseleave', () => {
            heroPhoto.style.transform = 'translate(0, 0)';
        });
    }
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe chat widget
    const chatWidget = document.querySelector('.chat-widget');
    if (chatWidget) {
        chatWidget.style.opacity = '0';
        chatWidget.style.transform = 'translateY(50px)';
        chatWidget.style.transition = 'all 1s ease';
        observer.observe(chatWidget);
    }
    
    // Observe contact section
    const contactContent = document.querySelector('.contact-content');
    if (contactContent) {
        contactContent.style.opacity = '0';
        contactContent.style.transform = 'translateY(50px)';
        contactContent.style.transition = 'all 1s ease';
        observer.observe(contactContent);
    }
    
    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .hero-photo-wrapper {
            transition: transform 0.1s ease;
        }
        
        @media (prefers-reduced-motion: reduce) {
            * {
                animation: none !important;
                transition: none !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Floating CTA visibility
    const floatingCTA = document.querySelector('.floating-cta');
    const contactSection = document.getElementById('contact');
    
    if (floatingCTA && contactSection) {
        const observerCTA = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    floatingCTA.style.opacity = '0';
                    floatingCTA.style.pointerEvents = 'none';
                } else {
                    floatingCTA.style.opacity = '1';
                    floatingCTA.style.pointerEvents = 'auto';
                }
            });
        });
        
        observerCTA.observe(contactSection);
    }
    
    // Console greeting
    console.log('%c Kumusta! Welcome to my portfolio! 🇵🇭', 
        'color: #10b981; font-size: 20px; font-weight: bold;');
    console.log('%c Looking for an automation architect? Let\'s build something amazing together!', 
        'color: #9333ea; font-size: 14px;');
    console.log('%c Email: ben@benlorenzo.dev | TambayanPH: https://tambayanph.com', 
        'color: #3b82f6; font-size: 12px;');
    console.log('%c Fun fact: Try the Konami code on the site! ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA', 
        'color: #ec4899; font-size: 12px;');
    
    // Page performance
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`%c Page loaded in ${loadTime}ms ⚡`, 'color: #10b981; font-size: 12px;');
    });
});