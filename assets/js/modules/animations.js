/* ==========================================================================
   BLUEPRINT STUDIO — UI/UX INTERACTIVE ANIMATIONS MODULE
   ========================================================================== */

/**
 * Magnetic button interaction
 * Pulls elements slightly toward cursor when hovered
 */
export function initMagneticButtons() {
  const magneticElements = document.querySelectorAll('.btn, .contact-trigger, .theme-btn');

  magneticElements.forEach(el => {
    el.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
    let rect = null;
    let rafId = null;

    el.addEventListener('mouseenter', () => { rect = el.getBoundingClientRect(); }, { passive: true });

    el.addEventListener('mousemove', (e) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(pointer: coarse)').matches) return;

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const deltaX = (e.clientX - centerX) * 0.25;
          const deltaY = (e.clientY - centerY) * 0.25;

          el.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(1.03)`;
        });
      }
    }, { passive: true });

    el.addEventListener('mouseleave', () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      rect = null;
      el.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
    });
  });
}

/**
 * 3D Perspective Card Tilt & Radial Cursor Spotlight (No Text Glow)
 */
export function initCardTiltAndSpotlight() {
  const cards = document.querySelectorAll('.project-card, .cert-card, .about-card, .case-study-card');

  cards.forEach(card => {
    let rect = null;
    let rafId = null;

    card.addEventListener('mouseenter', () => { rect = card.getBoundingClientRect(); }, { passive: true });

    card.addEventListener('mousemove', (e) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(pointer: coarse)').matches) return;

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -5; // max 5deg tilt
          const rotateY = ((x - centerX) / centerX) * 5;

          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        });
      }
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      rect = null;
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/**
 * Scroll-triggered metric numbers counter
 */
export function initCounterMetrics() {
  const counterElements = document.querySelectorAll('[data-counter]');
  if (counterElements.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseFloat(el.getAttribute('data-counter'));
        const duration = parseInt(el.getAttribute('data-duration') || '1500', 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        
        let startTimestamp = null;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const currentVal = Math.floor(progress * targetVal);
          
          el.textContent = `${prefix}${currentVal}${suffix}`;
          
          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            el.textContent = `${prefix}${targetVal}${suffix}`;
          }
        };

        window.requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counterElements.forEach(el => observer.observe(el));
}

/**
 * IntersectionObserver powered butter-smooth scroll reveal animations
 */
export function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    // Immediately reveal elements already near/in view on initial render
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 40) {
      el.classList.add('is-revealed');
    } else {
      revealObserver.observe(el);
    }
  });
}

/**
 * Master initializer for all UI/UX animations
 */
export function initAnimations() {
  initScrollReveal();
  initMagneticButtons();
  initCardTiltAndSpotlight();
  initCounterMetrics();
}

