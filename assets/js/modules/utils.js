/* ==========================================================================
   BLUEPRINT STUDIO — GENERAL UTILITIES MODULE
   ========================================================================== */

export function copyTextToClipboard(text, textElement, defaultText, successText = 'Copied!') {
  const handleSuccess = () => {
    if (textElement) textElement.textContent = successText;
    setTimeout(() => {
      if (textElement) textElement.textContent = defaultText;
    }, 2000);
  };

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text)
      .then(handleSuccess)
      .catch(() => fallbackCopyText(text, handleSuccess));
  } else {
    fallbackCopyText(text, handleSuccess);
  }
}

export function initUtils() {

  // ISTQB Certificate Copy Button (Credentials Section)
  const copyCertBtn = document.getElementById('copy-istqb-btn');
  const copyCertText = document.getElementById('copy-cert-text');
  const certIdNum = document.getElementById('istqb-cert-id');
  if (copyCertBtn) {
    copyCertBtn.addEventListener('click', () => {
      const certId = certIdNum ? certIdNum.textContent.trim() : '00613950';
      copyTextToClipboard(certId, copyCertText, 'Copy ID');
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
