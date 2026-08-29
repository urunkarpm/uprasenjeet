/* ==========================================================================
   BLUEPRINT STUDIO — INTERACTIVE TOOLBELT MODULE
   ========================================================================== */

export function initToolbelt() {
  const banner = document.querySelector('.tool-belt-banner');
  if (!banner) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let isHovered = false;
  let isDragging = false;
  const autoScrollSpeed = 0.6;

  let isVisible = true;

  if ('IntersectionObserver' in window) {
    const bannerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (!wasVisible && isVisible) {
          requestAnimationFrame(autoStep);
        }
      });
    }, { threshold: 0.05 });
    bannerObserver.observe(banner);
  }

  function autoStep() {
    if (!isVisible) return;
    if (!isHovered && !isDown) {
      banner.scrollLeft += autoScrollSpeed;
      const halfWidth = banner.scrollWidth / 2;
      if (banner.scrollLeft >= halfWidth) {
        banner.scrollLeft -= halfWidth;
      }
    }
    requestAnimationFrame(autoStep);
  }
  requestAnimationFrame(autoStep);

  banner.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    banner.scrollLeft += delta;

    const halfWidth = banner.scrollWidth / 2;
    if (banner.scrollLeft >= halfWidth) {
      banner.scrollLeft -= halfWidth;
    } else if (banner.scrollLeft <= 0) {
      banner.scrollLeft += halfWidth;
    }
  }, { passive: false });

  banner.addEventListener('mouseenter', () => { isHovered = true; });
  banner.addEventListener('mouseleave', () => {
    isHovered = false;
    isDown = false;
    banner.classList.remove('active');
  });

  banner.addEventListener('mousedown', (e) => {
    isDown = true;
    isDragging = false;
    banner.classList.add('active');
    startX = e.pageX - banner.offsetLeft;
    scrollLeft = banner.scrollLeft;
  });

  banner.addEventListener('mouseup', () => {
    isDown = false;
    banner.classList.remove('active');
  });

  banner.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - banner.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 4) {
      isDragging = true;
    }
    banner.scrollLeft = scrollLeft - walk;

    const halfWidth = banner.scrollWidth / 2;
    if (banner.scrollLeft >= halfWidth) {
      banner.scrollLeft -= halfWidth;
      startX = e.pageX - banner.offsetLeft;
      scrollLeft = banner.scrollLeft;
    } else if (banner.scrollLeft <= 0) {
      banner.scrollLeft += halfWidth;
      startX = e.pageX - banner.offsetLeft;
      scrollLeft = banner.scrollLeft;
    }
  });

  // Touch Events for Mobile Dragging
  banner.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDown = true;
      isDragging = false;
      startX = e.touches[0].pageX - banner.offsetLeft;
      scrollLeft = banner.scrollLeft;
    }
  }, { passive: true });

  banner.addEventListener('touchend', () => {
    isDown = false;
  });

  banner.addEventListener('touchmove', (e) => {
    if (!isDown || e.touches.length !== 1) return;
    const x = e.touches[0].pageX - banner.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 4) {
      isDragging = true;
    }
    banner.scrollLeft = scrollLeft - walk;

    const halfWidth = banner.scrollWidth / 2;
    if (banner.scrollLeft >= halfWidth) {
      banner.scrollLeft -= halfWidth;
      startX = e.touches[0].pageX - banner.offsetLeft;
      scrollLeft = banner.scrollLeft;
    } else if (banner.scrollLeft <= 0) {
      banner.scrollLeft += halfWidth;
      startX = e.touches[0].pageX - banner.offsetLeft;
      scrollLeft = banner.scrollLeft;
    }
  }, { passive: true });

  banner.querySelectorAll('.tool-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });
}
