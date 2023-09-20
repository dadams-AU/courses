$(document).ready(function() {
    // Check for saved theme preference or default to 'auto'
    let themePreference = localStorage.getItem('themePreference') || 'auto';
    setTheme(themePreference);

    // Update the dropdown to reflect the saved theme preference
    updateDropdown(themePreference);

    // Event listener for theme change
    $('[data-bs-theme-value]').on('click', function() {
        let selectedTheme = $(this).attr('data-bs-theme-value');
        setTheme(selectedTheme);
        updateDropdown(selectedTheme);
    });

    function setTheme(theme) {
        // Remove all possible theme classes first
        $('body').removeClass('light-theme dark-theme');

        switch (theme) {
            case 'light':
                $('body').addClass('light-theme');
                break;
            case 'dark':
                $('body').addClass('dark-theme');
                break;
            default:
                // Auto theme based on user's system preference
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    $('body').addClass('dark-theme');
                } else {
                    $('body').addClass('light-theme');
                }
                break;
        }
        // Save the theme preference
        localStorage.setItem('themePreference', theme);
    }

    function updateDropdown(theme) {
        // Get the SVG of the selected theme
        const selectedSvg = $(`[data-bs-theme-value=${theme}] svg`).clone();
    
        // Clear the current SVG inside the main button and append the new one
        $('#bd-theme svg').remove();
        $('#bd-theme').prepend(selectedSvg);
    }
    
});
