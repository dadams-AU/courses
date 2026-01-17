// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if images exist in DOM
    const allImages = document.querySelectorAll('img');
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    // Debug CSS classes that might be hiding images
    const hiddenImages = document.querySelectorAll('img.image-placeholder');
    
    // Force show all images (temporary debug)
    lazyImages.forEach((img, index) => {
        // Force immediate loading without lazy loading
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
            img.style.opacity = '1';
            img.style.display = 'inline-block';
            img.style.visibility = 'visible';
            img.classList.remove('image-placeholder');
            img.classList.add('loaded');
        }
    });
    
    // Check for CSS that might be hiding images
    const styleSheets = document.styleSheets;
    
    // Simple force visibility test
    setTimeout(() => {
        lazyImages.forEach(img => {
        });
    }, 1000);
    
    // Theme handling (keeping the existing code)
    const themeToggleButtons = document.querySelectorAll('[data-bs-theme-value]');
    const themeButton = document.getElementById('bd-theme');
    
    // Check for saved theme preference or default to 'auto'
    const getStoredTheme = () => localStorage.getItem('themePreference') || 'auto';
    
    // Apply the theme
    const applyTheme = (theme) => {
        document.body.classList.remove('light-theme', 'dark-theme', 'auto-theme');

        if (theme === 'auto') {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.classList.add(prefersDark ? 'dark-theme' : 'light-theme');
            document.body.classList.add('auto-theme');
        } else {
            document.body.classList.add(`${theme}-theme`);
        }

        // Save theme preference
        localStorage.setItem('themePreference', theme);
    };

    const updateThemeState = (theme) => {
        const targetEl = document.querySelector(`[data-bs-theme-value="${theme}"]`);
        if (!targetEl) return;

        // Update active states
        themeToggleButtons.forEach(btn => {
            btn.setAttribute('aria-pressed', 'false');
            btn.classList.remove('active');
        });

        targetEl.setAttribute('aria-pressed', 'true');
        targetEl.classList.add('active');

        if (themeButton) {
            const themeIconUse = themeButton.querySelector('use');
            const themeText = document.getElementById('bd-theme-text');
            const iconMap = {
                light: '#sun-fill',
                dark: '#moon-stars-fill',
                auto: '#circle-half'
            };

            if (themeIconUse) {
                themeIconUse.setAttribute('href', iconMap[theme] || '#circle-half');
            }

            const label = `Toggle theme (${theme})`;
            themeButton.setAttribute('aria-label', label);
            if (themeText) {
                themeText.textContent = label;
            }
        }
    };
    
    // Apply the initial theme with a smooth transition
    document.body.style.transition = 'none';
    const storedTheme = getStoredTheme();
    applyTheme(storedTheme);
    updateThemeState(storedTheme);
    
    // Re-enable transitions after initial theme is applied
    setTimeout(() => {
        document.body.style.transition = '';
    }, 50);
    
    // Handle theme toggle clicks
    themeToggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-bs-theme-value');
            applyTheme(theme);
            updateThemeState(theme);
        });
    });
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (getStoredTheme() === 'auto') {
            applyTheme('auto');
        }
    });
    
    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
