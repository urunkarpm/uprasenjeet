/* ==========================================================================
   BLUEPRINT STUDIO — PINGPIN IN-HOUSE TECH SPOTLIGHT POPUP
   ========================================================================== */

/**
 * Initializes the hover spotlight effect and in-house tech pop-up for the PingPin card.
 * - On desktop: Hovering over PingPin's visual brings both PingPin & Holiday2API into spotlight focus.
 * - On mobile: Auto-triggers when PingPin's top reaches top of display, and auto-closes once scrolling
 *   crosses the end of the Holiday2API tile.
 */
export function initPingpinPopup() {
  const pingpinCard = document.getElementById('project-card-pingpin');
  const holidayApiCard = document.getElementById('project-card-holiday-api');
  const pingpinVisual = document.getElementById('pingpin-visual-trigger') || (pingpinCard && pingpinCard.querySelector('.visual-pingpin'));
  const popup = document.getElementById('pingpin-tech-popup');

  if (!pingpinVisual || !popup) return;

  let showTimeout = null;
  let hideTimeout = null;
  let isHovered = false;

  const updatePopupPosition = () => {
    const rect = pingpinVisual.getBoundingClientRect();
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      const topPos = Math.max(76, Math.min(rect.top + 8, window.innerHeight - 200));
      popup.style.top = `${topPos}px`;
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
      updatePopupPosition();
      document.body.classList.add('spotlight-active');
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
      document.body.classList.remove('spotlight-active');
      if (pingpinCard) pingpinCard.classList.remove('spotlight-focused');
      if (holidayApiCard) holidayApiCard.classList.remove('spotlight-partner');
      popup.setAttribute('aria-hidden', 'true');
      popup.classList.remove('visible');
    }, 50);
  };

  // Desktop Hover triggers
  const setupDesktopHover = () => {
    const isTouchOrMobile = window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;
    if (isTouchOrMobile) return;

    pingpinVisual.addEventListener('mouseenter', showSpotlight);
    pingpinVisual.addEventListener('mouseleave', hideSpotlight);

    if (holidayApiCard) {
      holidayApiCard.addEventListener('mouseenter', showSpotlight);
      holidayApiCard.addEventListener('mouseleave', hideSpotlight);
    }

    popup.addEventListener('mouseenter', showSpotlight);
    popup.addEventListener('mouseleave', hideSpotlight);
  };

  setupDesktopHover();

  // Keyboard accessibility
  pingpinVisual.addEventListener('focusin', showSpotlight);
  pingpinVisual.addEventListener('focusout', (e) => {
    if (!pingpinVisual.contains(e.relatedTarget) && (!holidayApiCard || !holidayApiCard.contains(e.relatedTarget)) && !popup.contains(e.relatedTarget)) {
      hideSpotlight();
    }
  });

  // Mobile scroll tracking: Auto-trigger at PingPin top and auto-end at Holiday2API bottom
  const handleScroll = () => {
    const isMobile = window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;

    if (isMobile && pingpinCard && holidayApiCard) {
      const pingpinRect = pingpinCard.getBoundingClientRect();
      const holidayRect = holidayApiCard.getBoundingClientRect();

      // Active zone: from when PingPin reaches top of display (<= 120px)
      // until the end of Holiday2API crosses past the top (>= 60px)
      const isInSpotlightZone = pingpinRect.top <= 120 && holidayRect.bottom >= 60;

      if (isInSpotlightZone) {
        if (!document.body.classList.contains('spotlight-active')) {
          showSpotlight();
        } else {
          updatePopupPosition();
        }
      } else {
        if (document.body.classList.contains('spotlight-active')) {
          hideSpotlight();
        }
      }
    } else {
      if (popup.classList.contains('visible')) {
        updatePopupPosition();
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', () => {
    handleScroll();
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
