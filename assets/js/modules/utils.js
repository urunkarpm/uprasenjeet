/* ==========================================================================
   BLUEPRINT STUDIO — GENERAL UTILITIES MODULE
   ========================================================================== */

// ponytail: Native clipboard API without execCommand fallback. Ceiling: Requires secure context (HTTPS/localhost). Upgrade path: Add textarea fallback if unencrypted HTTP compatibility is required.
export function copyTextToClipboard(text, textElement, defaultText, successText = 'Copied!') {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        if (textElement) textElement.textContent = successText;
        setTimeout(() => {
          if (textElement) textElement.textContent = defaultText;
        }, 2000);
      })
      .catch(err => console.warn('Clipboard copy error:', err));
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

  // Dynamic Footer Year
  const yearSpan = document.getElementById('year-span');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}
