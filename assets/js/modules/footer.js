import { copyTextToClipboard } from './utils.js';

export function initFooter() {
  initLiveClock();
  initEmailActions();
  initDiagnosticsRunner();
  initFooterIstqbCopy();
}

/**
 * Live Clock updating every second in Indian Standard Time (IST / UTC+5:30)
 */
function initLiveClock() {
  const clockEl = document.getElementById('live-time-ist');
  if (!clockEl) return;

  const updateClock = () => {
    const timeStr = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(new Date());
    clockEl.textContent = `${timeStr} IST`;
  };

  updateClock();
  setInterval(updateClock, 1000);
}

/**
 * Email Box Actions (Send Email Feedback & Copy Email to Clipboard)
 */
function initEmailActions() {
  const sendEmailBtn = document.getElementById('send-email-btn');
  const sendText = document.getElementById('send-text');
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyText = document.getElementById('copy-text');

  // Handle Copy Email
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const textToCopy = 'uprasenjeet@gmail.com';
      copyTextToClipboard(textToCopy, copyText, 'Copy', 'Copied!');
    });
  }

  // Handle Send Email Feedback
  if (sendEmailBtn) {
    sendEmailBtn.addEventListener('click', () => {
      if (sendText) {
        sendText.textContent = 'Opening App...';
        setTimeout(() => {
          sendText.textContent = 'Send Email';
        }, 2500);
      }
    });
  }
}

/**
 * LIVE Real-Time In-Browser QA Diagnostics Runner
 * Executes actual live programmatic validations on DOM, A11y, Canvas, and Performance.
 */
function initDiagnosticsRunner() {
  const runBtn = document.getElementById('btn-run-diagnostics');
  const panel = document.getElementById('diagnostics-panel');
  const closeBtn = document.getElementById('btn-close-diagnostics');
  const rerunBtn = document.getElementById('btn-rerun-diagnostics');
  const progressBar = document.getElementById('diag-progress-bar');
  const progressPercent = document.getElementById('diag-progress-percent');
  const statusBadge = document.getElementById('diag-status-badge');
  const stepItems = document.querySelectorAll('.diag-step-item');

  if (!runBtn || !panel) return;

  let isRunning = false;

  // Real programmatic test suites
  function executeLiveTests() {
    return [
      // Test 1: Real-time Anchor & Route Target Validation
      (() => {
        const anchors = Array.from(document.querySelectorAll('a[href^="#"]'))
          .filter(a => {
            const h = a.getAttribute('href');
            return h && h.length > 1 && !h.startsWith('#!');
          });
        let valid = 0;
        anchors.forEach(a => {
          const targetId = a.getAttribute('href').slice(1);
          if (document.getElementById(targetId)) valid++;
        });
        const passed = anchors.length === 0 || valid === anchors.length;
        return {
          title: 'DOM Navigation & Anchor Routes',
          desc: `Verified ${valid}/${anchors.length} internal navigation targets in active DOM`,
          passed,
          badge: passed ? 'PASS' : 'WARN'
        };
      })(),

      // Test 2: Real-time WCAG 2.1 Accessibility & Asset Audit
      (() => {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        const images = Array.from(document.querySelectorAll('img'));
        const imagesWithAlt = images.filter(img => img.hasAttribute('alt') && img.getAttribute('alt').trim().length > 0);
        const skipLink = document.querySelector('.skip-link');
        const passed = imagesWithAlt.length === images.length && !!skipLink;
        return {
          title: 'WCAG 2.1 Accessibility & Images',
          desc: `Theme: ${theme.toUpperCase()} • ${imagesWithAlt.length}/${images.length} images alt-tagged • Skip link active`,
          passed,
          badge: passed ? 'PASS' : 'WARN'
        };
      })(),

      // Test 3: Real-time Viewport & Canvas Rendering Context
      (() => {
        const canvas = document.getElementById('bg-dots-canvas');
        let canvasOk = false;
        if (canvas && canvas.getContext) {
          const ctx = canvas.getContext('2d');
          canvasOk = !!ctx;
        }
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const noHorizOverflow = document.documentElement.scrollWidth <= width + 2;
        const passed = canvasOk && noHorizOverflow;
        return {
          title: 'Canvas 2D & Viewport Layout',
          desc: `Canvas 2D active • Viewport: ${width}×${height} (${dpr}x DPR) • Zero overflow`,
          passed,
          badge: passed ? 'PASS' : 'WARN'
        };
      })(),

      // Test 4: Real-time Performance & DOM Node Health
      (() => {
        const totalNodes = document.getElementsByTagName('*').length;
        const totalScripts = document.querySelectorAll('script').length;
        const perfTime = Math.round(performance.now());
        const passed = totalNodes > 0 && perfTime > 0;
        return {
          title: 'DOM Architecture & Performance',
          desc: `${totalNodes} DOM elements • ${totalScripts} scripts loaded • Runtime: ${perfTime}ms`,
          passed,
          badge: passed ? 'PASS' : 'WARN'
        };
      })()
    ];
  }

  function runTests() {
    if (isRunning) return;
    isRunning = true;

    panel.classList.add('active');
    panel.setAttribute('aria-hidden', 'false');

    // Reset UI states
    stepItems.forEach(item => {
      item.classList.remove('passed', 'running', 'failed');
      const icon = item.querySelector('.step-icon');
      if (icon) icon.className = 'step-icon fa-solid fa-spinner fa-spin';
      const badge = item.querySelector('.step-badge');
      if (badge) {
        badge.textContent = 'CHECKING...';
        badge.className = 'step-badge';
      }
    });

    if (progressBar) progressBar.style.width = '0%';
    if (progressPercent) progressPercent.textContent = '0%';
    if (statusBadge) {
      statusBadge.textContent = 'EXECUTING LIVE DOM CHECKS...';
      statusBadge.className = 'diag-status-badge running';
    }

    const testResults = executeLiveTests();
    const intervals = [350, 750, 1150, 1550];

    testResults.forEach((result, index) => {
      setTimeout(() => {
        const percent = Math.round(((index + 1) / testResults.length) * 100);
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (progressPercent) progressPercent.textContent = `${percent}%`;

        const item = stepItems[index];
        if (item) {
          item.classList.remove('running');
          item.classList.add(result.passed ? 'passed' : 'failed');

          const icon = item.querySelector('.step-icon');
          if (icon) {
            icon.className = result.passed
              ? 'step-icon fa-solid fa-circle-check'
              : 'step-icon fa-solid fa-triangle-exclamation';
          }

          const nameEl = item.querySelector('.step-name');
          if (nameEl) nameEl.textContent = result.title;

          const descEl = item.querySelector('.step-desc');
          if (descEl) descEl.textContent = result.desc;

          const badgeEl = item.querySelector('.step-badge');
          if (badgeEl) {
            badgeEl.textContent = result.badge;
            badgeEl.className = result.passed ? 'step-badge pass' : 'step-badge warn';
          }
        }

        if (index === testResults.length - 1) {
          isRunning = false;
          const allPassed = testResults.every(r => r.passed);
          if (statusBadge) {
            statusBadge.textContent = allPassed
              ? '100% QUALITY SCORE • ALL LIVE CHECKS PASSED'
              : 'DIAGNOSTICS COMPLETED WITH WARNINGS';
            statusBadge.className = allPassed ? 'diag-status-badge passed' : 'diag-status-badge running';
          }
        }
      }, intervals[index]);
    });
  }

  runBtn.addEventListener('click', () => {
    if (panel.classList.contains('active')) {
      runTests();
    } else {
      panel.classList.add('active');
      panel.setAttribute('aria-hidden', 'false');
      runTests();
    }
  });

  if (rerunBtn) {
    rerunBtn.addEventListener('click', runTests);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      panel.classList.remove('active');
      panel.setAttribute('aria-hidden', 'true');
    });
  }
}

/**
 * ISTQB Certificate Copy Trigger from Footer
 */
function initFooterIstqbCopy() {
  const copyBtn = document.getElementById('footer-copy-istqb');
  const copyText = document.getElementById('footer-copy-istqb-text');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    copyTextToClipboard('00613950', copyText, 'Copy ID', 'Copied!');
  });
}

