/* ==========================================================================
   BLUEPRINT STUDIO — THEME SWITCHER MODULE
   ========================================================================== */

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme-pref', theme);
}

export function toggleTheme() {
  const currentTheme = document.documentElement.dataset.theme || document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    applyTheme(newTheme);
    return;
  }

  document.startViewTransition(() => {
    applyTheme(newTheme);
  });
}

export function initTheme() {
  const savedTheme = localStorage.getItem('theme-pref') || 'light';
  applyTheme(savedTheme);

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

