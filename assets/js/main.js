// Main JavaScript for Help Personal House website

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initSmoothScroll();
    initActiveNavigation();
    initAnimations();
    initLoadingStates();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (!mobileToggle || !navMenu) return;
    
    mobileToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Toggle hamburger animation
        mobileToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on links
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Smooth Scrolling for anchor links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Active Navigation Highlighting
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length === 0) return;
    
    function updateActiveNav() {
        let current = '';
        const scrollY = window.pageYOffset;
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 50;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Update on scroll
    window.addEventListener('scroll', throttle(updateActiveNav, 100));
    
    // Initial update
    updateActiveNav();
}

// Intersection Observer for animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll([
        '.service-card',
        '.feature-item',
        '.testimonial-card',
        '.section-header'
    ].join(','));
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Loading states for images and content
function initLoadingStates() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (!img.complete) {
            img.closest('.service-card, .testimonial-card, .hero-image')?.classList.add('loading');
            
            img.addEventListener('load', function() {
                this.closest('.service-card, .testimonial-card, .hero-image')?.classList.remove('loading');
            });
            
            img.addEventListener('error', function() {
                this.closest('.service-card, .testimonial-card, .hero-image')?.classList.remove('loading');
            });
        }
    });
}

// Navbar scroll effect
window.addEventListener('scroll', throttle(function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = 'var(--background-color)';
        navbar.style.backdropFilter = 'none';
    }
}, 100));

// Form handling (for future contact forms)
function initFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"], input[type="submit"]');
            
            if (submitButton) {
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Enviando...';
                submitButton.disabled = true;
                
                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    submitButton.textContent = 'Enviado!';
                    setTimeout(() => {
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                        this.reset();
                    }, 2000);
                }, 1000);
            }
        });
    });
}

// Utility Functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Handle window resize
window.addEventListener('resize', debounce(function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const navMenu = document.getElementById('nav-menu');
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}, 250));

// Preload critical images
function preloadImages() {
    const criticalImages = [
        // Add paths to critical images here
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Call preload function
preloadImages();

// Service Worker Registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Analytics tracking (placeholder for Google Analytics or similar)
function trackEvent(category, action, label) {
    // Placeholder for analytics tracking
    console.log('Track Event:', { category, action, label });
    
    // Example for Google Analytics
    // gtag('event', action, {
    //     event_category: category,
    //     event_label: label
    // });
}

// Track button clicks for analytics
document.addEventListener('click', function(e) {
    const button = e.target.closest('.btn, .service-link, .nav-link');
    if (button) {
        const text = button.textContent.trim();
        const href = button.getAttribute('href');
        
        trackEvent('Button', 'Click', text);
        
        // Track external links
        if (href && (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel'))) {
            trackEvent('External Link', 'Click', href);
        }
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    // You could send this to an error tracking service
});
