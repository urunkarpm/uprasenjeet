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

  function updateAiColor() {
    const hex = aiBrandColors[colorIndex];
    const lum = getLuminance(hex);

    if (aiWord) {
      aiWord.style.color = hex;
      if (lum < 0.15) {
        aiWord.style.textShadow = '0 0 2px rgba(255, 255, 255, 0.9), 0 0 10px rgba(255, 255, 255, 0.4)';
      } else if (lum > 0.85) {
        aiWord.style.textShadow = '0 0 2px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 255, 255, 0.5)';
      } else {
        aiWord.style.textShadow = `0 0 12px ${hex}77`;
      }
    }

    if (headerAiDot) {
      headerAiDot.style.color = hex;
    }

    colorIndex = (colorIndex + 1) % aiBrandColors.length;
  }

  updateAiColor();
  setInterval(updateAiColor, 2000);
}
