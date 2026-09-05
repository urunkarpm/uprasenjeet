/* ==========================================================================
   BLUEPRINT STUDIO — AI BRAND ANIMATOR MODULE
   ========================================================================== */

export function initAiAnimator() {
  const aiBrandColors = [
    // Claude / Anthropic
    '#D97757', '#FAF9F5', '#B0AEA5', '#E8E6DC',
    // Gemini
    '#078EFA', '#AD89EB', '#FFFFFF',
    // ChatGPT / OpenAI
    '#10A37F', '#FAFAFA', '#0F0F0F',
    // Grok / xAI
    '#000000', '#868686', '#FDFDFD',
    // Figma
    '#F24E1E', '#FF7262', '#A259FF', '#1ABCFE', '#0ACF83'
  ];

  const aiWord = document.getElementById('ai-animated-word');
  const headerAiDot = document.getElementById('header-ai-dot');

  if (!aiWord && !headerAiDot) return;

  let colorIndex = 0;
  let timerId = null;
  let isElementVisible = true;

  // Deceleration parameters:
  // Starts switching rapidly, then gradually slows down step-by-step to a relaxed pace
  const MIN_DELAY = 60;    // Starting fast speed (~60ms)
  const MAX_DELAY = 2200;  // Settled slow speed (~2.2s)
  const DECEL_RATE = 1.16; // Speed decrease multiplier per step
  let currentDelay = MIN_DELAY;

  const targets = [aiWord, headerAiDot].filter(Boolean);
  targets.forEach(el => el.style.transition = 'color 0.35s ease');

  function step() {
    if (document.hidden || !isElementVisible) return;

    const hex = aiBrandColors[colorIndex];
    targets.forEach(el => el.style.color = hex);

    colorIndex = (colorIndex + 1) % aiBrandColors.length;

    if (currentDelay < MAX_DELAY) {
      currentDelay = Math.min(Math.round(currentDelay * DECEL_RATE), MAX_DELAY);
    }

    timerId = setTimeout(step, currentDelay);
  }

  function startAnimation(resetToFast = false) {
    clearTimeout(timerId);
    timerId = null;
    if (resetToFast) currentDelay = MIN_DELAY;
    step();
  }

  function stopAnimation() {
    clearTimeout(timerId);
    timerId = null;
  }

  if (aiWord) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const wasVisible = isElementVisible;
        isElementVisible = entry.isIntersecting;
        if (isElementVisible && !wasVisible) startAnimation(false);
        else if (!isElementVisible && wasVisible) stopAnimation();
      });
    }, { threshold: 0.1 });
    observer.observe(aiWord);
  }

  // Pause when browser tab is inactive
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAnimation();
    } else if (isElementVisible) {
      startAnimation(false);
    }
  });

  // Re-trigger fast-to-slow deceleration on hover
  if (aiWord) {
    aiWord.style.cursor = 'pointer';
    aiWord.addEventListener('mouseenter', () => {
      startAnimation(true);
    });
  }

  // Start with fast color switching immediately on load
  startAnimation(true);
}
