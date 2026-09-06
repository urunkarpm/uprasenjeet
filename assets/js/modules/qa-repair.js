/* ==========================================================================
   QA REPAIR MODULE — PROGRESSIVE SCROLL INTERACTION
   ========================================================================== */

const STAGE_CONFIGS = [
  {
    stage: 0,
    status: 'FAIL ❌',
    bannerText: '⚠️ CRITICAL: 5 UNRESOLVED DEFECTS DETECTED IN UNTESTED BUILD',
    log: '> [SYSTEM ALERT] 5 Defects active. Scroll to trigger QA repair sequence...',
    progress: 10
  },
  {
    stage: 1,
    status: 'PATCHING 🛠️',
    bannerText: '🛠️ QA PIPELINE: EXECUTING PATCH 1/5 (GRID REALIGNMENT)',
    log: '> [PATCH 01] Fixing flexbox grid, card rotations & element layout bounds...',
    progress: 30
  },
  {
    stage: 2,
    status: 'PATCHING 🛠️',
    bannerText: '🛠️ QA PIPELINE: EXECUTING PATCH 2/5 (TYPOGRAPHY & ACCESSIBILITY)',
    log: '> [PATCH 02] Resolving contrast ratios & Google Sans / Mono font hierarchy...',
    progress: 50
  },
  {
    stage: 3,
    status: 'PATCHING 🛠️',
    bannerText: '🛠️ QA PIPELINE: EXECUTING PATCH 3/5 (ASSET & LINK RECOVERY)',
    log: '> [PATCH 03] Verifying media assets & recovering interactive card links...',
    progress: 70
  },
  {
    stage: 4,
    status: 'OPTIMIZING ⚡',
    bannerText: '⚡ QA PIPELINE: EXECUTING PATCH 4/5 (PERFORMANCE & 60FPS ANIMATIONS)',
    log: '> [PATCH 04] Enabling hardware-accelerated transitions & micro-interactions...',
    progress: 90
  },
  {
    stage: 5,
    status: 'PASSED ✅',
    bannerText: '● ALL SYSTEMS OPERATIONAL: 100% REGRESSION TESTED | READY FOR PROD',
    log: '> [QA RUNNER] Test Suite Executed: 42/42 Passed. Zero Defects Found.',
    progress: 100
  }
];

let isLockedToProd = false;
let hasTriggeredCompletion = false;

export function initQaRepair() {
  const topBanner = document.getElementById('qa-top-banner');
  const consoleHud = document.getElementById('qa-console-hud');
  const bannerTextEl = document.getElementById('qa-banner-text');
  const hudLogEl = document.getElementById('qa-hud-log');
  const hudStatusEl = document.getElementById('qa-hud-status');
  const hudProgressFill = document.getElementById('qa-hud-progress-fill');
  const resetBtn = document.getElementById('qa-reset-btn');
  const modalOverlay = document.getElementById('qa-modal-overlay');
  const modalContinueBtn = document.getElementById('qa-modal-continue-btn');
  const hintTextEl = document.getElementById('qa-hint-text');

  const stageElements = {
    heroTitle: document.querySelector('.hero-title'),
    heroCta: document.querySelector('#welcome .btn-primary'),
    heroDesc: document.querySelector('.hero-description'),
    workTitle: document.querySelector('#work .section-title'),
    workSub: document.querySelector('#work .section-sub'),
    aboutTitle: document.querySelector('#about .section-title'),
    aboutSub: document.querySelector('#about .section-sub'),
    aboutBannerTag: document.querySelector('#about .banner-tag'),
    aboutBio1: document.querySelector('#about .about-bio-text:nth-of-type(1)'),
    aboutBio2: document.querySelector('#about .about-bio-text:nth-of-type(2)'),
    statBox1: document.querySelector('#about .stat-box:nth-child(1)'),
    statBox2: document.querySelector('#about .stat-box:nth-child(2)'),
    statBox3: document.querySelector('#about .stat-box:nth-child(3)'),
    statBox4: document.querySelector('#about .stat-box:nth-child(4)'),
    certsTitle: document.querySelector('#certifications .section-title'),
    certsSub: document.querySelector('#certifications .section-sub'),
    certsBannerTag: document.querySelector('#certifications .banner-tag'),
    istqbStatus: document.querySelector('.cert-card-featured .cert-status-pill'),
    istqbTitle: document.querySelector('.cert-card-featured .cert-title'),
    istqbDesc: document.querySelector('.cert-card-featured .cert-desc'),
    istqbId: document.querySelector('#istqb-cert-id')
  };

  const originalTexts = {};
  for (const key in stageElements) {
    if (stageElements[key]) {
      originalTexts[key] = stageElements[key].innerHTML;
    }
  }

  const STAGE_TEXT_OVERRIDES = {
    0: {
      heroTitle: `I design, <span style="color:#ef4444; font-family:monospace;">[QA_TEST_RUNNER: 5_DEFECTS]</span>, and test digital products with <span class="highlight-text" id="ai-animated-word">AI</span>.`,
      heroCta: `View Test Harness Specs 🧪`,
      heroDesc: `<strong>[TEST_CONFIG_ENV]:</strong> Target Host: <code>https://qa-staging.internal.local:8443</code><br /><br /><span style="color:#ef4444; font-family:monospace; font-weight:600;">⚠️ RUNNER_LOG:</span> Configured 42 E2E test specs (Playwright/Cypress). 5 critical regression defects failing on current commit.`,
      workTitle: `[TEST_SUITE_FAIL]: Staging Build Regression Audit`,
      workSub: `⚠️ Configured Test Runner Params: { viewport: '390x844', mockAPI: true, throttling: '3G_SLOW' }. 5 defects failing.`,
      aboutTitle: `QA Test Architecture &amp;<br />Regression Defect Analysis`,
      aboutSub: `Configured E2E test suites, boundary analysis vectors, and API mock stubs to ensure 100% production stability.`,
      aboutBannerTag: `[TEST_CONFIG_LOG]: QA SUITE UNRESOLVED`,
      aboutBio1: `Configured with <strong>6+ years of QA Engineering experience</strong> breaking banking &amp; payment platforms before users do. Expert in test automation frameworks (Playwright, Cypress), API validation, and performance stress testing.`,
      aboutBio2: `Leveraging <strong>AI-assisted QA testing</strong> to generate edge-case fuzzer payloads, automated regression scripts, and zero-defect production releases.`,
      statBox1: `<span class="stat-num" style="color:#ef4444;">5</span><span class="stat-lbl">Active Defect Tickets</span>`,
      statBox2: `<span class="stat-num" style="color:#ef4444;">18%</span><span class="stat-lbl">Initial Test Coverage</span>`,
      statBox3: `<span class="stat-num" style="color:#ef4444;">42/42</span><span class="stat-lbl">E2E Specs in Suite</span>`,
      statBox4: `<span class="stat-num">Banking</span><span class="stat-lbl">QA Test Harness</span>`,
      certsTitle: `[UNVERIFIED]: Test Specs &amp; QA Credentials`,
      certsSub: `Certificate &amp; test suite checks pending. ISTQB CTFL #00613950 under regression audit.`,
      certsBannerTag: `UNVERIFIED CREDENTIALS &amp; TEST SUITE LOGS`,
      istqbStatus: `<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> 5 Specs Failing`,
      istqbTitle: `[TEST_SPEC_FAIL] ISTQB® CTFL — Equivalence Partitioning Test Suite`,
      istqbDesc: `Configured test suite specs for Equivalence Partitioning &amp; Boundary Value Analysis. 250 test vectors executed: 5 boundary failures detected.`,
      istqbId: `TEST_HARNESS_AUDIT`
    },
    1: {
      heroTitle: `I design, QA test, and build digital products with <span class="highlight-text" id="ai-animated-word">AI</span>.`,
      heroCta: `Proof I Talk to Robots`,
      heroDesc: `QA Specialist (6+ yrs making sure banking apps don't crash when you buy coffee).<br /><br />🛠️ <i>Patching in progress:</i> Harnessing AI to build real products without burning production down.`,
      workTitle: `[QA_PATCH_1]: Selected Engineering Projects`,
      workSub: `🛠️ Patching in progress: Validating UI components &amp; backend endpoints...`,
      aboutBannerTag: `[PATCH_01]: ABOUT IN REVIEW`,
      certsTitle: `Certifications &amp; Core Competencies`,
      certsSub: `Verified industry credentials under regression testing.`,
      certsBannerTag: `CREDENTIALS UNDER AUDIT`,
      istqbStatus: `<i class="fa-solid fa-hourglass-half" style="color:#f59e0b;"></i> Re-evaluating`,
      istqbTitle: `ISTQB® Certified Tester Foundation Level (CTFL)`,
      istqbDesc: `Standardized qualification covering Software Testing Lifecycle, Test Design Techniques, Static Testing, and Risk-Based QA.`
    },
    2: {
      aboutBannerTag: `[PATCH_02]: ABOUT ALMOST READY`,
      certsBannerTag: `CREDENTIALS AUDIT (90% COMPLETE)`,
      istqbStatus: `<i class="fa-solid fa-hourglass-half" style="color:#f59e0b;"></i> Re-evaluating`
    },
    3: {
      aboutBannerTag: `[PATCH_03]: ABOUT REGRESSION AUDIT`
    },
    4: {
      aboutBannerTag: `[PATCH_04]: ABOUT FINAL QA PASS`
    }
  };

  const projectCards = document.querySelectorAll('.project-card');
  const originalCardTexts = [];

  projectCards.forEach((card) => {
    const titleEl = card.querySelector('.project-name');
    const descEl = card.querySelector('.project-desc');
    originalCardTexts.push({
      title: titleEl ? titleEl.innerHTML : '',
      desc: descEl ? descEl.innerHTML : ''
    });
  });

  const LOREM_TILE_DEFECTS = [
    {
      title: `<span style="color:#ef4444; font-family:monospace;">[CONFIG_FAIL_404]</span> PingPin — Auth Header Expiration &amp; Auto-Punch Loop`,
      desc: `Configured payload: <code>{ "auth_header": "Bearer null", "wifi_bssid": "00:00:00:00:00:00", "retry_count": 9999 }</code>. Result: Unhandled 401 Unauthorized cascade &amp; infinite background punch requests.`
    },
    {
      title: `<span style="color:#ef4444; font-family:monospace;">[STUB_API_500]</span> Holiday2API — Edge CDN Fuzzing &amp; Null Payload Injection`,
      desc: `Configured test vector: <code>GET /api/v1/holidays?year=999999&amp;state='; DROP TABLE states;--</code>. Result: Cloudflare worker uncaught exception &amp; 500 Internal Server Error.`
    },
    {
      title: `<span style="color:#ef4444; font-family:monospace;">[OOM_CRASH_503]</span> LogPaper — Logcat Buffer Overflow &amp; Memory Leak`,
      desc: `Configured stress harness: <code>adb logcat -v threadtime *:V</code> streaming 50,000 logs/sec. Result: OutOfMemoryError in Android surface buffer &amp; UI thread freeze.`
    },
    {
      title: `<span style="color:#ef4444; font-family:monospace;">[MATH_ERR_422]</span> Splixter — Boundary Value Float Rounding &amp; GST Overflow`,
      desc: `Configured boundary matrix: <code>{ "total": 0.00000001, "split_ratio": [0, 0, 0], "tip_pct": 999999 }</code>. Result: Floating point precision underflow &amp; unhandled ArithmeticException.`
    },
    {
      title: `<span style="color:#ef4444; font-family:monospace;">[SOCKET_DROP_504]</span> Force Ethernet — USB-C Dongle Timeout &amp; Socket Leak`,
      desc: `Configured network profile: <code>{ "packet_loss": "85%", "latency_ms": 4500, "interface": "eth0" }</code>. Result: SocketTimeoutException &amp; 504 Gateway Timeout during USB-C hot-plugging.`
    },
    {
      title: `<span style="color:#ef4444; font-family:monospace;">[GPU_LEAK_500]</span> Yukuza Launcher — Jetpack Compose Render Heap Leak`,
      desc: `Configured profiling spec: Chrome DevTools Heap Allocation Profiler. Result: 1.4 GB un-reclaimed bitmap textures &amp; Android TV launcher GPU panic on focus scroll.`
    }
  ];

  const certCards = document.querySelectorAll('#certifications .cert-card');
  const originalCertCardTexts = [];

  certCards.forEach((card) => {
    const titleEl = card.querySelector('.cert-title');
    const descEl = card.querySelector('.cert-desc');
    const issuerEl = card.querySelector('.issuer-name');
    const statusEl = card.querySelector('.cert-status-pill');
    const chips = Array.from(card.querySelectorAll('.cert-chip')).map(c => c.innerHTML);
    originalCertCardTexts.push({
      title: titleEl ? titleEl.innerHTML : '',
      desc: descEl ? descEl.innerHTML : '',
      issuer: issuerEl ? issuerEl.innerHTML : '',
      status: statusEl ? statusEl.innerHTML : '',
      chips: chips
    });
  });

  const LOREM_CERT_DEFECTS = [
    {
      title: `<span style="color:#ef4444; font-family:monospace;">[TEST_SPEC_FAIL]</span> ISTQB® CTFL — Equivalence Partitioning Test Suite`,
      desc: `Configured test suite specs for Equivalence Partitioning &amp; Boundary Value Analysis. 250 test vectors executed: 5 boundary failures detected.`,
      issuer: `[AUDIT_HARNESS] ISTQB Test Execution Bureau`,
      status: `<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> 5 Specs Failing`,
      chips: [`[FAIL] Boundary Check`, `[CONFIG] Equivalence Vector`, `[STUB] Null Pointer`, `[WARN] 401 Unauthorized`]
    },
    {
      title: `<span style="color:#ef4444; font-family:monospace;">[E2E_SUITE_FLAKE]</span> Playwright E2E — Async DOM Locator &amp; Timeout Spec`,
      desc: `Configured Playwright test config: <code>{ actionTimeout: 5000ms, retries: 3 }</code>. Result: Flaky test failures due to race condition in dynamic element hydration.`,
      issuer: `[E2E_RUNNER] Playwright Automation Suite`,
      status: `<i class="fa-solid fa-hourglass-half" style="color:#f59e0b;"></i> Flaky Assertion`,
      chips: [`[FAIL] Timeout 5000ms`, `[FLAKY] Race Condition`, `[RETRY] 3x Executed`, `[STUB] Mock API`]
    },
    {
      title: `<span style="color:#ef4444; font-family:monospace;">[STRESS_TEST_500]</span> Payment Gateway — Load Test &amp; Security Audit`,
      desc: `Configured k6 load test: 5,000 concurrent payment checkouts with mock credit cards. Result: 500 Internal Server Error &amp; database lockup under stress.`,
      issuer: `[PERF_HARNESS] Financial Security Lab`,
      status: `<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> 500 Gateway Crash`,
      chips: [`[FAIL] 500 Server Error`, `[LOAD] 5k VUs`, `[SECURITY] SQL Injection`, `[WARN] Lock Timeout`]
    },
    {
      title: `<span style="color:#ef4444; font-family:monospace;">[AI_FUZZ_OVERLOAD]</span> AI Prompt Fuzzer &amp; Edge-Case Payload Generator`,
      desc: `Configured AI test harness to generate 1,000 automated edge-case input vectors. Result: Uncovered 12 unhandled null pointer exceptions in form validation.`,
      issuer: `[AI_RUNNER] Prompt Fuzzing Suite`,
      status: `<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> Fuzzing Active`,
      chips: [`[FUZZ] 1k Payload Vectors`, `[NULL] Unhandled Exception`, `[STUB] Mock Data`, `[PASS] 988/1000`]
    }
  ];

  const toolChips = document.querySelectorAll('.tool-belt-banner .tool-chip');
  const originalToolChipTexts = [];

  toolChips.forEach((chip) => {
    const spanEl = chip.querySelector('span');
    originalToolChipTexts.push(spanEl ? spanEl.innerHTML : '');
  });

  const FUNNY_TOOL_DEFECTS = [
    `[ENV: STAGING]`,
    `Playwright.config.ts`,
    `Postman_Collection.json`,
    `Cypress_E2E.spec.ts`,
    `k6_Load_Test.js`,
    `Selenium_Grid`,
    `Jenkins_CI_CD`,
    `JIRA_DEFECT_LOG`,
    `Jest_Unit_Runner`,
    `Charles_Proxy_Stub`,
    `OWASP_ZAP_Scan`,
    `ISTQB_CTFL`
  ];

  if (!consoleHud) return;

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  function calculateStage() {
    if (isLockedToProd) return 5;

    const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

    // Safety check: if user is near top of page (scrollTop < 120), stage MUST be 0
    if (scrollTop < 120) {
      return 0;
    }

    const windowHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const totalHeight = Math.max(
      document.body.scrollHeight || 0,
      document.documentElement.scrollHeight || 0,
      document.body.offsetHeight || 0,
      document.documentElement.offsetHeight || 0
    );

    const docHeight = Math.max(1, totalHeight - windowHeight);

    // Stage 5 trigger: user must have scrolled past 70% of page AND reached near bottom (within 80px)
    if (scrollTop > docHeight * 0.7 && scrollTop + windowHeight >= totalHeight - 80) {
      return 5;
    }

    const scrollFraction = Math.min(Math.max(scrollTop / docHeight, 0), 1);

    if (scrollFraction < 0.18) return 0;
    if (scrollFraction < 0.38) return 1;
    if (scrollFraction < 0.58) return 2;
    if (scrollFraction < 0.78) return 3;
    if (scrollFraction < 0.88) return 4;
    return 5; // Triggers production release view when reaching the footer
  }

  let currentStage = -1;

  function triggerCompletionSequence() {
    if (hasTriggeredCompletion) return;
    hasTriggeredCompletion = true;
    isLockedToProd = true;

    // Immediately reset scroll to top (masthead area) so mobile viewport starts from masthead
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.scrollTo(0, 0);

    // Hide top banner as requested (remove green banner)
    if (topBanner) topBanner.classList.add('hidden');

    // Minimize QA Console HUD into a compact pill
    if (consoleHud) consoleHud.classList.add('minimized');

    // Ensure scroll position remains at masthead top (0, 0) after banner height update
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });

    // Show completion modal after scroll resets to masthead top
    setTimeout(() => {
      window.scrollTo(0, 0);
      if (modalOverlay) modalOverlay.classList.add('active');
    }, 200);
  }

  function updateStageUI() {
    const newStage = calculateStage();

    if (newStage === 5 && !hasTriggeredCompletion) {
      triggerCompletionSequence();
    }

    if (newStage === currentStage) return;

    currentStage = newStage;
    document.body.dataset.qaStage = currentStage;
    const config = STAGE_CONFIGS[currentStage];

    if (bannerTextEl) bannerTextEl.textContent = config.bannerText;
    if (hudLogEl) hudLogEl.textContent = config.log;
    if (hudStatusEl) hudStatusEl.textContent = `QA HUD: ${config.status}`;
    if (hudProgressFill) hudProgressFill.style.width = `${config.progress}%`;

    // Swap funny section titles & text for stages 0-4, then restore clean original text for stage 5
    for (const key in stageElements) {
      const el = stageElements[key];
      if (!el) continue;

      const isAboutKey = key.startsWith('about') || key.startsWith('statBox');

      if (currentStage < 5 && isAboutKey) {
        // About Me section remains broken with defect text & stats until Stage 5 (final release stage)
        const override = (STAGE_TEXT_OVERRIDES[currentStage] && STAGE_TEXT_OVERRIDES[currentStage][key]) ||
                         (STAGE_TEXT_OVERRIDES[0] && STAGE_TEXT_OVERRIDES[0][key]);
        if (override) {
          el.innerHTML = override;
        }
      } else if (currentStage in STAGE_TEXT_OVERRIDES && STAGE_TEXT_OVERRIDES[currentStage][key]) {
        el.innerHTML = STAGE_TEXT_OVERRIDES[currentStage][key];
      } else if (originalTexts[key]) {
        el.innerHTML = originalTexts[key];
      }
    }

    // Swap funny Lorem Ipsum defect quotes on project cards for stages 0-4 (restored at stage 5!)
    projectCards.forEach((card, index) => {
      const titleEl = card.querySelector('.project-name');
      const descEl = card.querySelector('.project-desc');
      if (currentStage < 5) {
        const defect = LOREM_TILE_DEFECTS[index % LOREM_TILE_DEFECTS.length];
        if (titleEl) titleEl.innerHTML = defect.title;
        if (descEl) descEl.innerHTML = defect.desc;
      } else if (originalCardTexts[index]) {
        if (titleEl) titleEl.innerHTML = originalCardTexts[index].title;
        if (descEl) descEl.innerHTML = originalCardTexts[index].desc;
      }
    });

    // Swap funny testing parameters, tags & Lorem Ipsum quotes on credential cards for stages 0-4 (restored at stage 5!)
    certCards.forEach((card, index) => {
      const titleEl = card.querySelector('.cert-title');
      const descEl = card.querySelector('.cert-desc');
      const issuerEl = card.querySelector('.issuer-name');
      const statusEl = card.querySelector('.cert-status-pill');
      const chipEls = card.querySelectorAll('.cert-chip');

      if (currentStage < 5) {
        const defect = LOREM_CERT_DEFECTS[index % LOREM_CERT_DEFECTS.length];
        if (titleEl) titleEl.innerHTML = defect.title;
        if (descEl) descEl.innerHTML = defect.desc;
        if (issuerEl) issuerEl.innerHTML = defect.issuer;
        if (statusEl) statusEl.innerHTML = defect.status;
        chipEls.forEach((chip, cIdx) => {
          if (defect.chips[cIdx]) chip.innerHTML = defect.chips[cIdx];
        });
      } else if (originalCertCardTexts[index]) {
        const orig = originalCertCardTexts[index];
        if (titleEl) titleEl.innerHTML = orig.title;
        if (descEl) descEl.innerHTML = orig.desc;
        if (issuerEl) issuerEl.innerHTML = orig.issuer;
        if (statusEl) statusEl.innerHTML = orig.status;
        chipEls.forEach((chip, cIdx) => {
          if (orig.chips[cIdx]) chip.innerHTML = orig.chips[cIdx];
        });
      }
    });

    // Swap funny broken brand names on tool belt chips for stages 0-4 (restored at stage 5!)
    toolChips.forEach((chip, index) => {
      const spanEl = chip.querySelector('span');
      if (!spanEl) return;
      if (currentStage < 5) {
        const defectName = FUNNY_TOOL_DEFECTS[index % FUNNY_TOOL_DEFECTS.length];
        spanEl.innerHTML = defectName;
      } else if (originalToolChipTexts[index]) {
        spanEl.innerHTML = originalToolChipTexts[index];
      }
    });

    if (currentStage === 5) {
      if (topBanner) topBanner.classList.add('hidden');
      consoleHud.classList.add('passed');
      if (hintTextEl) hintTextEl.textContent = '✅ 100% Verified';
    } else {
      if (topBanner) topBanner.classList.remove('hidden');
      consoleHud.classList.remove('passed');
      consoleHud.classList.remove('minimized');
      if (hintTextEl) hintTextEl.textContent = '🐞 Scroll to Auto-Fix';
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateStageUI();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  if (modalContinueBtn) {
    modalContinueBtn.addEventListener('click', () => {
      if (modalOverlay) modalOverlay.classList.remove('active');
      if (consoleHud) consoleHud.classList.add('minimized');
      window.scrollTo({ top: 0, behavior: 'instant' });
      window.scrollTo(0, 0);
    });
  }

  // Click on minimized HUD to expand/collapse
  if (consoleHud) {
    consoleHud.addEventListener('click', (e) => {
      if (e.target.closest('#qa-reset-btn')) return;
      if (currentStage === 5 || consoleHud.classList.contains('minimized')) {
        consoleHud.classList.toggle('minimized');
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isLockedToProd = false;
      hasTriggeredCompletion = false;
      isExecutingDiagnostics = false;
      if (diagTimeoutId) clearTimeout(diagTimeoutId);
      if (diagOverlay) diagOverlay.classList.remove('active');
      if (topBanner) topBanner.classList.remove('hidden');
      if (modalOverlay) modalOverlay.classList.remove('active');
      if (consoleHud) consoleHud.classList.remove('minimized');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(updateStageUI, 300);
    });
  }

  // Initial stage check
  updateStageUI();
}
