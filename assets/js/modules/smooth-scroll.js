/* ==========================================================================
   BLUEPRINT STUDIO — ULTRA-SMOOTH MOMENTUM SCROLL ENGINE
   ========================================================================== */

export function initSmoothScroll() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Track target and current scroll position
  let currentY = window.scrollY || document.documentElement.scrollTop;
  let targetY = currentY;
  let maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  let isRunning = false;
  let isProgrammatic = false;
  const lerpFactor = 0.095; // Liquid inertia factor

  function updateMaxScroll() {
    maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  window.addEventListener('resize', updateMaxScroll, { passive: true });

  // Smooth RAF animation loop
  function loop() {
    if (!isRunning) return;

    updateMaxScroll();
    const diff = targetY - currentY;

    if (Math.abs(diff) > 0.3) {
      currentY += diff * lerpFactor;
      window.scrollTo(0, Math.round(currentY * 100) / 100);
      requestAnimationFrame(loop);
    } else {
      currentY = targetY;
      window.scrollTo(0, currentY);
      isRunning = false;
    }
  }

  function startLoop() {
    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(loop);
    }
  }

  // Intercept wheel events for momentum scrolling
  window.addEventListener('wheel', (e) => {
    // If target is inside a scrollable container (e.g. tool belt or code box), don't hijack unless it reached boundaries
    let node = e.target;
    let insideScrollable = false;
    while (node && node !== document.body && node !== document.documentElement) {
      if (node.scrollWidth > node.clientWidth && (node.classList.contains('tool-belt-banner') || getComputedStyle(node).overflowX === 'auto' || getComputedStyle(node).overflowX === 'scroll')) {
        insideScrollable = true;
        break;
      }
      node = node.parentNode;
    }

    if (insideScrollable) return;

    e.preventDefault();

    let delta = e.deltaY;
    if (e.deltaMode === 1) delta *= 32; // Line mode
    if (e.deltaMode === 2) delta *= window.innerHeight; // Page mode

    // Clamp scroll target within page boundaries
    updateMaxScroll();
    currentY = window.scrollY || document.documentElement.scrollTop;
    if (!isRunning && !isProgrammatic) {
      targetY = currentY;
    }

    targetY = Math.max(0, Math.min(maxScroll, targetY + delta));
    startLoop();
  }, { passive: false });

  // Sync scroll position when user drags scrollbar or uses touch natively
  window.addEventListener('scroll', () => {
    if (!isRunning && !isProgrammatic) {
      currentY = window.scrollY || document.documentElement.scrollTop;
      targetY = currentY;
    }
  }, { passive: true });

  // Intercept anchor link clicks for ultra-smooth easing jumps
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (href === '#' || !href) return;

    const targetEl = document.querySelector(href);
    if (!targetEl) return;

    e.preventDefault();
    updateMaxScroll();

    const rect = targetEl.getBoundingClientRect();
    const desiredTarget = Math.max(0, Math.min(maxScroll, (window.scrollY || document.documentElement.scrollTop) + rect.top - 20));

    targetY = desiredTarget;
    currentY = window.scrollY || document.documentElement.scrollTop;
    startLoop();
  });

  // Handle keyboard navigation smoothly
  window.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
      return;
    }

    const key = e.key;
    let step = 0;

    if (key === 'ArrowDown') step = 80;
    else if (key === 'ArrowUp') step = -80;
    else if (key === 'PageDown' || (key === ' ' && !e.shiftKey)) step = window.innerHeight * 0.85;
    else if (key === 'PageUp' || (key === ' ' && e.shiftKey)) step = -window.innerHeight * 0.85;
    else if (key === 'Home') {
      targetY = 0;
      startLoop();
      return;
    } else if (key === 'End') {
      updateMaxScroll();
      targetY = maxScroll;
      startLoop();
      return;
    }

    if (step !== 0) {
      updateMaxScroll();
      currentY = window.scrollY || document.documentElement.scrollTop;
      if (!isRunning) targetY = currentY;
      targetY = Math.max(0, Math.min(maxScroll, targetY + step));
      startLoop();
    }
  });
}
