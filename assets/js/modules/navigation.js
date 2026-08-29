/* ==========================================================================
   BLUEPRINT STUDIO — NAVIGATION & SCROLLSPY MODULE
   ========================================================================== */

export function initNavigation() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.getElementById('main-nav');

  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('mobile-open');
      mobileMenuToggle.classList.toggle('active');
    });

    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('mobile-open');
        mobileMenuToggle.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.site-header')) {
        mainNav.classList.remove('mobile-open');
        mobileMenuToggle.classList.remove('active');
      }
    });
  }

  // Scrollspy logic via IntersectionObserver
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  function setActiveNav(sectionId) {
    if (!sectionId) return;
    navLinks.forEach(link => {
      const isTarget = link.getAttribute('data-section') === sectionId;
      if (isTarget) {
        if (!link.classList.contains('active')) {
          link.classList.add('active');
          if (!link.querySelector('.nav-indicator')) {
            const dot = document.createElement('span');
            dot.className = 'nav-indicator';
            link.appendChild(dot);
          }
        }
      } else {
        link.classList.remove('active');
        const indicator = link.querySelector('.nav-indicator');
        if (indicator) indicator.remove();
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.getAttribute('id'));
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
  }
}
