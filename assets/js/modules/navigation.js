/* ==========================================================================
   BLUEPRINT STUDIO — NAVIGATION & SCROLLSPY MODULE
   ========================================================================== */

export function initNavigation() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

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

  if (mobileMenuToggle && mainNav) {
    const updateMenuState = (isOpen) => {
      if (isOpen) {
        mainNav.classList.add('mobile-open');
        mobileMenuToggle.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
      } else {
        mainNav.classList.remove('mobile-open');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    };

    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.contains('mobile-open');
      updateMenuState(!isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const sectionId = link.getAttribute('data-section');
        if (sectionId) {
          setActiveNav(sectionId);
        }
        updateMenuState(false);
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.site-header')) {
        updateMenuState(false);
      }
    });
  }

  // Tracked sections corresponding to navigation links
  const trackedSectionIds = Array.from(navLinks)
    .map(link => link.getAttribute('data-section'))
    .filter(Boolean);

  const sections = trackedSectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        // Sort by how much of the section is visible or closest to top
        visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        setActiveNav(visibleEntries[0].target.getAttribute('id'));
      }
    }, { rootMargin: '-15% 0px -40% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
  }
}
