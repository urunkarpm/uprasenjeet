/* ==========================================================================
   BLUEPRINT STUDIO — UI/UX INTERACTIVE ANIMATIONS MODULE
   ========================================================================== */

function isTouchOrReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
         window.matchMedia('(max-width: 768px)').matches ||
         window.matchMedia('(pointer: coarse)').matches;
}

export function initMagneticButtons() {
  document.querySelectorAll('.btn, .contact-trigger, .theme-btn').forEach(el => {
    el.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
    let rect = null;
    let rafId = null;

    el.addEventListener('mouseenter', () => { rect = el.getBoundingClientRect(); }, { passive: true });

    el.addEventListener('mousemove', (e) => {
      if (isTouchOrReducedMotion()) return;
      if (!rect) rect = el.getBoundingClientRect();

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          if (!rect) return;
          const deltaX = (e.clientX - (rect.left + rect.width / 2)) * 0.25;
          const deltaY = (e.clientY - (rect.top + rect.height / 2)) * 0.25;
          el.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(1.03)`;
        });
      }
    }, { passive: true });

    el.addEventListener('mouseleave', () => {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      rect = null;
      el.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
    });
  });
}

export function initCardTiltAndSpotlight() {
  document.querySelectorAll('.project-card, .cert-card, .about-card, .case-study-card').forEach(card => {
    let rect = null;
    let rafId = null;

    card.addEventListener('mouseenter', () => { rect = card.getBoundingClientRect(); }, { passive: true });

    card.addEventListener('mousemove', (e) => {
      if (isTouchOrReducedMotion()) return;
      if (!rect) rect = card.getBoundingClientRect();

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          if (!rect) return;
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
          const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;

          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        });
      }
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      rect = null;
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

export function initCounterMetrics() {
  const counterElements = document.querySelectorAll('[data-counter]');
  if (counterElements.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const targetVal = parseFloat(el.getAttribute('data-counter'));
      const duration = parseInt(el.getAttribute('data-duration') || '1500', 10);
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        el.textContent = `${prefix}${Math.floor(progress * targetVal)}${suffix}`;
        if (progress < 1) window.requestAnimationFrame(step);
        else el.textContent = `${prefix}${targetVal}${suffix}`;
      };

      window.requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.3 });

  counterElements.forEach(el => observer.observe(el));
}

export function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length === 0) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });

  revealElements.forEach(el => revealObserver.observe(el));
}

export function initAnimations() {
  initScrollReveal();
  initMagneticButtons();
  initCardTiltAndSpotlight();
  initCounterMetrics();
}
