// Book Slot Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('booking-form');
    const playersSelect = document.getElementById('num-players');
    const durationSelect = document.getElementById('duration');
    const rateDisplay = document.getElementById('rate-display');
    const playersDisplay = document.getElementById('players-display');
    const durationDisplay = document.getElementById('duration-display');
    const totalCostDisplay = document.getElementById('total-cost-display');
    const bookingDateInput = document.getElementById('booking-date');
    
    // Pricing rates
    const rates = {
        1: 90,  // Solo
        2: 80,  // Duo
        4: 70   // Squad
    };
    
    // Set minimum date to today
    if (bookingDateInput) {
        const today = new Date().toISOString().split('T')[0];
        bookingDateInput.min = today;
        bookingDateInput.value = today;
    }
    
    // Update cost calculator
    function updateCostCalculator() {
        const players = parseInt(playersSelect?.value) || 0;
        const duration = parseFloat(durationSelect?.value) || 0;
        const rate = rates[players] || 0;
        const totalCost = players * rate * duration;
        
        if (rateDisplay) {
            rateDisplay.textContent = rate > 0 ? `₹${rate}` : '-';
        }
        
        if (playersDisplay) {
            playersDisplay.textContent = players > 0 ? players : '-';
        }
        
        if (durationDisplay) {
            durationDisplay.textContent = duration > 0 ? `${duration} hour${duration !== 1 ? 's' : ''}` : '-';
        }
        
        if (totalCostDisplay) {
            totalCostDisplay.textContent = totalCost > 0 ? `₹${totalCost}` : '₹0';
        }
    }
    
    // Event listeners for cost calculator
    if (playersSelect) {
        playersSelect.addEventListener('change', updateCostCalculator);
    }
    
    if (durationSelect) {
        durationSelect.addEventListener('change', updateCostCalculator);
    }
    
    // Initialize calculator
    updateCostCalculator();
    
    // Form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!window.validateForm(this)) {
                return;
            }
            
            // Get form data
            const formData = new FormData(this);
            const bookingData = {
                name: formData.get('playerName'),
                phone: formData.get('phoneNumber'),
                date: formData.get('bookingDate'),
                time: formData.get('bookingTime'),
                players: formData.get('numPlayers'),
                duration: formData.get('duration'),
                gamePreference: formData.get('gamePreference') || 'Any Game/Console',
                specialRequests: formData.get('specialRequests') || 'None'
            };
            
            // Generate WhatsApp message
            const message = generateWhatsAppMessage(bookingData);
            
            // Create WhatsApp URL
            const whatsappURL = GameOnDen.generateWhatsAppURL('917448902644', message);
            
            // Track booking attempt
            if (typeof gtag !== 'undefined') {
                gtag('event', 'booking_attempt', {
                    'players': bookingData.players,
                    'duration': bookingData.duration,
                    'game_preference': bookingData.gamePreference
                });
            }
            
            // Open WhatsApp
            window.open(whatsappURL, '_blank');
            
            // Show success message
            window.showSuccessMessage(this, 'Booking request sent! We\'ll confirm your slot via WhatsApp shortly.');
            
            // Reset form after a delay
            setTimeout(() => {
                this.reset();
                updateCostCalculator();
            }, 2000);
        });
    }
    
    // Generate WhatsApp message
    function generateWhatsAppMessage(data) {
        const rate = rates[parseInt(data.players)] || 90;
        const totalCost = parseInt(data.players) * rate * parseFloat(data.duration);
        
        return `Hi GAMEON DEN, I'd like to book a gaming slot. My details are:

Name: ${data.name}
Phone: ${data.phone}
Date: ${data.date}
Time: ${data.time}
Number of Players: ${data.players}
Duration: ${data.duration} hour${data.duration !== '1' ? 's' : ''}
Game/Console Preference: ${data.gamePreference}
Special Requests: ${data.specialRequests}

Estimated Cost: ₹${totalCost}

Please confirm my booking. Thank you!`;
    }
    
    // Time slot availability check (mock)
    const timeSelect = document.getElementById('booking-time');
    if (timeSelect && bookingDateInput) {
        function checkTimeAvailability() {
            const selectedDate = new Date(bookingDateInput.value);
            const today = new Date();
            const isToday = selectedDate.toDateString() === today.toDateString();
            const currentHour = today.getHours();
            
            Array.from(timeSelect.options).forEach(option => {
                if (option.value) {
                    const timeHour = parseInt(option.value.split(':')[0]);
                    const isPM = option.value.includes('PM');
                    const hour24 = isPM && timeHour !== 12 ? timeHour + 12 : (timeHour === 12 && !isPM ? 0 : timeHour);
                    
                    // Disable past times for today
                    if (isToday && hour24 <= currentHour) {
                        option.disabled = true;
                        option.textContent = option.textContent.replace(' (Available)', '') + ' (Past)';
                    } else {
                        option.disabled = false;
                        option.textContent = option.textContent.replace(' (Past)', '').replace(' (Available)', '') + ' (Available)';
                    }
                }
            });
        }
        
        bookingDateInput.addEventListener('change', checkTimeAvailability);
        checkTimeAvailability();
    }
    
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
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone-number');
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
    
    // Auto-fill form from URL parameters (for direct links)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('game')) {
        const gamePreferenceSelect = document.getElementById('game-preference');
        if (gamePreferenceSelect) {
            const gameParam = urlParams.get('game');
            Array.from(gamePreferenceSelect.options).forEach(option => {
                if (option.value.toLowerCase().includes(gameParam.toLowerCase())) {
                    option.selected = true;
                }
            });
        }
    }
    
    // Quick booking buttons
    const quickBookButtons = document.querySelectorAll('.btn-whatsapp');
    quickBookButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Track quick booking clicks
            if (typeof gtag !== 'undefined') {
                gtag('event', 'quick_booking_click', {
                    'button_type': this.textContent.includes('Quick') ? 'quick' : 'detailed'
                });
            }
        });
    });
    
    // Booking tips interaction
    const tipCards = document.querySelectorAll('.tip-card');
    tipCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add pulse animation
            this.style.animation = 'pulse 0.6s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    });
    
    // Form progress indicator
    function updateFormProgress() {
        const requiredFields = bookingForm.querySelectorAll('[required]');
        const filledFields = Array.from(requiredFields).filter(field => field.value.trim() !== '');
        const progress = (filledFields.length / requiredFields.length) * 100;
        
        let progressBar = document.querySelector('.form-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'form-progress';
            progressBar.innerHTML = `
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <span class="progress-text">Form Progress: 0%</span>
            `;
            bookingForm.insertBefore(progressBar, bookingForm.firstChild);
        }
        
        const progressFill = progressBar.querySelector('.progress-fill');
        const progressText = progressBar.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `Form Progress: ${Math.round(progress)}%`;
        }
    }
    
    // Update progress on input
    if (bookingForm) {
        const formFields = bookingForm.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.addEventListener('input', updateFormProgress);
            field.addEventListener('change', updateFormProgress);
        });
        
        // Initialize progress
        updateFormProgress();
    }
    
    // Add CSS for form enhancements
    const style = document.createElement('style');
    style.textContent = `
        .form-group.focused label {
            color: var(--primary-red);
            transform: translateY(-5px);
        }
        
        .form-progress {
            margin-bottom: 2rem;
            text-align: center;
        }
        
        .progress-bar {
            width: 100%;
            height: 6px;
            background: var(--dark-tertiary);
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 0.5rem;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-red), var(--secondary-green));
            transition: width 0.3s ease;
            border-radius: 3px;
        }
        
        .progress-text {
            font-size: 0.9rem;
            color: var(--gray-light);
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .tip-card {
            cursor: pointer;
        }
        
        select option:disabled {
            color: #666;
            background: #333;
        }
    `;
    document.head.appendChild(style);
    
    // Auto-save form data to localStorage
    function saveFormData() {
        if (!bookingForm) return;
        
        const formData = new FormData(bookingForm);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        localStorage.setItem('gameOnDenBookingForm', JSON.stringify(data));
    }
    
    function loadFormData() {
        if (!bookingForm) return;
        
        const savedData = localStorage.getItem('gameOnDenBookingForm');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            Object.keys(data).forEach(key => {
                const field = bookingForm.querySelector(`[name="${key}"]`);
                if (field && data[key]) {
                    field.value = data[key];
                    field.parentElement.classList.add('focused');
                }
            });
            
            updateCostCalculator();
            updateFormProgress();
        }
    }
    
    // Save form data on input
    if (bookingForm) {
        const formFields = bookingForm.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.addEventListener('input', GameOnDen.debounce(saveFormData, 500));
            field.addEventListener('change', saveFormData);
        });
    }
    
    // Load saved form data
    loadFormData();
    
    // Clear saved data on successful submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function() {
            setTimeout(() => {
                localStorage.removeItem('gameOnDenBookingForm');
            }, 2000);
        });
    }
});