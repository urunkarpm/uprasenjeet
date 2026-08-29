/* ==========================================================================
   BLUEPRINT STUDIO — GENERAL UTILITIES MODULE
   ========================================================================== */

export function initUtils() {
  // Email Copy Button
  const copyBtn = document.getElementById('copy-email-btn');
  const copyText = document.getElementById('copy-text');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = 'uprasenjeet@gmail.com';
      
      const setSuccessText = () => {
        if (copyText) copyText.textContent = 'Copied!';
        setTimeout(() => {
          if (copyText) copyText.textContent = 'Copy';
        }, 2000);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email)
          .then(setSuccessText)
          .catch(() => fallbackCopyText(email, setSuccessText));
      } else {
        fallbackCopyText(email, setSuccessText);
      }
    });
  }

  function fallbackCopyText(text, callback) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      if (callback) callback();
    } catch (err) {
      console.error('Copy failed', err);
    }
    document.body.removeChild(textArea);
  }

  // Dynamic Footer Year
  const yearSpan = document.getElementById('year-span');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}
