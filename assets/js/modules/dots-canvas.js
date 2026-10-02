/* ==========================================================================
   BLUEPRINT STUDIO — INTERACTIVE BACKGROUND DOTS CANVAS MODULE (60-120FPS OPTIMIZED)
   ========================================================================== */

export function initDotsCanvas() {
  const canvas = document.getElementById('bg-dots-canvas');
  if (!canvas) return;

  document.body.style.backgroundImage = 'none';
  document.body.classList.add('canvas-dots-active');

  canvas.style.willChange = 'transform';
  canvas.style.transform = 'translateZ(0)';

  const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true }) || canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;
  let lastWidth = 0;
  let lastHeight = 0;

  const mouse = { x: -1000, y: -1000, active: false };

  const colorPalettes = {
    dark: [
      { r: 229, g: 167, b: 55,  baseAlpha: 0.35 },
      { r: 192, g: 132, b: 252, baseAlpha: 0.30 },
      { r: 96,  g: 165, b: 250, baseAlpha: 0.30 },
      { r: 74,  g: 222, b: 128, baseAlpha: 0.35 }
    ],
    light: [
      { r: 212, g: 148, b: 40,  baseAlpha: 0.30 },
      { r: 168, g: 85,  b: 247, baseAlpha: 0.25 },
      { r: 37,  g: 99,  b: 235, baseAlpha: 0.25 },
      { r: 22,  g: 163, b: 74,  baseAlpha: 0.30 }
    ]
  };

  let currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  let dots = [];

  const hoverRadius = 135;
  const hoverRadiusSq = hoverRadius * hoverRadius;
  const baseRadius = 1.25;

  function isMobileDevice() {
    return width <= 768 || window.matchMedia('(pointer: coarse)').matches;
  }

  function isMidRangeDevice() {
    const cores = navigator.hardwareConcurrency || 4;
    const isMobileOrTablet = width <= 1024 || window.matchMedia('(pointer: coarse)').matches;
    return cores <= 4 || isMobileOrTablet;
  }

  function buildDots() {
    dots = [];
    width = window.innerWidth || document.documentElement.clientWidth;
    height = window.innerHeight || document.documentElement.clientHeight;

    const isMobile = isMobileDevice();
    const midRange = isMidRangeDevice();
    const maxDprCap = isMobile ? 1.0 : (midRange ? 1.25 : 1.75);
    dpr = Math.min(window.devicePixelRatio || 1, maxDprCap);

    const stepDesktop = midRange ? 36 : 30;
    const stepMobile = 64; // Low dot count spacing for 60FPS mobile performance
    const step = isMobile ? stepMobile : stepDesktop;
    const halfStep = step / 2;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    for (let x = 0; x <= width + step; x += step) {
      for (let y = 0; y <= height + step; y += step) {
        dots.push(createDot(x + 1.5,            y + 1.5,            0));
        dots.push(createDot(x + halfStep + 1.5, y + 1.5,            1));
        dots.push(createDot(x + 1.5,            y + halfStep + 1.5, 2));
        dots.push(createDot(x + halfStep + 1.5, y + halfStep + 1.5, 3));
      }
    }
  }

  function createDot(x, y, colorType) {
    return {
      baseX: x,
      baseY: y,
      x: x,
      y: y,
      targetX: x,
      targetY: y,
      colorType: colorType,
      currentRadius: baseRadius,
      targetRadius: baseRadius,
      currentAlpha: 0.3,
      targetAlpha: 0.3,
      isDisplaced: false
    };
  }



  let isLoopRunning = false;
  let resizeTimeout = null;

  function updateDots() {
    const palette = colorPalettes[currentTheme] || colorPalettes.dark;
    let needsAnimation = false;

    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      const baseColor = palette[dot.colorType];

      let hoverPushX = 0;
      let hoverPushY = 0;
      let hoverRadiusAdd = 0;
      let hoverAlphaAdd = 0;

      if (mouse.active) {
        const dx = dot.baseX - mouse.x;
        const dy = dot.baseY - mouse.y;
        if (Math.abs(dx) < hoverRadius && Math.abs(dy) < hoverRadius) {
          const distSq = dx * dx + dy * dy;
          if (distSq < hoverRadiusSq && distSq > 0.001) {
            const dist = Math.sqrt(distSq);
            const factor = 1 - dist / hoverRadius;
            const smoothFactor = factor * factor * (3 - 2 * factor);
            const invDist = 1 / dist;
            const pushAmount = smoothFactor * 10;

            hoverPushX = dx * invDist * pushAmount;
            hoverPushY = dy * invDist * pushAmount;
            hoverRadiusAdd = smoothFactor * 1.3;
            hoverAlphaAdd = smoothFactor * 0.28;
          }
        }
      }

      dot.targetX = dot.baseX + hoverPushX;
      dot.targetY = dot.baseY + hoverPushY;
      dot.targetRadius = baseRadius + hoverRadiusAdd;
      dot.targetAlpha = Math.min(0.68, baseColor.baseAlpha + hoverAlphaAdd);

      const diffX = dot.targetX - dot.x;
      const diffY = dot.targetY - dot.y;
      const diffR = dot.targetRadius - dot.currentRadius;
      const diffA = dot.targetAlpha - dot.currentAlpha;

      if (Math.abs(diffX) > 0.01 || Math.abs(diffY) > 0.01 || Math.abs(diffR) > 0.001 || Math.abs(diffA) > 0.001) {
        dot.x += diffX * 0.15;
        dot.y += diffY * 0.15;
        dot.currentRadius += diffR * 0.15;
        dot.currentAlpha += diffA * 0.15;
        dot.isDisplaced = true;
        needsAnimation = true;
      } else {
        dot.x = dot.targetX;
        dot.y = dot.targetY;
        dot.currentRadius = dot.targetRadius;
        dot.currentAlpha = dot.targetAlpha;
        dot.isDisplaced = (Math.abs(dot.x - dot.baseX) > 0.05 || Math.abs(dot.y - dot.baseY) > 0.05);
      }
    }

    return needsAnimation;
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    const palette = colorPalettes[currentTheme] || colorPalettes.dark;

    const staticPaths = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
    const displacedDots = [];

    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      if (!dot.isDisplaced) {
        const p = staticPaths[dot.colorType];
        p.moveTo(dot.x + baseRadius, dot.y);
        p.arc(dot.x, dot.y, baseRadius, 0, Math.PI * 2);
      } else {
        displacedDots.push(dot);
      }
    }

    for (let cIndex = 0; cIndex < 4; cIndex++) {
      const c = palette[cIndex];
      ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.baseAlpha})`;
      ctx.fill(staticPaths[cIndex]);
    }

    for (let i = 0; i < displacedDots.length; i++) {
      const dot = displacedDots[i];
      const c = palette[dot.colorType];
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${dot.currentAlpha})`;
      ctx.fill();
    }
  }

  function isStageActive() {
    return !document.body.dataset.qaStage || document.body.dataset.qaStage === '5';
  }

  function startLoop() {
    if (document.hidden || !isStageActive()) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      render();
      return;
    }
    if (!isLoopRunning) {
      isLoopRunning = true;
      loop();
    }
  }

  function loop() {
    if (document.hidden || !isStageActive()) {
      isLoopRunning = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      isLoopRunning = false;
      render();
      return;
    }
    const keepAnimating = updateDots();
    render();

    if (keepAnimating) {
      requestAnimationFrame(loop);
    } else {
      isLoopRunning = false;
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && isStageActive()) {
      startLoop();
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!isStageActive()) return;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
    startLoop();
  });

  window.addEventListener('mouseleave', () => {
    if (!isStageActive()) return;
    mouse.active = false;
    mouse.x = -1000;
    mouse.y = -1000;
    startLoop();
  });



  window.addEventListener('resize', () => {
    const currentWidth = window.innerWidth || document.documentElement.clientWidth;
    const currentHeight = window.innerHeight || document.documentElement.clientHeight;
    const isMobile = isMobileDevice();
    const heightThreshold = isMobile ? 180 : 120;

    if (currentWidth !== lastWidth || Math.abs(currentHeight - lastHeight) > heightThreshold) {
      lastWidth = currentWidth;
      lastHeight = currentHeight;
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        buildDots();
        startLoop();
      }, 150);
    }
  });

  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      lastWidth = window.innerWidth || document.documentElement.clientWidth;
      lastHeight = window.innerHeight || document.documentElement.clientHeight;
      buildDots();
      startLoop();
    }, 200);
  });

  const observer = new MutationObserver(() => {
    currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    startLoop();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  requestAnimationFrame(() => {
    lastWidth = window.innerWidth || document.documentElement.clientWidth;
    lastHeight = window.innerHeight || document.documentElement.clientHeight;
    buildDots();
    startLoop();
  });
}

