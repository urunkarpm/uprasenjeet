/* ==========================================================================
   BLUEPRINT STUDIO — INTERACTIVE TOOLBELT MODULE (GPU CSS MARQUEE ENGINE)
   ========================================================================== */

export function initToolbelt() {
  const banner = document.querySelector('.tool-belt-banner');
  if (!banner) return;

  const track = banner.querySelector('.tool-belt-track');
  if (!track || track.children.length === 0) return;

  // Duplicate chips once to guarantee seamless -50% CSS GPU marquee loop
  const initialChips = Array.from(track.children);
  initialChips.forEach(chip => {
    track.appendChild(chip.cloneNode(true));
  });

  // Pause marquee during QA defect stages (stages 0 to 4)
  const updateQaState = () => {
    const isDefectStage = document.body.dataset.qaStage && document.body.dataset.qaStage !== '5';
    if (isDefectStage) {
      banner.classList.add('is-paused');
    } else {
      banner.classList.remove('is-paused');
    }
  };

  updateQaState();

  // Observe mutations to dataset.qaStage
  if ('MutationObserver' in window) {
    const observer = new MutationObserver(() => updateQaState());
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-qa-stage'] });
  }

  // Interactive Drag & Touch Target Support
  let isDown = false;
  let startX = 0;
  let isDragging = false;

  banner.addEventListener('mousedown', (e) => {
    isDown = true;
    isDragging = false;
    startX = e.clientX;
    banner.classList.add('active', 'is-paused');
  });

  banner.addEventListener('mouseleave', () => {
    isDown = false;
    banner.classList.remove('active', 'is-paused');
  });

  banner.addEventListener('mouseup', () => {
    isDown = false;
    banner.classList.remove('active', 'is-paused');
  });

  banner.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const diffX = e.clientX - startX;
    if (Math.abs(diffX) > 4) {
      isDragging = true;
    }
  });

  banner.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDown = true;
      isDragging = false;
      startX = e.touches[0].clientX;
      banner.classList.add('active', 'is-paused');
    }
  }, { passive: true });

  banner.addEventListener('touchend', () => {
    isDown = false;
    banner.classList.remove('active', 'is-paused');
  });

  banner.querySelectorAll('.tool-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });
}
