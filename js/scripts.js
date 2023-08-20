document.addEventListener('DOMContentLoaded', function() {
    const themeButtons = document.querySelectorAll('[data-bs-theme-value]');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // If the user's OS setting is 'dark', use the dark theme
        body.setAttribute('data-theme', 'dark');
    }

    themeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const selectedTheme = this.getAttribute('data-bs-theme-value');
            body.setAttribute('data-theme', selectedTheme);
            localStorage.setItem('theme', selectedTheme);
        });
    });
});
