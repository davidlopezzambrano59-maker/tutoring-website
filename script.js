// ===== ELITE PHYSICS TUTORING - MAIN JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initParticleAnimation();
    initServiceCards();
    initTestimonialSlider();
    initLazyLoading();
    initSmoothScrolling();
    initFormValidation();
});

// ===== NAVIGATION =====
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }

    // Navbar scroll effect
    if (navbar) {
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.backdropFilter = 'blur(20px)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
                navbar.style.boxShadow = 'none';
            }

            // Hide/show navbar on scroll
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            lastScrollTop = scrollTop;
        });
    }

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSection = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(currentSection)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger animations for grid items
                if (entry.target.classList.contains('grid-animate')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('fade-in-up');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.service-card, .feature-card, .testimonial-card, .material-card, ' +
        '.practice-card, .assessment-card, .story-card, .booking-card, ' +
        '.faq-item, .contact-card, .term-card, .option-card'
    );

    const gridContainers = document.querySelectorAll(
        '.services-grid, .features-grid, .testimonials-grid, .materials-grid, ' +
        '.practice-grid, .assessment-grid, .booking-grid, .faq-grid, ' +
        '.contact-grid, .terms-grid, .options-grid'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    gridContainers.forEach(grid => {
        grid.classList.add('grid-animate');
        observer.observe(grid);
    });

    // Counter animation
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = element.textContent;
    const isPercentage = target.includes('%');
    const numericTarget = parseInt(target.replace(/[^\d]/g, ''));
    let current = 0;
    const increment = numericTarget / 60; // 60 frames for 1 second at 60fps
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= numericTarget) {
            current = numericTarget;
            clearInterval(timer);
        }
        
        if (isPercentage) {
            element.textContent = Math.floor(current) + '%';
        } else if (target.includes('+')) {
            element.textContent = Math.floor(current) + '+';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16); // ~60fps
}

// ===== PARTICLE ANIMATION =====
function initParticleAnimation() {
    const heroParticles = document.querySelector('.hero-particles');
    if (!heroParticles) return;

    // Create floating particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 3 + 3}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        heroParticles.appendChild(particle);
    }
}

// ===== SERVICE CARDS INTERACTION =====
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card, .booking-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = this.classList.contains('premium') ? 'scale(1.05)' : 'translateY(0) scale(1)';
        });
    });

    // Service selection for booking page
    const selectServiceButtons = document.querySelectorAll('.select-service');
    const serviceTypeSelect = document.getElementById('serviceType');
    
    selectServiceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceType = this.dataset.service;
            const card = this.closest('.booking-card');
            
            // Remove selected state from all cards
            document.querySelectorAll('.booking-card').forEach(c => {
                c.classList.remove('selected');
            });
            
            // Add selected state to clicked card
            card.classList.add('selected');
            
            // Update form select if exists
            if (serviceTypeSelect) {
                const optionValue = serviceType === 'one-to-one' ? 'one-to-one' :
                                 serviceType === 'small-group' ? 'small-group' : 'academy';
                serviceTypeSelect.value = optionValue;
            }
            
            // Scroll to form
            const formSection = document.getElementById('booking-form');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== TESTIMONIAL SLIDER =====
function initTestimonialSlider() {
    const testimonialGrid = document.querySelector('.testimonials-grid');
    if (!testimonialGrid) return;

    const testimonials = testimonialGrid.querySelectorAll('.testimonial-card');
    let currentIndex = 0;

    // Auto-rotate testimonials on mobile
    if (window.innerWidth <= 768 && testimonials.length > 1) {
        setInterval(() => {
            testimonials[currentIndex].style.opacity = '0.7';
            currentIndex = (currentIndex + 1) % testimonials.length;
            testimonials[currentIndex].style.opacity = '1';
        }, 5000);
    }
}

// ===== LAZY LOADING =====
function initLazyLoading() {
    const lazyElements = document.querySelectorAll('[data-src]');
    
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.src = element.dataset.src;
                element.removeAttribute('data-src');
                lazyObserver.unobserve(element);
            }
        });
    });

    lazyElements.forEach(element => {
        lazyObserver.observe(element);
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
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

// ===== FORM VALIDATION =====
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
        
        form.addEventListener('submit', handleFormSubmit);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Remove existing error styling
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    // Name validation
    if ((fieldName === 'firstName' || fieldName === 'lastName') && value) {
        if (value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters long';
        }
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    `;
    
    field.parentNode.appendChild(errorElement);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const inputs = form.querySelectorAll('input, select, textarea');
    let isFormValid = true;

    // Validate all fields
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        // Scroll to first error
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitButton.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        if (form.id === 'contactForm') {
            handleContactFormSubmission(form, formData);
        } else {
            // Handle other forms
            console.log('Form submitted:', Object.fromEntries(formData));
            showSuccessMessage(form);
        }
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }, 2000);
}

function handleContactFormSubmission(form, formData) {
    // Convert form data to object
    const data = Object.fromEntries(formData);
    
    // Send email notification (this would typically be handled by a backend service)
    sendEmailNotification(data);
    
    // Show success message
    showSuccessMessage(form);
    
    // Log for demonstration
    console.log('Contact form submitted:', data);
}

function sendEmailNotification(data) {
    // This is a placeholder for email notification functionality
    // In a real implementation, you would send this data to your backend
    const emailData = {
        to: 'info@elitephysics.com', // Your email
        subject: `New Tutoring Application from ${data.firstName} ${data.lastName}`,
        html: generateEmailTemplate(data)
    };
    
    console.log('Email notification would be sent:', emailData);
    
    // You could use services like EmailJS, Formspree, or your own backend
    // Example with EmailJS:
    // emailjs.send('service_id', 'template_id', emailData);
}

function generateEmailTemplate(data) {
    return `
        <h2>New Tutoring Application</h2>
        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Year Group:</strong> ${data.yearGroup}</p>
        <p><strong>Current Grade:</strong> ${data.currentGrade || 'Not specified'}</p>
        <p><strong>Target Grade:</strong> ${data.targetGrade}</p>
        <p><strong>Service Type:</strong> ${data.serviceType}</p>
        <p><strong>Preferred Schedule:</strong> ${data.schedule || 'Not specified'}</p>
        <p><strong>Urgency:</strong> ${data.urgency || 'Not specified'}</p>
        
        ${data.specificTopics ? `<p><strong>Specific Topics:</strong> ${data.specificTopics}</p>` : ''}
        ${data.goals ? `<p><strong>Goals & Challenges:</strong> ${data.goals}</p>` : ''}
        
        <p><strong>Newsletter Subscription:</strong> ${data.newsletter ? 'Yes' : 'No'}</p>
        <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
    `;
}

function showSuccessMessage(form) {
    // Hide form
    form.style.display = 'none';
    
    // Show success message
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ===== UTILITY FUNCTIONS =====

// Format phone numbers as user types
function formatPhoneNumber(value) {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
        return !match[2] ? match[1] : `${match[1]} ${match[2]}${match[3] ? ` ${match[3]}` : ''}`;
    }
    return value;
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
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

// Live chat function (placeholder)
function startLiveChat() {
    alert('Live chat feature coming soon! Please use the contact form or call us directly.');
}

// Add error styling to CSS
const style = document.createElement('style');
style.textContent = `
    .error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .navbar {
        transition: all 0.3s ease;
    }
    
    .particle {
        pointer-events: none;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
    }
`;
document.head.appendChild(style);

// ===== KEYBOARD ACCESSIBILITY =====
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
});

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData.loadEventEnd - perfData.loadEventStart > 3000) {
                console.warn('Page load time is slow. Consider optimizing resources.');
            }
        }, 0);
    });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// ===== BROWSER SUPPORT CHECKS =====
function checkBrowserSupport() {
    const features = {
        intersectionObserver: 'IntersectionObserver' in window,
        css: window.CSS && CSS.supports('display', 'grid'),
        es6: typeof Symbol !== 'undefined'
    };
    
    if (!features.intersectionObserver) {
        console.warn('IntersectionObserver not supported. Animations may not work.');
    }
    
    return features;
}

// Initialize browser support checks
checkBrowserSupport();

