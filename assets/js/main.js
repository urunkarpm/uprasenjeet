/* ==========================================================================
   BLUEPRINT STUDIO — MAIN APPLICATION ENTRY POINT
   ========================================================================== */

import { initTheme } from './modules/theme.js';
import { initNavigation } from './modules/navigation.js';
import { initAiAnimator } from './modules/ai-animator.js';
import { initToolbelt } from './modules/toolbelt.js';
import { initDotsCanvas } from './modules/dots-canvas.js';
import { initUtils } from './modules/utils.js';
import { initAnimations } from './modules/animations.js';
import { initSmoothScroll } from './modules/smooth-scroll.js';
import { initFooter } from './modules/footer.js';
import { initPingpinPopup } from './modules/pingpin-popup.js';
import { initQaRepair } from './modules/qa-repair.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initAiAnimator();
  initToolbelt();
  initDotsCanvas();
  initUtils();
  initAnimations();
  initSmoothScroll();
  initFooter();
  initPingpinPopup();
  initQaRepair();
});

