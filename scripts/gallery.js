// Gallery Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const loadMoreButton = document.getElementById('load-more-gallery');
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');
    
    let currentFilter = 'all';
    let visibleItems = 8; // Initially show 8 items
    let currentImageIndex = 0;
    let filteredImages = [];
    
    // Filter functionality
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.dataset.filter;
            visibleItems = 8; // Reset visible items
            filterGallery();
        });
    });
    
    // Filter gallery items
    function filterGallery() {
        let visibleCount = 0;
        filteredImages = [];
        
        galleryItems.forEach((item, index) => {
            const category = item.dataset.category;
            const shouldShow = currentFilter === 'all' || category === currentFilter;
            
            if (shouldShow && visibleCount < visibleItems) {
                item.style.display = 'block';
                item.classList.remove('hidden');
                filteredImages.push({
                    element: item,
                    index: index,
                    src: item.querySelector('.gallery-zoom').dataset.image
                });
                visibleCount++;
            } else if (shouldShow) {
                item.style.display = 'none';
                item.classList.add('hidden');
                filteredImages.push({
                    element: item,
                    index: index,
                    src: item.querySelector('.gallery-zoom').dataset.image
                });
            } else {
                item.style.display = 'none';
                item.classList.add('filtered-out');
            }
        });
        
        // Update load more button
        const totalFilteredItems = Array.from(galleryItems).filter(item => {
            const category = item.dataset.category;
            return currentFilter === 'all' || category === currentFilter;
        }).length;
        
        if (loadMoreButton) {
            if (visibleCount >= totalFilteredItems) {
                loadMoreButton.style.display = 'none';
            } else {
                loadMoreButton.style.display = 'block';
            }
        }
        
        // Animate visible items
        animateVisibleItems();
    }
    
    // Load more functionality
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', function() {
            visibleItems += 8;
            filterGallery();
            
            // Scroll to newly loaded items
            setTimeout(() => {
                const newlyVisible = document.querySelector('.gallery-item:nth-child(' + (visibleItems - 7) + ')');
                if (newlyVisible) {
                    newlyVisible.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
        });
    }
    
    // Animate visible items
    function animateVisibleItems() {
        const visibleItems = Array.from(galleryItems).filter(item => 
            item.style.display !== 'none' && !item.classList.contains('hidden')
        );
        
        visibleItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Image modal functionality
    const zoomButtons = document.querySelectorAll('.gallery-zoom');
    zoomButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const imageSrc = this.dataset.image;
            currentImageIndex = filteredImages.findIndex(img => img.src === imageSrc);
            
            if (currentImageIndex === -1) {
                currentImageIndex = 0;
            }
            
            openModal(imageSrc);
        });
    });
    
    // Open modal
    function openModal(imageSrc) {
        if (modalImage && imageModal) {
            modalImage.src = imageSrc;
            imageModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Preload adjacent images
            preloadAdjacentImages();
        }
    }
    
    // Close modal
    function closeModal() {
        if (imageModal) {
            imageModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Modal event listeners
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (imageModal) {
        imageModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
    
    // Navigation functionality
    if (modalPrev) {
        modalPrev.addEventListener('click', function() {
            navigateImage(-1);
        });
    }
    
    if (modalNext) {
        modalNext.addEventListener('click', function() {
            navigateImage(1);
        });
    }
    
    // Navigate images
    function navigateImage(direction) {
        if (filteredImages.length === 0) return;
        
        currentImageIndex += direction;
        
        if (currentImageIndex >= filteredImages.length) {
            currentImageIndex = 0;
        } else if (currentImageIndex < 0) {
            currentImageIndex = filteredImages.length - 1;
        }
        
        const newImageSrc = filteredImages[currentImageIndex].src;
        if (modalImage) {
            modalImage.src = newImageSrc;
        }
        
        preloadAdjacentImages();
    }
    
    // Preload adjacent images for smooth navigation
    function preloadAdjacentImages() {
        const preloadIndices = [
            currentImageIndex - 1 >= 0 ? currentImageIndex - 1 : filteredImages.length - 1,
            currentImageIndex + 1 < filteredImages.length ? currentImageIndex + 1 : 0
        ];
        
        preloadIndices.forEach(index => {
            if (filteredImages[index]) {
                const img = new Image();
                img.src = filteredImages[index].src;
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (imageModal && imageModal.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    navigateImage(-1);
                    break;
                case 'ArrowRight':
                    navigateImage(1);
                    break;
            }
        }
    });
    
    // Gallery item hover effects
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Customer photo interactions
    const customerPhotos = document.querySelectorAll('.customer-photo');
    customerPhotos.forEach(photo => {
        photo.addEventListener('click', function() {
            // Add like animation
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.style.position = 'absolute';
            heart.style.top = '20px';
            heart.style.right = '20px';
            heart.style.fontSize = '2rem';
            heart.style.opacity = '0';
            heart.style.transform = 'scale(0)';
            heart.style.transition = 'all 0.6s ease';
            heart.style.pointerEvents = 'none';
            
            this.style.position = 'relative';
            this.appendChild(heart);
            
            setTimeout(() => {
                heart.style.opacity = '1';
                heart.style.transform = 'scale(1)';
            }, 100);
            
            setTimeout(() => {
                heart.style.opacity = '0';
                heart.style.transform = 'scale(1.5)';
                setTimeout(() => {
                    heart.remove();
                }, 300);
            }, 1500);
        });
    });
    
    // Lazy loading for gallery images
    const galleryImages = document.querySelectorAll('.gallery-image img');
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
    
    galleryImages.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });
    
    // Initialize gallery
    filterGallery();
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (imageModal) {
        imageModal.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        imageModal.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                navigateImage(1);
            } else {
                // Swipe right - previous image
                navigateImage(-1);
            }
        }
    }
    
    // Add CSS for gallery enhancements
    const style = document.createElement('style');
    style.textContent = `
        .gallery-item {
            transition: all 0.3s ease;
        }
        
        .customer-photo {
            cursor: pointer;
        }
        
        .modal-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        
        @media (max-width: 768px) {
            .modal-navigation {
                padding: 0 10px;
            }
            
            .modal-prev,
            .modal-next {
                width: 40px;
                height: 40px;
                font-size: 1.2rem;
            }
            
            .modal-close {
                width: 35px;
                height: 35px;
                font-size: 1.5rem;
                top: 10px;
                right: 15px;
            }
        }
    `;
    document.head.appendChild(style);
});