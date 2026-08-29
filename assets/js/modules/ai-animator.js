/* ==========================================================================
   BLUEPRINT STUDIO — AI BRAND ANIMATOR MODULE
   ========================================================================== */

export function initAiAnimator() {
  const aiBrandColors = [
    // Claude / Anthropic
    '#141413', '#FAF9F5', '#B0AEA5', '#E8E6DC',
    // Gemini
    '#078EFA', '#AD89EB', '#FFFFFF',
    // ChatGPT / OpenAI
    '#0F0F0F', '#FAFAFA', '#10A37F',
    // Grok / xAI
    '#000000', '#868686', '#FDFDFD',
    // Figma
    '#F24E1E', '#FF7262', '#A259FF', '#1ABCFE', '#0ACF83'
  ];

  const aiWord = document.getElementById('ai-animated-word');
  const headerAiDot = document.getElementById('header-ai-dot');
  let colorIndex = 0;

  function getLuminance(hex) {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16) / 255;
    const g = parseInt(c.substring(2, 4), 16) / 255;
    const b = parseInt(c.substring(4, 6), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  let intervalId = null;
  let isElementVisible = true;

  function updateAiColor() {
    if (document.hidden || !isElementVisible) return;

    const hex = aiBrandColors[colorIndex];

    if (aiWord) {
      aiWord.style.color = hex;
      aiWord.style.textShadow = 'none';
      aiWord.style.transition = 'color 0.4s ease';
    }

    if (headerAiDot) {
      headerAiDot.style.color = hex;
      headerAiDot.style.transition = 'color 0.4s ease';
    }

    colorIndex = (colorIndex + 1) % aiBrandColors.length;
  }

  if ('IntersectionObserver' in window && aiWord) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isElementVisible = entry.isIntersecting;
      });
    }, { threshold: 0.1 });
    observer.observe(aiWord);
  }

  updateAiColor();
  intervalId = setInterval(updateAiColor, 2000);
}
