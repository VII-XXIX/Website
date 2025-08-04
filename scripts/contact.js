// Contact Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const subjectSelect = document.getElementById('subject');
    
    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!window.validateForm(this)) {
                return;
            }
            
            // Set loading state
            const submitButton = this.querySelector('button[type="submit"]');
            window.setLoadingState(submitButton, true);
            window.setLoadingState(this, true);
            
            // Get form data
            const formData = new FormData(this);
            const contactData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone') || 'Not provided',
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            // Simulate form submission (in real app, this would be an API call)
            setTimeout(() => {
                // Generate WhatsApp message for urgent inquiries
                if (contactData.subject === 'booking' || contactData.subject === 'technical') {
                    const whatsappMessage = generateWhatsAppMessage(contactData);
                    const whatsappURL = GameOnDen.generateWhatsAppURL('917448902644', whatsappMessage);
                    
                    // Show option to contact via WhatsApp
                    const whatsappOption = document.createElement('div');
                    whatsappOption.className = 'whatsapp-option-popup';
                    whatsappOption.innerHTML = `
                        <div style="background: rgba(37, 211, 102, 0.1); border: 1px solid #25d366; padding: 1rem; border-radius: 8px; margin: 1rem 0; text-align: center;">
                            <p style="margin-bottom: 1rem; color: var(--gray-light);">⚡ For faster response, you can also contact us via WhatsApp:</p>
                            <a href="${whatsappURL}" target="_blank" class="btn btn-whatsapp" style="display: inline-block;">📱 Continue on WhatsApp</a>
                        </div>
                    `;
                    
                    this.appendChild(whatsappOption);
                    
                    setTimeout(() => {
                        whatsappOption.remove();
                    }, 10000);
                }
                
                // Track form submission
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'contact_form_submit', {
                        'subject': contactData.subject,
                        'page_location': window.location.href
                    });
                }
                
                // Show success message
                window.showSuccessMessage(this, 'Thank you for your message! We\'ll get back to you within 24 hours.');
                
                // Reset form
                this.reset();
                
                // Remove loading state
                window.setLoadingState(submitButton, false);
                window.setLoadingState(this, false);
                
                // Clear any existing form group states
                const formGroups = this.querySelectorAll('.form-group');
                formGroups.forEach(group => {
                    group.classList.remove('error', 'success', 'focused');
                });
                
            }, 2000); // Simulate network delay
        });
    }
    
    // Generate WhatsApp message for contact form
    function generateWhatsAppMessage(data) {
        return `Hi GAMEON DEN,

I submitted a contact form on your website with the following details:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Subject: ${getSubjectText(data.subject)}

Message:
${data.message}

Please get back to me as soon as possible.

Thank you!`;
    }
    
    // Get subject text from value
    function getSubjectText(value) {
        const subjects = {
            'booking': 'Booking Inquiry',
            'pricing': 'Pricing Question',
            'events': 'Private Events',
            'feedback': 'Feedback',
            'technical': 'Technical Support',
            'other': 'Other'
        };
        return subjects[value] || 'Other';
    }
    
    // Subject-based form customization
    if (subjectSelect) {
        subjectSelect.addEventListener('change', function() {
            const messageTextarea = document.getElementById('message');
            const subject = this.value;
            
            // Update placeholder based on subject
            if (messageTextarea) {
                const placeholders = {
                    'booking': 'Please let us know your preferred date, time, number of players, and any specific game preferences...',
                    'pricing': 'What specific pricing information would you like to know about?',
                    'events': 'Tell us about your event - date, number of participants, duration, and any special requirements...',
                    'feedback': 'We\'d love to hear about your experience at GAMEON DEN...',
                    'technical': 'Please describe the technical issue you\'re experiencing...',
                    'other': 'Tell us how we can help you...'
                };
                
                messageTextarea.placeholder = placeholders[subject] || 'Tell us how we can help you...';
            }
            
            // Show relevant quick info
            showSubjectInfo(subject);
        });
    }
    
    // Show subject-specific information
    function showSubjectInfo(subject) {
        // Remove existing info
        const existingInfo = document.querySelector('.subject-info');
        if (existingInfo) {
            existingInfo.remove();
        }
        
        const infoContent = {
            'booking': {
                title: 'Quick Booking Tip',
                content: 'For instant booking, use our WhatsApp booking option for faster confirmation!'
            },
            'pricing': {
                title: 'Current Pricing',
                content: 'Solo: ₹90/hr | Duo: ₹80/player/hr | Squad: ₹70/player/hr'
            },
            'events': {
                title: 'Private Events',
                content: 'We offer custom packages for birthdays, corporate events, and tournaments. Minimum 4 hours booking required.'
            },
            'technical': {
                title: 'Technical Support',
                content: 'For urgent technical issues during your gaming session, please call us directly at +91 98765 43210'
            }
        };
        
        if (infoContent[subject]) {
            const info = document.createElement('div');
            info.className = 'subject-info';
            info.innerHTML = `
                <div style="background: rgba(0, 255, 136, 0.1); border: 1px solid var(--secondary-green); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <strong style="color: var(--secondary-green);">${infoContent[subject].title}:</strong><br>
                    <span style="color: var(--gray-light); font-size: 0.9rem;">${infoContent[subject].content}</span>
                </div>
            `;
            
            const messageGroup = document.getElementById('message').closest('.form-group');
            messageGroup.parentNode.insertBefore(info, messageGroup);
        }
    }
    
    // Contact method interactions
    const contactMethods = document.querySelectorAll('.contact-method');
    contactMethods.forEach(method => {
        const button = method.querySelector('.btn');
        
        if (button) {
            button.addEventListener('click', function(e) {
                // Track contact method usage
                const methodType = method.querySelector('h3').textContent.toLowerCase();
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'contact_method_click', {
                        'method': methodType,
                        'page_location': window.location.href
                    });
                }
                
                // Add visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        }
    });
    
    // FAQ interactions
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add expand animation
            this.style.transform = 'scale(1.02)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            // Track FAQ interaction
            const question = this.querySelector('h3').textContent;
            if (typeof gtag !== 'undefined') {
                gtag('event', 'faq_click', {
                    'question': question,
                    'page_location': window.location.href
                });
            }
        });
    });
    
    // Location item interactions
    const locationItems = document.querySelectorAll('.location-item');
    locationItems.forEach(item => {
        item.addEventListener('click', function() {
            const info = this.querySelector('.location-info p').textContent;
            
            // Copy to clipboard if it's contact info
            if (info.includes('+91') || info.includes('@')) {
                navigator.clipboard.writeText(info).then(() => {
                    // Show copied feedback
                    const feedback = document.createElement('div');
                    feedback.textContent = 'Copied to clipboard!';
                    feedback.style.position = 'absolute';
                    feedback.style.top = '-30px';
                    feedback.style.left = '50%';
                    feedback.style.transform = 'translateX(-50%)';
                    feedback.style.background = 'var(--success)';
                    feedback.style.color = 'white';
                    feedback.style.padding = '5px 10px';
                    feedback.style.borderRadius = '4px';
                    feedback.style.fontSize = '0.8rem';
                    feedback.style.zIndex = '1000';
                    feedback.style.opacity = '0';
                    feedback.style.transition = 'opacity 0.3s ease';
                    
                    this.style.position = 'relative';
                    this.appendChild(feedback);
                    
                    setTimeout(() => {
                        feedback.style.opacity = '1';
                    }, 100);
                    
                    setTimeout(() => {
                        feedback.style.opacity = '0';
                        setTimeout(() => {
                            feedback.remove();
                        }, 300);
                    }, 2000);
                }).catch(() => {
                    console.log('Could not copy to clipboard');
                });
            }
        });
    });
    
    // Form field enhancements
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        // Add floating label effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if field has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
        
        // Real-time validation feedback
        input.addEventListener('input', function() {
            const formGroup = this.closest('.form-group');
            const errorMessage = formGroup.querySelector('.error-message');
            
            // Remove existing error
            if (errorMessage) {
                errorMessage.remove();
            }
            formGroup.classList.remove('error', 'success');
            
            // Validate on input for better UX
            if (this.hasAttribute('required') && this.value.trim()) {
                if (this.type === 'email' && this.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailRegex.test(this.value)) {
                        formGroup.classList.add('success');
                    }
                } else {
                    formGroup.classList.add('success');
                }
            }
        });
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.substring(0, 10);
            }
            
            // Format as: 98765 43210
            if (value.length > 5) {
                value = value.substring(0, 5) + ' ' + value.substring(5);
            }
            
            this.value = value;
        });
    }
    
    // Auto-resize textarea
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        messageTextarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
    
    // Add CSS for contact enhancements
    const style = document.createElement('style');
    style.textContent = `
        .form-group.focused label {
            color: var(--primary-red);
            transform: translateY(-2px);
        }
        
        .contact-method {
            cursor: pointer;
        }
        
        .location-item {
            cursor: pointer;
        }
        
        .location-item:hover {
            background: linear-gradient(135deg, var(--dark-secondary) 0%, rgba(0, 255, 136, 0.05) 100%);
        }
        
        .faq-item {
            cursor: pointer;
        }
        
        .subject-info {
            animation: slideDown 0.3s ease;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        textarea {
            resize: vertical;
            min-height: 120px;
            transition: height 0.2s ease;
        }
    `;
    document.head.appendChild(style);
});