function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
const themeIcon = document.getElementById('theme-icon');
if (themeIcon) {
    themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}