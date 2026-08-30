/* ==========================================================================
   BLUEPRINT STUDIO — PINGPIN IN-HOUSE TECH SPOTLIGHT POPUP
   ========================================================================== */

/**
 * Initializes the hover spotlight effect and in-house tech pop-up for the PingPin card.
 * Hovering over PingPin's visual brings both PingPin and Holiday2API forward in full spotlight focus,
 * while the entire rest of the page is blurred.
 */
export function initPingpinPopup() {
  const pingpinCard = document.getElementById('project-card-pingpin');
  const holidayApiCard = document.getElementById('project-card-holiday-api');
  const pingpinVisual = document.getElementById('pingpin-visual-trigger') || (pingpinCard && pingpinCard.querySelector('.visual-pingpin'));
  const overlay = document.getElementById('viewport-spotlight-overlay');
  const popup = document.getElementById('pingpin-tech-popup');

  if (!pingpinVisual || !overlay || !popup) return;

  let showTimeout = null;
  let hideTimeout = null;
  let isHovered = false;

  const updatePopupPosition = () => {
    const rect = pingpinVisual.getBoundingClientRect();
    const isMobile = window.innerWidth <= 640;

    if (isMobile) {
      popup.style.top = `${Math.max(16, rect.top + 8)}px`;
      popup.style.left = '16px';
      popup.style.right = '16px';
      popup.style.width = 'calc(100vw - 32px)';
      popup.style.maxWidth = '460px';
    } else {
      popup.style.top = `${rect.top + 10}px`;
      popup.style.left = `${rect.left + 12}px`;
      popup.style.width = `${rect.width - 24}px`;
      popup.style.maxWidth = '440px';
    }
  };

  const showSpotlight = () => {
    isHovered = true;
    clearTimeout(hideTimeout);

    showTimeout = setTimeout(() => {
      if (!isHovered) return;
      updatePopupPosition();
      document.body.classList.add('spotlight-active');
      overlay.classList.add('active');
      if (pingpinCard) pingpinCard.classList.add('spotlight-focused');
      if (holidayApiCard) holidayApiCard.classList.add('spotlight-partner');
      popup.setAttribute('aria-hidden', 'false');
      popup.classList.add('visible');
    }, 20);
  };

  const hideSpotlight = () => {
    isHovered = false;
    clearTimeout(showTimeout);

    hideTimeout = setTimeout(() => {
      if (isHovered) return;
      document.body.classList.remove('spotlight-active');
      overlay.classList.remove('active');
      if (pingpinCard) pingpinCard.classList.remove('spotlight-focused');
      if (holidayApiCard) holidayApiCard.classList.remove('spotlight-partner');
      popup.setAttribute('aria-hidden', 'true');
      popup.classList.remove('visible');
    }, 70);
  };

  // Hover triggers on PingPin visual, Holiday2API card, and the popup
  pingpinVisual.addEventListener('mouseenter', showSpotlight);
  pingpinVisual.addEventListener('mouseleave', hideSpotlight);

  if (holidayApiCard) {
    holidayApiCard.addEventListener('mouseenter', showSpotlight);
    holidayApiCard.addEventListener('mouseleave', hideSpotlight);
  }

  popup.addEventListener('mouseenter', showSpotlight);
  popup.addEventListener('mouseleave', hideSpotlight);

  // Keyboard accessibility
  pingpinVisual.addEventListener('focusin', showSpotlight);
  pingpinVisual.addEventListener('focusout', (e) => {
    if (!pingpinVisual.contains(e.relatedTarget) && (!holidayApiCard || !holidayApiCard.contains(e.relatedTarget)) && !popup.contains(e.relatedTarget)) {
      hideSpotlight();
    }
  });

  // Reposition on scroll or resize when active
  window.addEventListener('scroll', () => {
    if (popup.classList.contains('visible')) {
      updatePopupPosition();
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (popup.classList.contains('visible')) {
      updatePopupPosition();
    }
  }, { passive: true });

  // Escape key to dismiss
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('visible')) {
      hideSpotlight();
    }
  });
}
