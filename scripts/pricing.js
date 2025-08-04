// Pricing Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const playersSelect = document.getElementById('players');
    const hoursRange = document.getElementById('hours');
    const hoursDisplay = document.getElementById('hours-display');
    const rateDisplay = document.getElementById('rate');
    const totalPlayersDisplay = document.getElementById('total-players');
    const durationDisplay = document.getElementById('duration');
    const totalCostDisplay = document.getElementById('total-cost');
    
    // Pricing rates
    const rates = {
        1: 90,  // Solo
        2: 80,  // Duo
        4: 70   // Squad
    };
    
    // Update calculator
    function updateCalculator() {
        if (!playersSelect || !hoursRange) return;
        
        const players = parseInt(playersSelect.value) || 1;
        const hours = parseFloat(hoursRange.value) || 1;
        const rate = rates[players] || 90;
        const totalCost = players * rate * hours;
        
        // Update displays
        if (hoursDisplay) {
            hoursDisplay.textContent = `${hours} hour${hours !== 1 ? 's' : ''}`;
        }
        
        if (rateDisplay) {
            rateDisplay.textContent = `₹${rate}`;
        }
        
        if (totalPlayersDisplay) {
            totalPlayersDisplay.textContent = players;
        }
        
        if (durationDisplay) {
            durationDisplay.textContent = `${hours} hour${hours !== 1 ? 's' : ''}`;
        }
        
        if (totalCostDisplay) {
            totalCostDisplay.textContent = `₹${totalCost}`;
        }
    }
    
    // Event listeners for calculator
    if (playersSelect) {
        playersSelect.addEventListener('change', updateCalculator);
    }
    
    if (hoursRange) {
        hoursRange.addEventListener('input', updateCalculator);
    }
    
    // Initialize calculator
    updateCalculator();
    
    // Pricing card interactions
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            pricingCards.forEach(c => c.classList.remove('selected'));
            
            // Add active class to clicked card
            this.classList.add('selected');
            
            // Update calculator based on selected plan
            const planName = this.querySelector('.plan-name').textContent.toLowerCase();
            if (playersSelect) {
                if (planName.includes('solo')) {
                    playersSelect.value = '1';
                } else if (planName.includes('duo')) {
                    playersSelect.value = '2';
                } else if (planName.includes('squad')) {
                    playersSelect.value = '4';
                }
                updateCalculator();
            }
            
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Hover effects
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('popular')) {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('popular')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');
        
        if (question && answer) {
            // Initially hide answers
            answer.style.maxHeight = '0';
            answer.style.overflow = 'hidden';
            answer.style.transition = 'max-height 0.3s ease';
            
            question.style.cursor = 'pointer';
            question.style.position = 'relative';
            
            // Add expand/collapse icon
            const icon = document.createElement('span');
            icon.innerHTML = '+';
            icon.style.position = 'absolute';
            icon.style.right = '0';
            icon.style.top = '0';
            icon.style.fontSize = '1.5rem';
            icon.style.color = 'var(--primary-red)';
            icon.style.transition = 'transform 0.3s ease';
            question.appendChild(icon);
            
            question.addEventListener('click', function() {
                const isOpen = answer.style.maxHeight !== '0px';
                
                if (isOpen) {
                    answer.style.maxHeight = '0';
                    icon.style.transform = 'rotate(0deg)';
                    icon.innerHTML = '+';
                } else {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.style.transform = 'rotate(45deg)';
                    icon.innerHTML = '×';
                }
            });
        }
    });
    
    // Smooth scroll to calculator when pricing card is clicked
    const calculatorSection = document.querySelector('.pricing-calculator');
    if (calculatorSection) {
        pricingCards.forEach(card => {
            const bookButton = card.querySelector('.btn');
            if (bookButton) {
                bookButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Update calculator first
                    const planName = card.querySelector('.plan-name').textContent.toLowerCase();
                    if (playersSelect) {
                        if (planName.includes('solo')) {
                            playersSelect.value = '1';
                        } else if (planName.includes('duo')) {
                            playersSelect.value = '2';
                        } else if (planName.includes('squad')) {
                            playersSelect.value = '4';
                        }
                        updateCalculator();
                    }
                    
                    // Scroll to calculator
                    calculatorSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                    });
                    
                    // Highlight calculator
                    const calculator = calculatorSection.querySelector('.calculator');
                    if (calculator) {
                        calculator.style.boxShadow = '0 0 20px rgba(255, 68, 68, 0.5)';
                        setTimeout(() => {
                            calculator.style.boxShadow = '';
                        }, 2000);
                    }
                });
            }
        });
    }
    
    // Price comparison tooltip
    const priceAmounts = document.querySelectorAll('.amount');
    priceAmounts.forEach(amount => {
        amount.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'price-tooltip';
            tooltip.innerHTML = 'Best value for groups!';
            tooltip.style.position = 'absolute';
            tooltip.style.background = 'var(--dark-tertiary)';
            tooltip.style.color = 'var(--white)';
            tooltip.style.padding = '8px 12px';
            tooltip.style.borderRadius = '6px';
            tooltip.style.fontSize = '0.8rem';
            tooltip.style.top = '-40px';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.zIndex = '1000';
            tooltip.style.opacity = '0';
            tooltip.style.transition = 'opacity 0.3s ease';
            
            this.style.position = 'relative';
            this.appendChild(tooltip);
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 100);
        });
        
        amount.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.price-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
    
    // Dynamic pricing updates based on time of day
    function updateDynamicPricing() {
        const currentHour = new Date().getHours();
        const isWeekend = [0, 6].includes(new Date().getDay());
        
        // Peak hours: 6 PM - 10 PM on weekdays, all day on weekends
        const isPeakTime = (currentHour >= 18 && currentHour <= 22) || isWeekend;
        
        if (isPeakTime) {
            const peakNotice = document.createElement('div');
            peakNotice.className = 'peak-time-notice';
            peakNotice.innerHTML = `
                <div style="background: rgba(255, 136, 0, 0.1); border: 1px solid #ff8800; padding: 1rem; border-radius: 8px; margin: 1rem 0; text-align: center;">
                    <strong style="color: #ff8800;">Peak Time Pricing</strong><br>
                    <span style="color: var(--gray-light); font-size: 0.9rem;">Higher demand during ${isWeekend ? 'weekends' : 'evening hours'}</span>
                </div>
            `;
            
            const pricingMain = document.querySelector('.pricing-main .container');
            if (pricingMain && !document.querySelector('.peak-time-notice')) {
                pricingMain.insertBefore(peakNotice, pricingMain.firstChild);
            }
        }
    }
    
    // Initialize dynamic pricing
    updateDynamicPricing();
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .pricing-card.selected {
            border-color: var(--secondary-green) !important;
            background: linear-gradient(135deg, var(--dark-secondary) 0%, rgba(0, 255, 136, 0.1) 100%) !important;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 68, 68, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            left: 50%;
            top: 50%;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .faq-item h3:hover {
            color: var(--primary-red);
        }
        
        .calculator {
            transition: box-shadow 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Keyboard navigation for pricing cards
    pricingCards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
            
            if (e.key === 'ArrowRight' && index < pricingCards.length - 1) {
                pricingCards[index + 1].focus();
            }
            
            if (e.key === 'ArrowLeft' && index > 0) {
                pricingCards[index - 1].focus();
            }
        });
    });
});