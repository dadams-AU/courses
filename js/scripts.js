document.addEventListener('DOMContentLoaded', function() {
    const themeButtons = document.querySelectorAll('[data-bs-theme-value]');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');

    function updateThemeIcon(theme) {
        const themeToggle = document.getElementById('bd-theme');
        const icon = themeToggle.querySelector('.theme-icon-active');

        switch (theme) {
            case 'light':
                icon.innerHTML = '<use href="#sun-fill"></use>';
                break;
            case 'dark':
                icon.innerHTML = '<use href="#moon-stars-fill"></use>';
                break;
            default:
                icon.innerHTML = '<use href="#circle-half"></use>';
                break;
        }
    }

    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }

    themeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const selectedTheme = this.getAttribute('data-bs-theme-value');
            body.setAttribute('data-theme', selectedTheme);
            localStorage.setItem('theme', selectedTheme);
            updateThemeIcon(selectedTheme);
        });
    });
});
