/* ==========================================================================
   BLUEPRINT STUDIO — UI/UX INTERACTIVE ANIMATIONS MODULE
   ========================================================================== */

function isTouchOrReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
         window.matchMedia('(max-width: 768px)').matches ||
         window.matchMedia('(pointer: coarse)').matches;
}

export function initMagneticButtons() {
  // Disabled: Unwanted magnetic displacement and mousemove churn removed for smooth, predictable interactions
}

export function initCardTiltAndSpotlight() {
  // Disabled: CPU-heavy 3D perspective tilt and radial gradient repaints removed in favor of hardware-accelerated CSS hover states
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
  revealElements.forEach(el => el.classList.add('is-revealed'));
}

export function initTextScramble() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%-+';
  document.querySelectorAll('[data-scramble]').forEach(el => {
    const originalText = el.textContent;
    let iteration = 0;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const interval = setInterval(() => {
          el.textContent = originalText
            .split('')
            .map((char, index) => {
              if (index < iteration) return originalText[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

          if (iteration >= originalText.length) {
            clearInterval(interval);
          }
          iteration += 1 / 3;
        }, 30);

        obs.unobserve(el);
      });
    }, { threshold: 0.5 });

    observer.observe(el);
  });
}

export function initAnimations() {
  initScrollReveal();
  initMagneticButtons();
  initCardTiltAndSpotlight();
  initCounterMetrics();
  initTextScramble();
}

