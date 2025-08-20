// ===== BOOKING PAGE SPECIFIC FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    initBookingForm();
    initCalendlyIntegration();
    initServiceSelection();
    initRealTimeValidation();
});

// ===== BOOKING FORM ENHANCEMENT =====
function initBookingForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Dynamic form field dependencies
    setupFormDependencies();
    
    // Auto-save form data
    setupAutoSave();
    
    // Form progress indicator
    setupProgressIndicator();
    
    // Enhanced validation
    setupEnhancedValidation();
}

function setupFormDependencies() {
    const yearGroup = document.getElementById('yearGroup');
    const currentGrade = document.getElementById('currentGrade');
    const serviceType = document.getElementById('serviceType');
    const urgency = document.getElementById('urgency');

    // Show/hide current grade based on year group
    if (yearGroup && currentGrade) {
        yearGroup.addEventListener('change', function() {
            if (this.value === 'not-started') {
                currentGrade.style.display = 'none';
                currentGrade.required = false;
            } else {
                currentGrade.style.display = 'block';
                currentGrade.required = true;
            }
        });
    }

    // Update pricing information based on service type
    if (serviceType) {
        serviceType.addEventListener('change', function() {
            updatePricingInfo(this.value);
        });
    }

    // Suggest scheduling based on urgency
    if (urgency) {
        urgency.addEventListener('change', function() {
            suggestScheduling(this.value);
        });
    }
}

function updatePricingInfo(serviceType) {
    const pricingInfo = {
        'one-to-one': {
            rate: '£80/hour',
            session: '60-90 minutes',
            description: 'Premium personalized tutoring with complete individual attention'
        },
        'small-group': {
            rate: '£45/hour',
            session: '90 minutes',
            description: 'Small group sessions (2-4 students) with collaborative learning'
        },
        'academy': {
            rate: '£30/hour',
            session: '2 hours',
            description: 'Comprehensive group sessions (5-8 students) with structured curriculum'
        },
        'complete-course': {
            rate: 'From £1,800',
            session: 'Full academic year',
            description: 'Complete A-Level Physics course with all materials included'
        },
        'materials-only': {
            rate: '£97 one-time',
            session: 'Instant access',
            description: 'Complete library of study materials and practice papers'
        }
    };

    const info = pricingInfo[serviceType];
    if (info) {
        showPricingTooltip(info);
    }
}

function showPricingTooltip(info) {
    // Remove existing tooltip
    const existingTooltip = document.querySelector('.pricing-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }

    // Create new tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'pricing-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-content">
            <h4>${info.rate}</h4>
            <p><strong>Session Length:</strong> ${info.session}</p>
            <p>${info.description}</p>
        </div>
    `;
    
    tooltip.style.cssText = `
        position: absolute;
        background: white;
        border: 2px solid #3b82f6;
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        max-width: 300px;
        animation: fadeInUp 0.3s ease;
    `;

    const serviceTypeField = document.getElementById('serviceType');
    serviceTypeField.parentNode.appendChild(tooltip);

    // Position tooltip
    const rect = serviceTypeField.getBoundingClientRect();
    tooltip.style.top = rect.bottom + 10 + 'px';
    tooltip.style.left = rect.left + 'px';

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.remove();
        }
    }, 5000);
}

function suggestScheduling(urgency) {
    const scheduleField = document.getElementById('schedule');
    const suggestions = {
        'immediately': ['weekday-evening', 'weekend-morning'],
        'next-week': ['weekday-afternoon', 'weekday-evening'],
        'within-month': ['flexible'],
        'next-term': ['weekday-morning', 'weekday-afternoon'],
        'flexible': ['flexible']
    };

    const suggested = suggestions[urgency];
    if (suggested && scheduleField) {
        // Highlight suggested options
        const options = scheduleField.querySelectorAll('option');
        options.forEach(option => {
            option.style.backgroundColor = '';
            option.style.fontWeight = '';
            if (suggested.includes(option.value)) {
                option.style.backgroundColor = '#f0f9ff';
                option.style.fontWeight = 'bold';
            }
        });
    }
}

function setupAutoSave() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea');
    const AUTO_SAVE_KEY = 'dlzTutors_bookingForm';

    // Load saved data
    const savedData = localStorage.getItem(AUTO_SAVE_KEY);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.entries(data).forEach(([name, value]) => {
                const field = form.querySelector(`[name="${name}"]`);
                if (field) {
                    if (field.type === 'checkbox') {
                        field.checked = value;
                    } else {
                        field.value = value;
                    }
                }
            });
        } catch (e) {
            console.warn('Failed to load saved form data');
        }
    }

    // Save data on change
    const saveFormData = debounce(() => {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(data));
    }, 1000);

    inputs.forEach(input => {
        input.addEventListener('input', saveFormData);
        input.addEventListener('change', saveFormData);
    });

    // Clear saved data on successful submission
    form.addEventListener('submit', () => {
        localStorage.removeItem(AUTO_SAVE_KEY);
    });
}

function setupProgressIndicator() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'form-progress';
    progressBar.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
        <div class="progress-text">
            <span class="current">0</span> of <span class="total">0</span> fields completed
        </div>
    `;
    
    progressBar.style.cssText = `
        margin-bottom: 2rem;
        padding: 1rem;
        background: #f9fafb;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
    `;

    const progressBarStyles = document.createElement('style');
    progressBarStyles.textContent = `
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 0.5rem;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            width: 0%;
            transition: width 0.3s ease;
        }
        .progress-text {
            font-size: 0.875rem;
            color: #6b7280;
            text-align: center;
        }
    `;
    document.head.appendChild(progressBarStyles);

    form.insertBefore(progressBar, form.firstChild);

    // Update progress
    const updateProgress = () => {
        const requiredFields = form.querySelectorAll('[required]');
        const filledFields = Array.from(requiredFields).filter(field => {
            if (field.type === 'checkbox') {
                return field.checked;
            }
            return field.value.trim() !== '';
        });

        const percentage = (filledFields.length / requiredFields.length) * 100;
        
        progressBar.querySelector('.progress-fill').style.width = percentage + '%';
        progressBar.querySelector('.current').textContent = filledFields.length;
        progressBar.querySelector('.total').textContent = requiredFields.length;
    };

    // Initial update
    updateProgress();

    // Update on input changes
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updateProgress);
        input.addEventListener('change', updateProgress);
    });
}

function setupEnhancedValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Real-time validation messages
    const validationMessages = {
        firstName: {
            required: 'First name is required',
            minLength: 'First name must be at least 2 characters'
        },
        lastName: {
            required: 'Last name is required',
            minLength: 'Last name must be at least 2 characters'
        },
        email: {
            required: 'Email address is required',
            invalid: 'Please enter a valid email address',
            duplicate: 'This email is already registered'
        },
        phone: {
            required: 'Phone number is required',
            invalid: 'Please enter a valid UK phone number'
        },
        yearGroup: {
            required: 'Please select your year group'
        },
        targetGrade: {
            required: 'Please select your target grade'
        },
        serviceType: {
            required: 'Please select a service type'
        },
        terms: {
            required: 'You must agree to the terms and conditions'
        }
    };

    // Enhanced field validation
    Object.entries(validationMessages).forEach(([fieldName, messages]) => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!field) return;

        field.addEventListener('blur', function() {
            validateFieldEnhanced(this, messages);
        });

        field.addEventListener('input', function() {
            clearFieldValidation(this);
        });
    });
}

function validateFieldEnhanced(field, messages) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    // Clear previous validation
    clearFieldValidation(field);

    // Required validation
    if (field.hasAttribute('required')) {
        if (field.type === 'checkbox' && !field.checked) {
            isValid = false;
            message = messages.required;
        } else if (field.type !== 'checkbox' && !value) {
            isValid = false;
            message = messages.required;
        }
    }

    // Specific validations
    if (isValid && value) {
        switch (field.name) {
            case 'firstName':
            case 'lastName':
                if (value.length < 2) {
                    isValid = false;
                    message = messages.minLength;
                }
                break;
            
            case 'email':
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    message = messages.invalid;
                }
                break;
            
            case 'phone':
                const phoneRegex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$|^(\+44\s?1\d{3}|\(?01\d{3}\)?)\s?\d{6}$|^(\+44\s?2\d{2}|\(?02\d{2}\)?)\s?\d{4}\s?\d{4}$/;
                if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                    isValid = false;
                    message = messages.invalid;
                }
                break;
        }
    }

    if (!isValid) {
        showFieldValidation(field, message, 'error');
    } else if (value) {
        showFieldValidation(field, '✓ Valid', 'success');
    }

    return isValid;
}

function showFieldValidation(field, message, type) {
    field.classList.remove('error', 'success');
    field.classList.add(type);

    const validationEl = document.createElement('div');
    validationEl.className = `validation-message ${type}`;
    validationEl.textContent = message;
    
    validationEl.style.cssText = `
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: ${type === 'error' ? '#ef4444' : '#10b981'};
    `;

    field.parentNode.appendChild(validationEl);
}

function clearFieldValidation(field) {
    field.classList.remove('error', 'success');
    const validationMsg = field.parentNode.querySelector('.validation-message');
    if (validationMsg) {
        validationMsg.remove();
    }
}

// ===== CALENDLY INTEGRATION =====
function initCalendlyIntegration() {
    // Check if Calendly script is loaded
    if (typeof Calendly !== 'undefined') {
        setupCalendlyWidget();
    } else {
        // Fallback for when Calendly script loads
        window.addEventListener('load', () => {
            setTimeout(setupCalendlyWidget, 1000);
        });
    }
}

function setupCalendlyWidget() {
    const calendlyContainer = document.querySelector('.calendly-inline-widget');
    if (!calendlyContainer || typeof Calendly === 'undefined') return;

    // Initialize Calendly widget
    Calendly.initInlineWidget({
        url: calendlyContainer.dataset.url || 'https://calendly.com/your-calendar-link',
        parentElement: calendlyContainer,
        prefill: getCalendlyPrefillData(),
        utm: {
            utmCampaign: 'DLZ Tutors',
            utmSource: 'website',
            utmMedium: 'booking_page'
        }
    });

    // Hide placeholder when widget loads
    const placeholder = calendlyContainer.querySelector('.calendly-placeholder');
    if (placeholder) {
        placeholder.style.display = 'none';
    }
}

function getCalendlyPrefillData() {
    const form = document.getElementById('contactForm');
    if (!form) return {};

    return {
        name: (form.firstName?.value + ' ' + form.lastName?.value).trim(),
        email: form.email?.value,
        customAnswers: {
            a1: form.yearGroup?.value,
            a2: form.serviceType?.value,
            a3: form.targetGrade?.value
        }
    };
}

// ===== SERVICE SELECTION =====
function initServiceSelection() {
    const serviceCards = document.querySelectorAll('.booking-card');
    const serviceButtons = document.querySelectorAll('.select-service');

    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceType = this.dataset.service;
            const card = this.closest('.booking-card');
            
            // Visual feedback
            selectServiceCard(card, serviceType);
            
            // Update form
            updateFormForService(serviceType);
            
            // Show additional information
            showServiceDetails(serviceType);
            
            // Track selection (analytics)
            trackServiceSelection(serviceType);
        });
    });
}

function selectServiceCard(selectedCard, serviceType) {
    // Remove selection from all cards
    document.querySelectorAll('.booking-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    selectedCard.classList.add('selected');
    
    // Animate selection
    selectedCard.style.transform = 'scale(1.02)';
    setTimeout(() => {
        selectedCard.style.transform = '';
    }, 200);
}

function updateFormForService(serviceType) {
    const serviceTypeSelect = document.getElementById('serviceType');
    if (serviceTypeSelect) {
        // Map service types to form values
        const serviceMapping = {
            'one-to-one': 'one-to-one',
            'small-group': 'small-group',
            'academy': 'academy'
        };
        
        serviceTypeSelect.value = serviceMapping[serviceType] || serviceType;
        serviceTypeSelect.dispatchEvent(new Event('change'));
    }
    
    // Pre-fill additional fields based on service
    const urgencyField = document.getElementById('urgency');
    if (urgencyField && serviceType === 'one-to-one') {
        // One-to-one often has more urgent requests
        urgencyField.value = 'next-week';
    }
}

function showServiceDetails(serviceType) {
    const details = {
        'one-to-one': {
            title: 'One-to-One Elite Tutoring',
            benefits: [
                'Fully personalized curriculum',
                'Flexible scheduling',
                'Direct tutor contact',
                'Immediate feedback',
                'Progress tracking'
            ],
            nextSteps: 'Complete the form below and we\'ll match you with the perfect tutor for your needs.'
        },
        'small-group': {
            title: 'Small Group Masterclass',
            benefits: [
                'Collaborative learning environment',
                'Peer interaction and discussion',
                'Cost-effective premium quality',
                'Structured group activities',
                'Shared learning experiences'
            ],
            nextSteps: 'We\'ll add you to our next available small group based on your year group and current level.'
        },
        'academy': {
            title: 'Physics Academy',
            benefits: [
                'Comprehensive curriculum coverage',
                'Regular assessments and feedback',
                'Study group community',
                'Structured learning pathway',
                'Academy-style learning environment'
            ],
            nextSteps: 'Join our next academy intake with students at a similar level to you.'
        }
    };
    
    const detail = details[serviceType];
    if (detail) {
        showServiceModal(detail);
    }
}

function showServiceModal(details) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'service-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h3>${details.title}</h3>
            <div class="service-benefits">
                <h4>What's Included:</h4>
                <ul>
                    ${details.benefits.map(benefit => `<li><i class="fas fa-check"></i>${benefit}</li>`).join('')}
                </ul>
            </div>
            <div class="next-steps">
                <h4>Next Steps:</h4>
                <p>${details.nextSteps}</p>
            </div>
            <button class="btn btn-primary modal-continue">Continue with Application</button>
        </div>
    `;
    
    // Modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    `;
    
    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }
        .modal-content {
            position: relative;
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            max-width: 500px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
            animation: modalAppear 0.3s ease;
        }
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #6b7280;
        }
        .service-benefits ul {
            list-style: none;
            margin: 1rem 0;
        }
        .service-benefits li {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
            color: #374151;
        }
        .service-benefits i {
            color: #10b981;
        }
        .next-steps {
            background: #f9fafb;
            padding: 1rem;
            border-radius: 0.5rem;
            margin: 1rem 0;
        }
        .modal-continue {
            width: 100%;
            margin-top: 1rem;
        }
        @keyframes modalAppear {
            from {
                opacity: 0;
                transform: scale(0.9) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
    `;
    document.head.appendChild(modalStyles);
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeModal = () => {
        modal.remove();
        modalStyles.remove();
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    modal.querySelector('.modal-continue').addEventListener('click', () => {
        closeModal();
        document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Close on escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

function trackServiceSelection(serviceType) {
    // Analytics tracking (replace with your analytics service)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'service_selection', {
            'service_type': serviceType,
            'page': 'booking'
        });
    }
    
    console.log('Service selected:', serviceType);
}

// ===== REAL-TIME VALIDATION =====
function initRealTimeValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Email availability check (simulated)
    const emailField = document.getElementById('email');
    if (emailField) {
        let emailCheckTimeout;
        emailField.addEventListener('input', function() {
            clearTimeout(emailCheckTimeout);
            emailCheckTimeout = setTimeout(() => {
                checkEmailAvailability(this.value);
            }, 1000);
        });
    }

    // Phone number formatting
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('input', function() {
            this.value = formatPhoneNumber(this.value);
        });
    }

    // Name capitalization
    const nameFields = ['firstName', 'lastName'];
    nameFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', function() {
                this.value = capitalizeWords(this.value);
            });
        }
    });
}

function checkEmailAvailability(email) {
    if (!email || !isValidEmail(email)) return;
    
    // Simulate email availability check
    // In reality, this would be an API call to your backend
    setTimeout(() => {
        const emailField = document.getElementById('email');
        const isAvailable = !email.includes('test@'); // Simple simulation
        
        if (isAvailable) {
            showFieldValidation(emailField, '✓ Email available', 'success');
        } else {
            showFieldValidation(emailField, 'This email is already registered', 'error');
        }
    }, 500);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatPhoneNumber(value) {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Format as UK phone number
    if (cleaned.startsWith('44')) {
        // International format
        const match = cleaned.match(/^(44)(\d{4})(\d{3})(\d{3})$/);
        if (match) {
            return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
        }
    } else if (cleaned.startsWith('0')) {
        // National format
        const match = cleaned.match(/^(0\d{4})(\d{3})(\d{3})$/);
        if (match) {
            return `${match[1]} ${match[2]} ${match[3]}`;
        }
    }
    
    return value;
}

function capitalizeWords(str) {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// ===== UTILITY FUNCTIONS =====
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

// Add CSS for validation states
const validationStyles = document.createElement('style');
validationStyles.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .form-group input.success,
    .form-group select.success,
    .form-group textarea.success {
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
    
    .booking-card.selected {
        border-color: #3b82f6;
        background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        color: white;
        transform: translateY(-5px);
    }
    
    .booking-card.selected .service-icon {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .booking-card.selected .detail-item {
        color: rgba(255, 255, 255, 0.9);
    }
    
    .booking-card.selected .detail-item i {
        color: white;
    }
`;
document.head.appendChild(validationStyles);
