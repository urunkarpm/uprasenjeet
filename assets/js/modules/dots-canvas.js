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
  let waves = [];

  const baseRadius = 1.25;

  function isMidRangeDevice() {
    const cores = navigator.hardwareConcurrency || 4;
    const isMobileOrTablet = width <= 1024 || window.matchMedia('(pointer: coarse)').matches;
    return cores <= 4 || isMobileOrTablet;
  }

  function buildDots() {
    dots = [];
    waves = [];
    width = window.innerWidth || document.documentElement.clientWidth;
    height = window.innerHeight || document.documentElement.clientHeight;

    const midRange = isMidRangeDevice();
    const maxDprCap = midRange ? 1.25 : 1.75;
    dpr = Math.min(window.devicePixelRatio || 1, maxDprCap);

    const stepDesktop = midRange ? 36 : 30;
    const stepMobile = midRange ? 52 : 44;
    const step = width <= 768 ? stepMobile : stepDesktop;
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

  function addScrollWave(originX, originY, intensity) {
    const maxActiveWaves = isMidRangeDevice() ? 2 : 3;
    if (waves.length >= maxActiveWaves) {
      waves.shift();
    }
    const maxR = Math.max(width, height) * 0.8;
    const thickness = 100;
    waves.push({
      x: originX,
      y: originY,
      radius: 0,
      maxRadius: maxR,
      speed: 18,
      thickness: thickness,
      halfThickness: thickness / 2,
      amplitude: Math.min(1.0, 0.4 + intensity * 0.012),
      pushForce: 11,
      decay: 0.975
    });
  }

  let isLoopRunning = false;
  let resizeTimeout = null;

  function updateDots() {
    const palette = colorPalettes[currentTheme] || colorPalettes.dark;
    let needsAnimation = false;

    // Update active scroll waves
    for (let w = waves.length - 1; w >= 0; w--) {
      const wave = waves[w];
      wave.radius += wave.speed;
      wave.amplitude *= wave.decay;
      if (wave.radius > wave.maxRadius || wave.amplitude < 0.02) {
        waves.splice(w, 1);
      } else {
        needsAnimation = true;
      }
    }

    // Pre-calculate wave bounding bounds
    const preparedWaves = [];
    for (let w = 0; w < waves.length; w++) {
      const wave = waves[w];
      const minDist = Math.max(0, wave.radius - wave.halfThickness);
      const maxDist = wave.radius + wave.halfThickness;
      preparedWaves.push({
        wave: wave,
        minDist: minDist,
        maxDist: maxDist,
        minDistSq: minDist * minDist,
        maxDistSq: maxDist * maxDist
      });
    }

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
            const pushAmount = smoothFactor * 8;

            hoverPushX = dx * invDist * pushAmount;
            hoverPushY = dy * invDist * pushAmount;
            hoverRadiusAdd = smoothFactor * 1.2;
            hoverAlphaAdd = smoothFactor * 0.25;
          }
        }
      }

      // Fast wave calculation with bounding-box pre-filtering & zero trig functions
      let wavePushX = 0;
      let wavePushY = 0;
      let waveRadiusAdd = 0;
      let waveAlphaAdd = 0;

      for (let w = 0; w < preparedWaves.length; w++) {
        const pw = preparedWaves[w];
        const wave = pw.wave;
        const dx = dot.baseX - wave.x;
        const dy = dot.baseY - wave.y;

        if (Math.abs(dx) > pw.maxDist || Math.abs(dy) > pw.maxDist) continue;

        const distSq = dx * dx + dy * dy;
        if (distSq < pw.minDistSq || distSq > pw.maxDistSq || distSq < 0.001) continue;

        const dist = Math.sqrt(distSq);
        const ringDist = Math.abs(dist - wave.radius);

        const factor = 1 - ringDist / wave.halfThickness;
        const smoothFactor = factor * factor * (3 - 2 * factor);
        const effect = smoothFactor * wave.amplitude;
        const invDist = 1 / dist;

        wavePushX += dx * invDist * effect * wave.pushForce;
        wavePushY += dy * invDist * effect * wave.pushForce;
        waveRadiusAdd += effect * 1.4;
        waveAlphaAdd += effect * 0.3;
      }

      dot.targetX = dot.baseX + hoverPushX + wavePushX;
      dot.targetY = dot.baseY + hoverPushY + wavePushY;
      dot.targetRadius = baseRadius + hoverRadiusAdd + waveRadiusAdd;
      dot.targetAlpha = Math.min(0.75, baseColor.baseAlpha + hoverAlphaAdd + waveAlphaAdd);

      const diffX = dot.targetX - dot.x;
      const diffY = dot.targetY - dot.y;
      const diffR = dot.targetRadius - dot.currentRadius;
      const diffA = dot.targetAlpha - dot.currentAlpha;

      if (Math.abs(diffX) > 0.01 || Math.abs(diffY) > 0.01 || Math.abs(diffR) > 0.001 || Math.abs(diffA) > 0.001) {
        dot.x += diffX * 0.18;
        dot.y += diffY * 0.18;
        dot.currentRadius += diffR * 0.18;
        dot.currentAlpha += diffA * 0.18;
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

    return needsAnimation || waves.length > 0;
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

  function startLoop() {
    if (document.hidden) return;
    if (document.body.dataset.qaStage && document.body.dataset.qaStage !== '5') return;
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
    if (document.hidden || (document.body.dataset.qaStage && document.body.dataset.qaStage !== '5')) {
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
    if (!document.hidden) {
      startLoop();
    }
  });

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

  let lastScrollY = window.scrollY || window.pageYOffset || 0;
  let lastWaveTime = 0;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY || window.pageYOffset || 0;
    const deltaY = Math.abs(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;

    const now = performance.now();
    if (deltaY > 3 && (now - lastWaveTime > 110)) {
      lastWaveTime = now;
      const originX = mouse.active ? mouse.x : width / 2;
      const originY = mouse.active ? mouse.y : height / 2;
      addScrollWave(originX, originY, deltaY);
    }
    startLoop();
  }, { passive: true });

  window.addEventListener('resize', () => {
    const currentWidth = window.innerWidth || document.documentElement.clientWidth;
    const currentHeight = window.innerHeight || document.documentElement.clientHeight;

    if (currentWidth !== lastWidth || Math.abs(currentHeight - lastHeight) > 120) {
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

