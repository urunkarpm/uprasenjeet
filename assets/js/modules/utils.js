/* ==========================================================================
   BLUEPRINT STUDIO — GENERAL UTILITIES MODULE
   ========================================================================== */

export function initUtils() {
  // Send Email Button Feedback
  const sendBtn = document.getElementById('send-email-btn');
  const sendText = document.getElementById('send-text');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      if (sendText) {
        sendText.textContent = 'Opening App...';
        setTimeout(() => {
          sendText.textContent = 'Send Email';
        }, 2500);
      }
    });
  }

  function copyToClipboard(text, textElement, defaultText) {
    const handleSuccess = () => {
      if (textElement) textElement.textContent = 'Copied!';
      setTimeout(() => {
        if (textElement) textElement.textContent = defaultText;
      }, 2000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(handleSuccess)
        .catch(() => fallbackCopyText(text, handleSuccess));
    } else {
      fallbackCopyText(text, handleSuccess);
    }
  }

  // Email Copy Button
  const copyBtn = document.getElementById('copy-email-btn');
  const copyText = document.getElementById('copy-text');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      copyToClipboard('uprasenjeet@gmail.com', copyText, 'Copy');
    });
  }

  // ISTQB Certificate Copy Button
  const copyCertBtn = document.getElementById('copy-istqb-btn');
  const copyCertText = document.getElementById('copy-cert-text');
  const certIdNum = document.getElementById('istqb-cert-id');
  if (copyCertBtn) {
    copyCertBtn.addEventListener('click', () => {
      const certId = certIdNum ? certIdNum.textContent.trim() : '00613950';
      copyToClipboard(certId, copyCertText, 'Copy ID');
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
