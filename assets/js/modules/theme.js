/* ==========================================================================
   BLUEPRINT STUDIO — THEME SWITCHER MODULE
   ========================================================================== */

export function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem('theme-pref') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme-pref', newTheme);
    });
  }
}
