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

  function updateElementTransitions(delay) {
    // Dynamic transition timing for crisp rapid flips and smooth slow transitions
    const transitionMs = Math.min(Math.round(delay * 0.6), 400);
    const transitionStyle = `color ${transitionMs}ms ease`;
    if (aiWord) aiWord.style.transition = transitionStyle;
    if (headerAiDot) headerAiDot.style.transition = transitionStyle;
  }

  function step() {
    if (document.hidden || !isElementVisible) {
      return;
    }

    const hex = aiBrandColors[colorIndex];
    updateElementTransitions(currentDelay);

    if (aiWord) {
      aiWord.style.color = hex;
    }

    if (headerAiDot) {
      headerAiDot.style.color = hex;
    }

    colorIndex = (colorIndex + 1) % aiBrandColors.length;

    // Gradually decelerate towards MAX_DELAY
    if (currentDelay < MAX_DELAY) {
      currentDelay = Math.min(Math.round(currentDelay * DECEL_RATE), MAX_DELAY);
    }

    timerId = setTimeout(step, currentDelay);
  }

  function startAnimation(resetToFast = false) {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    if (resetToFast) {
      currentDelay = MIN_DELAY;
    }
    step();
  }

  function stopAnimation() {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  }

  // Intersection Observer: pause when offscreen, resume when visible
  if ('IntersectionObserver' in window && aiWord) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const wasVisible = isElementVisible;
        isElementVisible = entry.isIntersecting;
        if (isElementVisible && !wasVisible) {
          startAnimation(false);
        } else if (!isElementVisible && wasVisible) {
          stopAnimation();
        }
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
