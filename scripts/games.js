// Games Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const platformFilters = document.querySelectorAll('.platform-filter');
    const gameCards = document.querySelectorAll('.game-card');
    const loadMoreButton = document.getElementById('load-more-games');
    const gamesGrid = document.getElementById('games-grid');
    
    let currentCategoryFilter = 'all';
    let currentPlatformFilter = 'all';
    let visibleGames = 6; // Initially show 6 games
    
    // Category filter functionality
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            currentCategoryFilter = this.dataset.filter;
            filterGames();
        });
    });
    
    // Platform filter functionality
    platformFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Update active filter
            platformFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            currentPlatformFilter = this.dataset.platform;
            filterGames();
        });
    });
    
    // Filter games based on current filters
    function filterGames() {
        let visibleCount = 0;
        
        gameCards.forEach(card => {
            const category = card.dataset.category;
            const platforms = card.dataset.platform;
            
            let showCard = true;
            
            // Category filter
            if (currentCategoryFilter !== 'all' && category !== currentCategoryFilter) {
                showCard = false;
            }
            
            // Platform filter
            if (currentPlatformFilter !== 'all' && !platforms.includes(currentPlatformFilter)) {
                showCard = false;
            }
            
            if (showCard && visibleCount < visibleGames) {
                card.style.display = 'block';
                card.classList.remove('hidden');
                visibleCount++;
            } else if (showCard) {
                card.style.display = 'none';
                card.classList.add('hidden');
            } else {
                card.style.display = 'none';
                card.classList.add('filtered-out');
            }
        });
        
        // Update load more button visibility
        const totalFilteredGames = Array.from(gameCards).filter(card => {
            const category = card.dataset.category;
            const platforms = card.dataset.platform;
            
            let matchesFilter = true;
            
            if (currentCategoryFilter !== 'all' && category !== currentCategoryFilter) {
                matchesFilter = false;
            }
            
            if (currentPlatformFilter !== 'all' && !platforms.includes(currentPlatformFilter)) {
                matchesFilter = false;
            }
            
            return matchesFilter;
        }).length;
        
        if (loadMoreButton) {
            if (visibleCount >= totalFilteredGames) {
                loadMoreButton.style.display = 'none';
            } else {
                loadMoreButton.style.display = 'block';
            }
        }
        
        // Animate visible cards
        animateVisibleCards();
    }
    
    // Load more games functionality
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', function() {
            visibleGames += 6;
            filterGames();
            
            // Scroll to newly loaded games
            setTimeout(() => {
                const newlyVisible = document.querySelector('.game-card:nth-child(' + (visibleGames - 5) + ')');
                if (newlyVisible) {
                    newlyVisible.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
        });
    }
    
    // Animate visible cards
    function animateVisibleCards() {
        const visibleCards = Array.from(gameCards).filter(card => 
            card.style.display !== 'none' && !card.classList.contains('hidden')
        );
        
        visibleCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Game card interactions
    gameCards.forEach(card => {
        const bookButton = card.querySelector('.btn');
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click tracking
        if (bookButton) {
            bookButton.addEventListener('click', function(e) {
                const gameTitle = card.querySelector('.game-title').textContent;
                
                // Analytics tracking (placeholder)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'game_book_click', {
                        'game_name': gameTitle,
                        'page_location': window.location.href
                    });
                }
                
                // Visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        }
    });
    
    // Search functionality (if search input exists)
    const searchInput = document.getElementById('game-search');
    if (searchInput) {
        searchInput.addEventListener('input', GameOnDen.debounce(function() {
            const searchTerm = this.value.toLowerCase();
            
            gameCards.forEach(card => {
                const gameTitle = card.querySelector('.game-title').textContent.toLowerCase();
                const gameDescription = card.querySelector('.game-description').textContent.toLowerCase();
                
                if (gameTitle.includes(searchTerm) || gameDescription.includes(searchTerm)) {
                    card.classList.remove('search-hidden');
                } else {
                    card.classList.add('search-hidden');
                }
            });
            
            filterGames();
        }, 300));
    }
    
    // Keyboard navigation for filters
    filterTabs.forEach((tab, index) => {
        tab.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' && index < filterTabs.length - 1) {
                filterTabs[index + 1].focus();
            }
            if (e.key === 'ArrowLeft' && index > 0) {
                filterTabs[index - 1].focus();
            }
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    platformFilters.forEach((filter, index) => {
        filter.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' && index < platformFilters.length - 1) {
                platformFilters[index + 1].focus();
            }
            if (e.key === 'ArrowLeft' && index > 0) {
                platformFilters[index - 1].focus();
            }
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Game card keyboard navigation
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
        });
    });
    
    // Lazy loading for game images
    const gameImages = document.querySelectorAll('.game-image img');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });
    
    gameImages.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });
    
    // Add game to favorites (localStorage)
    function addToFavorites(gameTitle) {
        let favorites = JSON.parse(localStorage.getItem('gameOnDenFavorites') || '[]');
        if (!favorites.includes(gameTitle)) {
            favorites.push(gameTitle);
            localStorage.setItem('gameOnDenFavorites', JSON.stringify(favorites));
        }
    }
    
    function removeFromFavorites(gameTitle) {
        let favorites = JSON.parse(localStorage.getItem('gameOnDenFavorites') || '[]');
        favorites = favorites.filter(game => game !== gameTitle);
        localStorage.setItem('gameOnDenFavorites', JSON.stringify(favorites));
    }
    
    function isFavorite(gameTitle) {
        const favorites = JSON.parse(localStorage.getItem('gameOnDenFavorites') || '[]');
        return favorites.includes(gameTitle);
    }
    
    // Add favorite buttons to game cards
    gameCards.forEach(card => {
        const gameTitle = card.querySelector('.game-title').textContent;
        const gameActions = card.querySelector('.game-actions');
        
        if (gameActions) {
            const favoriteButton = document.createElement('button');
            favoriteButton.className = 'btn btn-secondary btn-small favorite-btn';
            favoriteButton.innerHTML = isFavorite(gameTitle) ? '❤️ Favorited' : '🤍 Favorite';
            favoriteButton.style.marginLeft = '10px';
            
            favoriteButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (isFavorite(gameTitle)) {
                    removeFromFavorites(gameTitle);
                    this.innerHTML = '🤍 Favorite';
                } else {
                    addToFavorites(gameTitle);
                    this.innerHTML = '❤️ Favorited';
                }
            });
            
            gameActions.appendChild(favoriteButton);
        }
    });
    
    // Initialize filters
    filterGames();
    
    // Add CSS for search hidden state
    const style = document.createElement('style');
    style.textContent = `
        .game-card.search-hidden {
            display: none !important;
        }
        
        .favorite-btn {
            transition: all 0.3s ease;
        }
        
        .favorite-btn:hover {
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);
});