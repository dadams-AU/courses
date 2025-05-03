   // Theme toggling - Using dadams.io approach
    const themeToggleButtons = document.querySelectorAll('[data-bs-theme-value]');
    const themeButton = document.getElementById('bd-theme');
    
    // Check for saved theme preference or default to 'auto'
    const getStoredTheme = () => localStorage.getItem('themePreference') || 'auto';
    
    // Apply the theme
    const applyTheme = (theme) => {
      document.body.className = ''; // Clear all theme classes
      
      if (theme === 'auto') {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.add(prefersDark ? 'dark-theme' : 'light-theme');
        document.body.classList.add('auto-theme');
        document.documentElement.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light');
      } else {
        document.body.classList.add(`${theme}-theme`);
        document.documentElement.setAttribute('data-bs-theme', theme);
      }
      
      // Save theme preference
      localStorage.setItem('themePreference', theme);
    };
    
// Update theme button icon and active states
const updateThemeIcon = (theme) => {
    const targetEl = document.querySelector(`[data-bs-theme-value="${theme}"]`);
    if (!targetEl) return;
    
    const svgContent = targetEl.querySelector('svg.theme-icon').outerHTML;
    
    // Update button icon
    const themeIcon = themeButton?.querySelector('svg');
    if (themeIcon) {
      themeIcon.outerHTML = svgContent;
    } else if (themeButton) {
      themeButton.insertAdjacentHTML('afterbegin', svgContent);
    }
    
    // Update active states
    themeToggleButtons.forEach(btn => {
      btn.setAttribute('aria-pressed', 'false');
      btn.classList.remove('active');
      // Hide checkmark
      const checkmark = btn.querySelector('svg.bi.ms-auto');
      if (checkmark) {
        checkmark.classList.add('d-none');
      }
    });
    
    targetEl.setAttribute('aria-pressed', 'true');
    targetEl.classList.add('active');
    
    // Show checkmark on active item
    const checkmark = targetEl.querySelector('svg.bi.ms-auto');
    if (checkmark) {
      checkmark.classList.remove('d-none');
    }
  };
    
    // Apply the initial theme with a smooth transition
    document.body.style.transition = 'none';
    const storedTheme = getStoredTheme();
    applyTheme(storedTheme);
    updateThemeIcon(storedTheme);
    
    // Re-enable transitions after initial theme is applied
    setTimeout(() => {
      document.body.style.transition = '';
    }, 50);
    
    // Handle theme toggle clicks
    themeToggleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-bs-theme-value');
        applyTheme(theme);
        updateThemeIcon(theme);
      });
    });
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (getStoredTheme() === 'auto') {
        applyTheme('auto');
      }
    });
    
    // Lazy image loading
    document.addEventListener('DOMContentLoaded', function() {
      const lazyImages = document.querySelectorAll('img[data-src]');
      
      lazyImages.forEach((img) => {
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.classList.remove('image-placeholder');
          img.classList.add('loaded');
        }
      });
    });
    
    // Toggle individual weeks
    const toggleButtons = document.querySelectorAll('.toggle-week-btn');
    toggleButtons.forEach(button => {
      button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const targetContent = document.getElementById(targetId);
        
        if (targetContent.classList.contains('collapsed')) {
          targetContent.classList.remove('collapsed');
          this.innerHTML = '<i class="fas fa-chevron-up"></i>';
        } else {
          targetContent.classList.add('collapsed');
          this.innerHTML = '<i class="fas fa-chevron-down"></i>';
        }
      });
    });
    
    // Toggle all weeks
    const toggleAllBtn = document.getElementById('toggleAllWeeks');
    let allExpanded = false;
    
    toggleAllBtn.addEventListener('click', function() {
      const weekContents = document.querySelectorAll('.week-content');
      
      if (allExpanded) {
        // Collapse all weeks
        weekContents.forEach(content => {
          content.classList.add('collapsed');
        });
        
        // Update all toggle buttons
        toggleButtons.forEach(button => {
          button.innerHTML = '<i class="fas fa-chevron-down"></i>';
        });
        
        // Update the toggle all button text
        toggleAllBtn.textContent = 'Expand All Weeks';
        allExpanded = false;
      } else {
        // Expand all weeks
        weekContents.forEach(content => {
          content.classList.remove('collapsed');
        });
        
        // Update all toggle buttons
        toggleButtons.forEach(button => {
          button.innerHTML = '<i class="fas fa-chevron-up"></i>';
        });
        
        // Update the toggle all button text
        toggleAllBtn.textContent = 'Collapse All Weeks';
        allExpanded = true;
      }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // Expand the week content if it's collapsed
          const weekId = targetId.replace('#', '') + '-content';
          const weekContent = document.getElementById(weekId);
          
          if (weekContent && weekContent.classList.contains('collapsed')) {
            weekContent.classList.remove('collapsed');
            const button = document.querySelector(`[data-target="${weekId}"]`);
            if (button) {
              button.innerHTML = '<i class="fas fa-chevron-up"></i>';
            }
          }
          
          // Scroll to the target with offset for fixed header
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
          
          // Update active state in sidebar
          document.querySelectorAll('.list-group-item').forEach(item => {
            item.classList.remove('active');
          });
          
          anchor.classList.add('active');
        }
      });
    });
    
    // Animation on scroll
    function animateOnScroll() {
      const animatedElements = document.querySelectorAll('.animate-slide-in');
      
      animatedElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        if (rect.top <= windowHeight * 0.85 && rect.bottom >= 0) {
          el.style.opacity = '1';
          el.style.transform = 'translateX(0)';
        }
      });
    }
    
    // Set initial state for animated elements
    document.querySelectorAll('.animate-slide-in').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(-20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
    
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
