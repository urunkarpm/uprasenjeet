/* ==========================================================================
   BLUEPRINT STUDIO — NATIVE SMOOTH SCROLL MODULE
   ========================================================================== */

export function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const targetEl = document.querySelector(href);
    if (!targetEl) return;

    e.preventDefault();
    targetEl.scrollIntoView({ behavior: 'smooth' });
  });
}

