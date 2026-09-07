/* ==========================================================================
   QA REPAIR MODULE — PROGRESSIVE SCROLL INTERACTION
   ========================================================================== */

const STAGE_CONFIGS = [
  {
    stage: 0,
    status: 'FAIL ❌',
    bannerText: '🧪 QA AUTOMATION RUNNER: 5 REGRESSION DEFECTS DETECTED IN STAGING BUILD #4092',
    log: '> [QA RUNNER] Active Test Suite: 42 E2E Specs Executed. 5 Failed. Scroll to initiate auto-patch...',
    progress: 10
  },
  {
    stage: 1,
    status: 'PATCHING 🛠️',
    bannerText: '🛠️ QA PATCH 1/5: EXECUTING FLEXBOX & LAYOUT REALIGNMENT (ASSERTION RE-CHECK)',
    log: '> [PATCH 01/05] Resolving grid bounds, card transforms & viewport overflow vectors...',
    progress: 30
  },
  {
    stage: 2,
    status: 'PATCHING 🛠️',
    bannerText: '🛠️ QA PATCH 2/5: AUDITING TYPOGRAPHY & WCAG 2.1 AA CONTRAST RATIOS',
    log: '> [PATCH 02/05] Validating color contrast ratios, aria-labels & font scale hierarchy...',
    progress: 50
  },
  {
    stage: 3,
    status: 'PATCHING 🛠️',
    bannerText: '🛠️ QA PATCH 3/5: VERIFYING MEDIA ASSETS & INTERACTIVE ROUTE STUBS',
    log: '> [PATCH 03/05] Auditing image alt tags, SVG assets & internal anchor route targets...',
    progress: 70
  },
  {
    stage: 4,
    status: 'OPTIMIZING ⚡',
    bannerText: '⚡ QA PATCH 4/5: BENCHMARKING 60FPS HARDWARE ACCELERATION & PERF BUDGET',
    log: '> [PATCH 04/05] Enabling 60FPS canvas layer compositing & micro-interaction physics...',
    progress: 90
  },
  {
    stage: 5,
    status: 'PASSED ✅',
    bannerText: '● ALL SYSTEMS OPERATIONAL: 100% REGRESSION TESTED | READY FOR PROD',
    log: '> [QA RUNNER] Test Suite Completed: 42/42 Specs Passed (100% Quality Score). Zero Defects Found.',
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
      heroTitle: `[STAGING_BUILD_v0.9.4]: QA Test Automation &amp; Regression Suite`,
      heroCta: `Inspect Staging Test Harness Specs 🧪`,
      heroDesc: `<div style="font-family:var(--font-mono); font-size:0.83rem; background:var(--bg-card); border:1px solid rgba(239,68,68,0.35); padding:10px 14px; border-radius:8px; margin-top:10px;"><div style="color:var(--text-secondary); font-size:0.75rem; margin-bottom:4px;"><i class="fa-solid fa-microchip" aria-hidden="true"></i> <strong>QA_MOCK_ENV_CONFIG:</strong> <code>{ suite: "Playwright E2E", mockData: true, target: "staging.internal.local" }</code></div><div style="color:#ef4444; font-weight:600;"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> <strong>STAGING SUITE AUDIT:</strong> 42 Synthetic E2E Specs Executed • 5 Regression Defects failing • Scroll down to trigger QA auto-patch.</div></div>`,
      workTitle: `<span style="font-family:var(--font-mono); color:#ef4444;">[MOCK_DATASET_v2]: STAGING REGRESSION SUITE</span> Anonymous Project Test Harness`,
      workSub: `Synthetic QA mock fixtures running 42 E2E test specs against isolated staging endpoints (5 defect tickets active):`,
      aboutTitle: `[STAGING_FIXTURE]: QA Test Architecture &amp;<br />Regression Defect Matrix`,
      aboutSub: `Anonymized test harness suite simulating boundary conditions, load stress, and security vectors.`,
      aboutBannerTag: `[QA_MOCK_ENV]: STAGING TEST FIXTURES ACTIVE`,
      aboutBio1: `<strong>[SYNTHETIC_QA_PROFILE]:</strong> Simulated test runner profile executing automated test suites across mock banking &amp; payment endpoints. Evaluates response payloads, error boundaries, and race conditions.`,
      aboutBio2: `<strong>[AUTOMATION_SPEC]:</strong> Simulating AI-driven test generators, edge-case fuzzer payloads, and automated regression runners prior to production deployment.`,
      statBox1: `<span class="stat-num" style="color:#ef4444;">5 / 42</span><span class="stat-lbl">Synthetic Defect Tickets</span>`,
      statBox2: `<span class="stat-num" style="color:#f59e0b;">88.1%</span><span class="stat-lbl">Mock Pass Rate</span>`,
      statBox3: `<span class="stat-num" style="color:#ef4444;">401 / 500</span><span class="stat-lbl">Mock API Errors Caught</span>`,
      statBox4: `<span class="stat-num">Playwright</span><span class="stat-lbl">Staging Test Suite</span>`,
      certsTitle: `[STAGING_AUDIT]: Synthetic Test Specs &amp; Mock Credentials`,
      certsSub: `Mock certification &amp; test suite checks pending verification under staging regression runner.`,
      certsBannerTag: `SYNTHETIC CREDENTIALS &amp; STAGING LOGS`,
      istqbStatus: `<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> 5 Specs Failing`,
      istqbTitle: `[SPEC-SUITE #01] ISTQB® CTFL — Equivalence Partitioning Test Suite`,
      istqbDesc: `Synthetic test suite specs for Equivalence Partitioning &amp; Boundary Value Analysis. 250 test vectors executed: 5 boundary failures detected.`,
      istqbId: `MOCK_CERT_ID_#000000`
    },
    1: {
      heroTitle: `[STAGING_BUILD_v0.9.4]: QA Test Automation &amp; Regression Suite`,
      heroCta: `Inspect Staging Test Harness Specs 🧪`,
      heroDesc: `🛠️ <i>Patch 1/5 in progress:</i> Validating layout grid assertions &amp; flexbox element boundaries...`,
      workTitle: `[QA_PATCH_1]: Staging Project Fixtures`,
      workSub: `🛠️ Patching in progress: Realigning layout grids &amp; DOM element bounds...`,
      aboutBannerTag: `[PATCH_01]: ABOUT IN REVIEW`,
      certsTitle: `Synthetic Certifications &amp; Core Competencies`,
      certsSub: `Mock credentials under regression testing.`,
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
      title: `<span class="qa-badge fail"><i class="fa-solid fa-bug"></i> DEFECT-101</span> <span class="qa-badge-http">401 UNAUTHORIZED</span> NexusPunch — Auth Header Expiration &amp; Auto-Retry Loop`,
      desc: `<strong>Mock Payload:</strong> <code>POST /api/v1/mock/punch</code> with <code>{ bearerToken: "SYNTHETIC_EXPIRED", maxRetries: 9999 }</code>.<br/><span class="qa-err-msg">❌ AssertionError: Expected HTTP 200 OK, received 401 Unauthorized (MockAuthInterceptor.kt:42).</span>`
    },
    {
      title: `<span class="qa-badge fail"><i class="fa-solid fa-bug"></i> DEFECT-102</span> <span class="qa-badge-http">500 SERVER ERROR</span> OmniCalendar — Edge CDN Fuzzing &amp; Null Payload Vector`,
      desc: `<strong>Mock Payload:</strong> <code>GET /api/v1/mock/holidays?year=999999&amp;state=NULL</code>.<br/><span class="qa-err-msg">❌ UncaughtTypeError: Cannot read properties of undefined (reading 'isoCode') at WorkerStub.js:88.</span>`
    },
    {
      title: `<span class="qa-badge fail"><i class="fa-solid fa-bug"></i> DEFECT-103</span> <span class="qa-badge-http">503 SERVICE UNAVAIL</span> TerminalStream — Logcat Buffer Stress &amp; Memory Heap Leak`,
      desc: `<strong>Mock Payload:</strong> <code>adb logcat -v threadtime *:V</code> streaming 50,000 synthetic logs/sec.<br/><span class="qa-err-msg">❌ OutOfMemoryError: Canvas surface texture allocation failed at MockLiveWallpaperService.kt:114.</span>`
    },
    {
      title: `<span class="qa-badge fail"><i class="fa-solid fa-bug"></i> DEFECT-104</span> <span class="qa-badge-http">422 UNPROCESSABLE</span> MatrixSplit — Float Precision Underflow &amp; GST Boundary`,
      desc: `<strong>Mock Payload:</strong> <code>SplitCalculator.calculate({ total: 0.00000001, splitRatio: [0, 0, 0] })</code>.<br/><span class="qa-err-msg">❌ ArithmeticException: Division by zero in ProportionalSplitter.kt:62.</span>`
    },
    {
      title: `<span class="qa-badge fail"><i class="fa-solid fa-bug"></i> DEFECT-105</span> <span class="qa-badge-http">504 TIMEOUT</span> EtherNetRouter — Dongle Hot-Plug &amp; Socket Leak`,
      desc: `<strong>Mock Payload:</strong> <code>NetworkEmulationProfile({ latency: "4500ms", packetLoss: "85%" })</code>.<br/><span class="qa-err-msg">❌ SocketTimeoutException: USB-C interface eth0 reset by peer at MockTetherManager.kt:205.</span>`
    },
    {
      title: `<span class="qa-badge fail"><i class="fa-solid fa-bug"></i> DEFECT-106</span> <span class="qa-badge-http">OOM HEAP LEAK</span> QuantumLauncher — Texture Buffer Leak on Focus Scroll`,
      desc: `<strong>Mock Payload:</strong> <code>DevTools Heap Profiler Trace (1,000 D-Pad focus events)</code>.<br/><span class="qa-err-msg">❌ GraphicBufferLeak: 1.4 GB un-reclaimed bitmap textures at ShaderCanvas.kt:78.</span>`
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
      title: `<span class="qa-badge fail"><i class="fa-solid fa-vial-circle-check"></i> SPEC-01</span> ISTQB® CTFL — Boundary Value &amp; Equivalence Matrix`,
      desc: `<strong>Test Spec:</strong> 250 Boundary Value Analysis &amp; Equivalence Partitioning test vectors executed.<br/><span class="qa-err-msg">⚠️ 5/250 boundary assertions failing on edge parameters.</span>`,
      issuer: `[MOCK_QA_HARNESS] Synthetic Test Execution Bureau`,
      status: `<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> 5 Specs Failing`,
      chips: [`[FAIL] Boundary Vector`, `[SPEC] Equivalence Partition`, `[STUB] Mock Payload`, `[WARN] 401 Expiration`]
    },
    {
      title: `<span class="qa-badge warn"><i class="fa-solid fa-vial-circle-check"></i> SPEC-02</span> Playwright E2E — Async Locator &amp; Timeout Spec`,
      desc: `<strong>Test Spec:</strong> <code>{ actionTimeout: "5000ms", retries: 3 }</code>.<br/><span class="qa-err-msg">⚠️ Flaky assertion due to async DOM element hydration race condition.</span>`,
      issuer: `[MOCK_QA_HARNESS] Playwright Automation Suite`,
      status: `<i class="fa-solid fa-hourglass-half" style="color:#f59e0b;"></i> Flaky Assertion`,
      chips: [`[WARN] Locator Timeout`, `[RACE] Async Hydration`, `[RETRY] 3x Executed`, `[PASS] 37/42 Specs`]
    },
    {
      title: `<span class="qa-badge fail"><i class="fa-solid fa-vial-circle-check"></i> SPEC-03</span> Payment Gateway — k6 Load Test &amp; Security Scan`,
      desc: `<strong>Test Spec:</strong> k6 load test simulating 5,000 concurrent Virtual Users (VUs).<br/><span class="qa-err-msg">❌ 500 Internal Server Error &amp; database connection pool exhaustion.</span>`,
      issuer: `[MOCK_QA_HARNESS] k6 Load Testing Engine`,
      status: `<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> 500 Load Crash`,
      chips: [`[FAIL] 500 Server Error`, `[LOAD] 5k VUs`, `[SECURITY] OWASP ZAP`, `[WARN] Pool Lock`]
    },
    {
      title: `<span class="qa-badge fail"><i class="fa-solid fa-vial-circle-check"></i> SPEC-04</span> AI Prompt Fuzzer — Edge-Case Input Suite`,
      desc: `<strong>Test Spec:</strong> AI automated edge-case input generator (1,000 payload vectors).<br/><span class="qa-err-msg">⚠️ Uncovered 12 unhandled null pointer exceptions in form validation.</span>`,
      issuer: `[MOCK_QA_HARNESS] AI Fuzzing Runner`,
      status: `<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> Fuzzing Active`,
      chips: [`[FUZZ] 1k Payload Vectors`, `[NULL] Unhandled Exception`, `[PASS] 988/1000`, `[COVERAGE] 94%`]
    }
  ];

  const toolChips = document.querySelectorAll('.tool-belt-banner .tool-chip');
  const originalToolChipTexts = [];

  toolChips.forEach((chip) => {
    const spanEl = chip.querySelector('span');
    originalToolChipTexts.push(spanEl ? spanEl.innerHTML : '');
  });

  const FUNNY_TOOL_DEFECTS = [
    `[STAGING_MOCK_DATA]`,
    `Playwright.config.ts`,
    `Mock_Payload_Fixture.json`,
    `Cypress_E2E.spec.ts`,
    `k6_Load_Test.js`,
    `ADB_Logcat_Harness`,
    `OWASP_ZAP_Scanner`,
    `Jest_Unit_Runner.ts`,
    `Charles_Proxy_Stubs`,
    `ISTQB_Boundary_Matrix`,
    `JIRA_MOCK_TICKET_LOG`,
    `Synthetic_Data_Generator`
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
