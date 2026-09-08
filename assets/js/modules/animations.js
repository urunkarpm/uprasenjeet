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

  counterElements.forEach(el => {
    const targetVal = parseFloat(el.getAttribute('data-counter'));
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    el.textContent = `${prefix}${targetVal}${suffix}`;
  });
}

export function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length === 0) return;
  revealElements.forEach(el => el.classList.add('is-revealed'));
}

export function initAnimations() {
  initScrollReveal();
  initMagneticButtons();
  initCardTiltAndSpotlight();
  initCounterMetrics();
}
