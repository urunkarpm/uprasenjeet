/* ==========================================================================
   BLUEPRINT STUDIO — INTERACTIVE BACKGROUND DOTS CANVAS MODULE
   ========================================================================== */

export function initDotsCanvas() {
  const canvas = document.getElementById('bg-dots-canvas');
  if (!canvas) return;

  document.body.style.backgroundImage = 'none';

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;

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

  let currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  let dots = [];

  const gridStep = 30;
  const hoverRadius = 120;
  const baseRadius = 1.25;

  function buildDots() {
    dots = [];
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    for (let x = 0; x <= width + gridStep; x += gridStep) {
      for (let y = 0; y <= height + gridStep; y += gridStep) {
        dots.push(createDot(x + 1.5,  y + 1.5,  0));
        dots.push(createDot(x + 16.5, y + 1.5,  1));
        dots.push(createDot(x + 1.5,  y + 16.5, 2));
        dots.push(createDot(x + 16.5, y + 16.5, 3));
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
      targetAlpha: 0.3
    };
  }

  let isLoopRunning = false;
  let resizeTimeout = null;

  function updateDots() {
    currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const palette = colorPalettes[currentTheme] || colorPalettes.dark;
    let needsAnimation = false;

    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      const baseColor = palette[dot.colorType];

      let dist = 9999;
      if (mouse.active) {
        dist = Math.hypot(dot.baseX - mouse.x, dot.baseY - mouse.y);
      }

      if (mouse.active && dist < hoverRadius) {
        const factor = 1 - dist / hoverRadius;
        const smoothFactor = factor * factor * (3 - 2 * factor);

        const angle = Math.atan2(dot.baseY - mouse.y, dot.baseX - mouse.x);
        const pushAmount = smoothFactor * 8;

        dot.targetX = dot.baseX + Math.cos(angle) * pushAmount;
        dot.targetY = dot.baseY + Math.sin(angle) * pushAmount;
        dot.targetRadius = baseRadius + smoothFactor * 1.2;
        dot.targetAlpha = Math.min(0.65, baseColor.baseAlpha + smoothFactor * 0.25);
      } else {
        dot.targetX = dot.baseX;
        dot.targetY = dot.baseY;
        dot.targetRadius = baseRadius;
        dot.targetAlpha = baseColor.baseAlpha;
      }

      const diffX = dot.targetX - dot.x;
      const diffY = dot.targetY - dot.y;
      const diffR = dot.targetRadius - dot.currentRadius;
      const diffA = dot.targetAlpha - dot.currentAlpha;

      if (Math.abs(diffX) > 0.01 || Math.abs(diffY) > 0.01 || Math.abs(diffR) > 0.001 || Math.abs(diffA) > 0.001) {
        dot.x += diffX * 0.16;
        dot.y += diffY * 0.16;
        dot.currentRadius += diffR * 0.16;
        dot.currentAlpha += diffA * 0.16;
        needsAnimation = true;
      } else {
        dot.x = dot.targetX;
        dot.y = dot.targetY;
        dot.currentRadius = dot.targetRadius;
        dot.currentAlpha = dot.targetAlpha;
      }
    }

    return needsAnimation || mouse.active;
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    const palette = colorPalettes[currentTheme] || colorPalettes.dark;

    // Batch static unmodified dots
    for (let cIndex = 0; cIndex < 4; cIndex++) {
      const c = palette[cIndex];
      ctx.beginPath();

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        if (dot.colorType === cIndex && Math.abs(dot.x - dot.baseX) <= 0.05 && Math.abs(dot.y - dot.baseY) <= 0.05) {
          ctx.moveTo(dot.x + dot.currentRadius, dot.y);
          ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2);
        }
      }

      ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.baseAlpha})`;
      ctx.fill();
    }

    // Render displaced/hovered dots individually
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      if (Math.abs(dot.x - dot.baseX) > 0.05 || Math.abs(dot.y - dot.baseY) > 0.05) {
        const c = palette[dot.colorType];
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${dot.currentAlpha})`;
        ctx.fill();
      }
    }
  }

  function startLoop() {
    if (!isLoopRunning) {
      isLoopRunning = true;
      loop();
    }
  }

  function loop() {
    const keepAnimating = updateDots();
    render();

    if (keepAnimating) {
      requestAnimationFrame(loop);
    } else {
      isLoopRunning = false;
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
    startLoop();
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.x = -1000;
    mouse.y = -1000;
    startLoop();
  });

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
      startLoop();
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
      startLoop();
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.active = false;
    mouse.x = -1000;
    mouse.y = -1000;
    startLoop();
  });

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      buildDots();
      startLoop();
    }, 150);
  });

  const observer = new MutationObserver(() => {
    currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    startLoop();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  buildDots();
  startLoop();
}
