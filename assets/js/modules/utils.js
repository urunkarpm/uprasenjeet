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

  // ISTQB Certificate Copy Button
  const copyCertBtn = document.getElementById('copy-istqb-btn');
  const copyCertText = document.getElementById('copy-cert-text');
  const certIdNum = document.getElementById('istqb-cert-id');

  if (copyCertBtn) {
    copyCertBtn.addEventListener('click', () => {
      const certId = certIdNum ? certIdNum.textContent.trim() : '00613950';
      const setSuccess = () => {
        if (copyCertText) copyCertText.textContent = 'Copied!';
        setTimeout(() => {
          if (copyCertText) copyCertText.textContent = 'Copy ID';
        }, 2000);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(certId)
          .then(setSuccess)
          .catch(() => fallbackCopyText(certId, setSuccess));
      } else {
        fallbackCopyText(certId, setSuccess);
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
