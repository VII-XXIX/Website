// Home Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Hero stats animation
    const stats = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        stats.forEach(stat => {
            const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Format the number based on the original text
                const originalText = stat.textContent;
                if (originalText.includes('₹')) {
                    stat.textContent = `₹${Math.floor(current)}`;
                } else if (originalText.includes('+')) {
                    stat.textContent = `${Math.floor(current)}+`;
                } else if (originalText.includes('hrs')) {
                    stat.textContent = `${Math.floor(current)}hrs`;
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 16);
        });
    }
    
    // Trigger stats animation when hero section is visible
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const heroObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    heroObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        heroObserver.observe(heroSection);
    }
    
    // Game cards hover effects
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        // Make game cards clickable to navigate to games page
        card.addEventListener('click', function() {
            window.location.href = 'games.html';
        });
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Pricing card interactions
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 68, 68, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.marginLeft = '-10px';
            ripple.style.marginTop = '-10px';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Testimonials carousel (if multiple testimonials)
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    if (testimonialCards.length > 3) {
        let currentTestimonial = 0;
        const testimonialContainer = document.querySelector('.testimonials-grid');
        
        function showTestimonials() {
            testimonialCards.forEach((card, index) => {
                if (index >= currentTestimonial && index < currentTestimonial + 3) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }
        
        function nextTestimonials() {
            currentTestimonial = (currentTestimonial + 3) % testimonialCards.length;
            showTestimonials();
        }
        
        // Auto-rotate testimonials every 5 seconds
        setInterval(nextTestimonials, 5000);
        showTestimonials();
    }
    
    // Parallax effect for hero background
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        window.addEventListener('scroll', GameOnDen.throttle(function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            heroBackground.style.transform = `translateY(${parallax}px)`;
        }, 16));
    }
    
    // Dynamic pricing updates
    const pricingAmounts = document.querySelectorAll('.amount');
    pricingAmounts.forEach(amount => {
        amount.addEventListener('mouseenter', function() {
            this.style.color = '#00ff88';
            this.style.textShadow = '0 0 10px rgba(0, 255, 136, 0.5)';
        });
        
        amount.addEventListener('mouseleave', function() {
            this.style.color = '#ff4444';
            this.style.textShadow = 'none';
        });
    });
    
    // CTA button enhancements
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click analytics (placeholder)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    'button_text': this.textContent.trim(),
                    'page_location': window.location.href
                });
            }
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Featured games rotation
    const featuredGames = [
        {
            title: "Spider-Man 2",
            description: "Action Adventure",
            platform: "PS5",
            image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
            title: "FIFA 25",
            description: "Sports",
            platform: "PS5 / Xbox",
            image: "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
            title: "WWE 2K25",
            description: "Sports Entertainment",
            platform: "PS5 / Xbox",
            image: "https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
            title: "Mortal Kombat",
            description: "Fighting",
            platform: "PS5 / Xbox / PC",
            image: "https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
    ];
    
    // Add keyboard navigation for game cards
    gameCards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const bookButton = this.querySelector('.btn');
                if (bookButton) {
                    bookButton.click();
                }
            }
            
            if (e.key === 'ArrowRight' && index < gameCards.length - 1) {
                gameCards[index + 1].focus();
            }
            
            if (e.key === 'ArrowLeft' && index > 0) {
                gameCards[index - 1].focus();
            }
        });
    });
    
    // Intersection Observer for staggered animations
    const staggerObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.children;
                Array.from(children).forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // Apply staggered animation to grids
    const grids = document.querySelectorAll('.games-grid, .pricing-cards, .testimonials-grid');
    grids.forEach(grid => {
        const children = grid.children;
        Array.from(children).forEach(child => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        staggerObserver.observe(grid);
    });
    
    // Add ripple effect CSS if not already present
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Performance optimization: Preload critical images
    const criticalImages = [
        'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});