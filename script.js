// ===== MATAMA MAZE WEBSITE JAVASCRIPT =====

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // ===== MOBILE NAVIGATION =====
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileToggle.querySelector('i').classList.remove('fa-times');
                mobileToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    });
    
    // ===== HEADER SCROLL EFFECT =====
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // ===== HERO VIDEO CONTROLS =====
    const heroVideo = document.getElementById('maze-hero-video');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const muteUnmuteBtn = document.getElementById('mute-unmute-btn');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    
    if (heroVideo) {
        // Format time as MM:SS
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
        
        // Update play/pause button
        function updatePlayPauseButton() {
            if (!playPauseBtn) return;
            
            if (heroVideo.paused) {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                playPauseBtn.classList.remove('active');
            } else {
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playPauseBtn.classList.add('active');
            }
        }
        
        // Update mute/unmute button
        function updateMuteButton() {
            if (!muteUnmuteBtn) return;
            
            if (heroVideo.muted) {
                muteUnmuteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                muteUnmuteBtn.classList.remove('active');
            } else {
                muteUnmuteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                muteUnmuteBtn.classList.add('active');
            }
        }
        
        // Set up event listeners
        heroVideo.addEventListener('loadedmetadata', function() {
            if (durationEl) {
                durationEl.textContent = formatTime(heroVideo.duration);
            }
        });
        
        heroVideo.addEventListener('timeupdate', function() {
            if (currentTimeEl) {
                currentTimeEl.textContent = formatTime(heroVideo.currentTime);
            }
        });
        
        // Play/Pause button
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', function() {
                if (heroVideo.paused) {
                    heroVideo.play();
                } else {
                    heroVideo.pause();
                }
                updatePlayPauseButton();
            });
        }
        
        // Mute/Unmute button
        if (muteUnmuteBtn) {
            muteUnmuteBtn.addEventListener('click', function() {
                heroVideo.muted = !heroVideo.muted;
                updateMuteButton();
                
                // Show notification when unmuting
                if (!heroVideo.muted) {
                    showNotification("Sound is now on. Enjoy the immersive experience!");
                }
            });
        }
        
        // Video error handling
        heroVideo.addEventListener('error', function() {
            console.error('Hero video failed to load');
            
            // If video fails to load, show background image instead
            const videoContainer = this.parentElement;
            const fallbackImg = this.querySelector('img');
            
            if (fallbackImg && videoContainer) {
                this.style.display = 'none';
                fallbackImg.style.display = 'block';
                
                // Hide video controls
                const videoControls = videoContainer.querySelector('.video-controls');
                if (videoControls) {
                    videoControls.style.display = 'none';
                }
            }
        });
        
        // Initialize buttons
        updatePlayPauseButton();
        updateMuteButton();
    }
    
    // ===== EVENT CARD HOVER ANIMATIONS =====
    const eventCards = document.querySelectorAll('.event-slide');
    eventCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                this.style.transform = 'translateY(-10px)';
                this.style.boxShadow = '0 20px 40px rgba(46, 125, 50, 0.2)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 10px 30px rgba(46, 125, 50, 0.1)';
            }
        });
    });
    
    // ===== EVENT SLIDER FUNCTIONALITY =====
    class EventSlider {
        constructor(container) {
            this.container = container;
            this.slider = container.querySelector('.events-slider');
            this.prevBtn = container.querySelector('.prev-btn');
            this.nextBtn = container.querySelector('.next-btn');
            this.dotsContainer = container.parentElement.querySelector('.slider-dots');
            this.slides = Array.from(this.slider.querySelectorAll('.event-slide'));
            this.currentIndex = 0;
            
            // Check if mobile or desktop
            this.isMobile = window.innerWidth <= 768;
            
            // Calculate visible slides based on screen size
            this.visibleSlides = this.isMobile ? 1 : (window.innerWidth <= 1200 ? 2 : 3);
            
            // Initialize
            this.init();
        }
        
        init() {
            // Create dots
            this.createDots();
            
            // Set initial state
            this.updateSlider();
            
            // Add event listeners
            this.prevBtn.addEventListener('click', () => this.prev());
            this.nextBtn.addEventListener('click', () => this.next());
            
            // Add touch events for mobile
            if (this.isMobile) {
                this.addTouchEvents();
            }
            
            // Handle window resize
            window.addEventListener('resize', () => this.handleResize());
        }
        
        createDots() {
            // Clear existing dots
            this.dotsContainer.innerHTML = '';
            
            // Calculate number of dots based on slides and visible slides
            const dotCount = Math.max(1, this.slides.length - this.visibleSlides + 1);
            
            // Create dots
            for (let i = 0; i < dotCount; i++) {
                const dot = document.createElement('span');
                dot.className = 'dot';
                dot.setAttribute('data-index', i);
                if (i === 0) dot.classList.add('active');
                
                dot.addEventListener('click', () => {
                    this.goToSlide(i);
                });
                
                this.dotsContainer.appendChild(dot);
            }
        }
        
        updateSlider() {
            // Calculate slide width
            const slideWidth = this.slides[0].offsetWidth + 
                (this.isMobile ? 10 : 30); // Gap size
            
            // Calculate scroll position
            const scrollPosition = this.currentIndex * slideWidth;
            
            // Smooth scroll to position
            this.slider.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            
            // Update button states
            this.updateButtons();
            
            // Update dots
            this.updateDots();
        }
        
        updateButtons() {
            // Disable prev button if at start
            if (this.currentIndex === 0) {
                this.prevBtn.disabled = true;
                this.prevBtn.style.opacity = '0.3';
                this.prevBtn.style.cursor = 'not-allowed';
            } else {
                this.prevBtn.disabled = false;
                this.prevBtn.style.opacity = '1';
                this.prevBtn.style.cursor = 'pointer';
            }
            
            // Disable next button if at end
            const maxIndex = Math.max(0, this.slides.length - this.visibleSlides);
            if (this.currentIndex >= maxIndex) {
                this.nextBtn.disabled = true;
                this.nextBtn.style.opacity = '0.3';
                this.nextBtn.style.cursor = 'not-allowed';
            } else {
                this.nextBtn.disabled = false;
                this.nextBtn.style.opacity = '1';
                this.nextBtn.style.cursor = 'pointer';
            }
        }
        
        updateDots() {
            const dots = this.dotsContainer.querySelectorAll('.dot');
            const dotIndex = Math.min(this.currentIndex, dots.length - 1);
            
            dots.forEach((dot, index) => {
                if (index === dotIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        prev() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.updateSlider();
            }
        }
        
        next() {
            const maxIndex = Math.max(0, this.slides.length - this.visibleSlides);
            if (this.currentIndex < maxIndex) {
                this.currentIndex++;
                this.updateSlider();
            }
        }
        
        goToSlide(index) {
            this.currentIndex = Math.min(index, this.slides.length - this.visibleSlides);
            this.updateSlider();
        }
        
        addTouchEvents() {
            let startX = 0;
            let endX = 0;
            let isDragging = false;
            
            this.slider.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            }, { passive: true });
            
            this.slider.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                endX = e.touches[0].clientX;
            }, { passive: true });
            
            this.slider.addEventListener('touchend', () => {
                if (!isDragging) return;
                
                const diffX = startX - endX;
                const threshold = 50;
                
                if (Math.abs(diffX) > threshold) {
                    if (diffX > 0) {
                        // Swiped left - next slide
                        this.next();
                    } else {
                        // Swiped right - previous slide
                        this.prev();
                    }
                }
                
                isDragging = false;
            });
            
            // Mouse drag support for testing
            let mouseDown = false;
            let mouseStartX = 0;
            let mouseEndX = 0;
            
            this.slider.addEventListener('mousedown', (e) => {
                if (!this.isMobile) return;
                mouseDown = true;
                mouseStartX = e.clientX;
                e.preventDefault();
            });
            
            this.slider.addEventListener('mousemove', (e) => {
                if (!mouseDown || !this.isMobile) return;
                mouseEndX = e.clientX;
            });
            
            this.slider.addEventListener('mouseup', () => {
                if (!mouseDown || !this.isMobile) return;
                
                const diffX = mouseStartX - mouseEndX;
                const threshold = 50;
                
                if (Math.abs(diffX) > threshold) {
                    if (diffX > 0) {
                        this.next();
                    } else {
                        this.prev();
                    }
                }
                
                mouseDown = false;
            });
            
            this.slider.addEventListener('mouseleave', () => {
                mouseDown = false;
            });
        }
        
        handleResize() {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            
            // Recalculate visible slides
            this.visibleSlides = this.isMobile ? 1 : (window.innerWidth <= 1200 ? 2 : 3);
            
            // If switching between mobile/desktop, recreate dots
            if (wasMobile !== this.isMobile) {
                this.createDots();
                
                // Update touch events
                if (this.isMobile) {
                    this.addTouchEvents();
                }
            }
            
            // Reset to first slide on resize
            this.currentIndex = 0;
            this.updateSlider();
        }
    }
    
    // Initialize all sliders on the page
    const sliderContainers = document.querySelectorAll('.events-slider-container');
    const sliders = [];
    
    sliderContainers.forEach(container => {
        sliders.push(new EventSlider(container));
    });
    
    // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') {
                return;
            }
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Calculate the position to scroll to
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== EVENT DETAILS BUTTONS =====
    document.querySelectorAll('.btn-event-details').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const eventTitle = this.closest('.event-slide').querySelector('h3').textContent;
            const eventDate = this.closest('.event-slide').querySelector('.event-date span').textContent;
            
            alert(`Event Details:\n\n${eventTitle}\nDate: ${eventDate}\n\nDetails page coming soon!`);
        });
    });
    
    // ===== NOTIFICATION FUNCTION =====
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'var(--primary-green)';
        notification.style.color = 'white';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        notification.style.zIndex = '3000';
        notification.style.maxWidth = '300px';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'opacity 0.3s, transform 0.3s';
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // ===== INITIAL ANIMATIONS =====
    setTimeout(() => {
        eventCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s, transform 0.5s';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);
});














// Vertical Badge Animation
document.addEventListener('DOMContentLoaded', function() {
    const verticalBadge = document.querySelector('.vertical-badge');
    
    if (verticalBadge) {
        // Add click animation
        verticalBadge.addEventListener('click', function(e) {
            // Add a more noticeable click animation
            this.style.transform = 'translateY(-50%) scale(0.9)';
            this.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
            
            setTimeout(() => {
                this.style.transform = 'translateY(-50%)';
                this.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.25)';
            }, 200);
        });
        
        // Add scroll effect with parallax
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            const scrollDelta = scrollPosition - lastScrollY;
            
            // Slight parallax effect
            if (Math.abs(scrollDelta) > 1) {
                verticalBadge.style.transform = `translateY(calc(-50% + ${scrollDelta * 0.1}px))`;
            }
            
            // Fade effect when scrolling
            if (scrollPosition > 300) {
                verticalBadge.style.opacity = '0.9';
            } else {
                verticalBadge.style.opacity = '1';
            }
            
            lastScrollY = scrollPosition;
            
            // Reset position after scrolling stops
            clearTimeout(window.scrollEndTimer);
            window.scrollEndTimer = setTimeout(() => {
                verticalBadge.style.transform = 'translateY(-50%)';
            }, 100);
        });
        
        // Add a welcoming pulse animation on page load
        setTimeout(() => {
            verticalBadge.style.transform = 'translateY(-50%) scale(1.08)';
            verticalBadge.style.boxShadow = '0 10px 40px rgba(46, 125, 50, 0.4)';
            
            setTimeout(() => {
                verticalBadge.style.transform = 'translateY(-50%)';
                verticalBadge.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.25)';
            }, 600);
        }, 1500);
        
        // Add a subtle breathing animation
        function badgeBreath() {
            if (!verticalBadge.matches(':hover')) {
                verticalBadge.style.transform = 'translateY(calc(-50% + 1px))';
                setTimeout(() => {
                    if (!verticalBadge.matches(':hover')) {
                        verticalBadge.style.transform = 'translateY(calc(-50% - 1px))';
                    }
                }, 2000);
            }
        }
        
        // Start breathing animation after initial animations
        setTimeout(() => {
            setInterval(badgeBreath, 4000);
        }, 3000);
    }
});












