/* ==========================================================================
   BLUEPRINT STUDIO — NAVIGATION & SCROLLSPY MODULE
   ========================================================================== */

export function initNavigation() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Create dynamic sliding active pill indicator element
  let activePill = mainNav ? mainNav.querySelector('.nav-active-pill') : null;
  if (mainNav && !activePill) {
    activePill = document.createElement('div');
    activePill.className = 'nav-active-pill';
    activePill.setAttribute('aria-hidden', 'true');
    mainNav.appendChild(activePill);
  }

  function updateActivePill() {
    if (!mainNav || !activePill) return;
    const activeLink = mainNav.querySelector('.nav-link.active');
    if (activeLink && mainNav.offsetParent !== null && activeLink.offsetWidth > 0) {
      const left = activeLink.offsetLeft;
      const top = activeLink.offsetTop;
      const width = activeLink.offsetWidth;
      const height = activeLink.offsetHeight;

      activePill.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      activePill.style.width = `${width}px`;
      activePill.style.height = `${height}px`;
      activePill.classList.add('visible');
    } else {
      activePill.classList.remove('visible');
    }
  }

  function setActiveNav(sectionId) {
    if (!sectionId) return;
    navLinks.forEach(link => {
      const isTarget = link.getAttribute('data-section') === sectionId;
      link.classList.toggle('active', isTarget);
    });
    updateActivePill();
  }

  window.addEventListener('resize', () => updateActivePill(), { passive: true });
  requestAnimationFrame(() => updateActivePill());
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => updateActivePill());
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
      setTimeout(updateActivePill, 50);
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

  // Initialize Back to Top scroll behavior
  initBackToTop();
}

function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  const toggleVisibility = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Show when scrolled down past 300px or when nearing/reaching the bottom of the page
    const isBottomReached = (windowHeight + scrollY) >= (documentHeight - 600) || scrollY > 300;

    if (isBottomReached) {
      backToTopBtn.classList.add('visible');
      backToTopBtn.setAttribute('aria-hidden', 'false');
    } else {
      backToTopBtn.classList.remove('visible');
      backToTopBtn.setAttribute('aria-hidden', 'true');
    }
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        toggleVisibility();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Initial visibility check
  toggleVisibility();
}
