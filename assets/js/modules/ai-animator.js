/* ==========================================================================
   BLUEPRINT STUDIO — AI BRAND ANIMATOR MODULE
   ========================================================================== */

export function initAiAnimator() {
  const aiBrandColors = [
    '#D97757', '#FAF9F5', '#B0AEA5', '#E8E6DC', // Claude
    '#078EFA', '#AD89EB', '#FFFFFF',           // Gemini
    '#10A37F', '#FAFAFA', '#0F0F0F',           // ChatGPT
    '#000000', '#868686', '#FDFDFD',           // Grok
    '#F24E1E', '#FF7262', '#A259FF', '#1ABCFE', '#0ACF83' // Figma
  ];

  const targets = [
    document.getElementById('ai-animated-word'),
    document.getElementById('header-ai-dot')
  ].filter(Boolean);

  if (targets.length === 0) return;

  let colorIndex = 0;
  let timerId = null;
  let isVisible = true;
  let currentDelay = 60;

  targets.forEach(el => { el.style.transition = 'color 0.35s ease'; });

  function step() {
    if (document.hidden || !isVisible) return;
    targets.forEach(el => { el.style.color = aiBrandColors[colorIndex]; });
    colorIndex = (colorIndex + 1) % aiBrandColors.length;

    if (currentDelay < 2000) currentDelay = Math.min(Math.round(currentDelay * 1.15), 2000);
    timerId = setTimeout(step, currentDelay);
  }

  function start(fast = false) {
    clearTimeout(timerId);
    if (fast) currentDelay = 60;
    step();
  }

  const aiWord = document.getElementById('ai-animated-word');
  if (aiWord) {
    new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) start(false);
      else clearTimeout(timerId);
    }, { threshold: 0.1 }).observe(aiWord);

    aiWord.style.cursor = 'pointer';
    aiWord.addEventListener('mouseenter', () => start(true));
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearTimeout(timerId);
    else if (isVisible) start(false);
  });

  start(true);
}
