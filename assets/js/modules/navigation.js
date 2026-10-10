/* ==========================================================================
   BLUEPRINT STUDIO — NAVIGATION & SCROLLSPY MODULE
   ========================================================================== */

export function initNavigation() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const siteHeader = document.querySelector('.site-header');

  // Active Pill Visualizer element
  let activePill = document.getElementById('nav-active-pill');
  if (mainNav && !activePill) {
    activePill = document.createElement('div');
    activePill.id = 'nav-active-pill';
    activePill.className = 'nav-active-pill';
    activePill.setAttribute('aria-hidden', 'true');
    mainNav.prepend(activePill);
  }

  function updatePillPosition(targetLink) {
    if (!activePill || !mainNav || !targetLink) return;
    const navRect = mainNav.getBoundingClientRect();
    const linkRect = targetLink.getBoundingClientRect();

    if (linkRect.width === 0) {
      activePill.style.opacity = '0';
      return;
    }

    const left = linkRect.left - navRect.left;
    const width = linkRect.width;

    activePill.style.transform = `translateX(${left}px)`;
    activePill.style.width = `${width}px`;
    activePill.style.opacity = '1';

    navLinks.forEach(link => {
      if (link === targetLink) {
        link.classList.add('pill-active');
      } else {
        link.classList.remove('pill-active');
      }
    });
  }

  function setActiveNav(sectionId) {
    if (!sectionId) return;
    let activeLink = null;
    navLinks.forEach(link => {
      const isTarget = link.getAttribute('data-section') === sectionId;
      link.classList.toggle('active', isTarget);
      if (isTarget) activeLink = link;
    });
    if (activeLink) {
      updatePillPosition(activeLink);
    }
  }

  // Hover magnetic effect for active pill
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      updatePillPosition(link);
    });
  });

  if (mainNav) {
    mainNav.addEventListener('mouseleave', () => {
      const currentActive = mainNav.querySelector('.nav-link.active');
      if (currentActive) {
        updatePillPosition(currentActive);
      }
    });
  }

  // Window resize re-calculation
  window.addEventListener('resize', () => {
    const currentActive = mainNav ? mainNav.querySelector('.nav-link.active') : null;
    if (currentActive) {
      updatePillPosition(currentActive);
    }
  }, { passive: true });

  // Handle header scroll shrink & elevated glass shadow
  let isScrolling = false;
  const handleScroll = () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        if (siteHeader) {
          if (scrollY > 20) {
            siteHeader.classList.add('is-scrolled');
          } else {
            siteHeader.classList.remove('is-scrolled');
          }
        }
        isScrolling = false;
      });
      isScrolling = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile Menu Toggle
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
      setTimeout(() => {
        const currentActive = mainNav.querySelector('.nav-link.active');
        if (currentActive) updatePillPosition(currentActive);
      }, 50);
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

  // Initial pill positioning after layout render
  setTimeout(() => {
    const currentActive = mainNav ? mainNav.querySelector('.nav-link.active') : null;
    if (currentActive) updatePillPosition(currentActive);
  }, 100);

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
