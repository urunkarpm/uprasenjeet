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
      heroTitle: `I design, <span style="color:#ef4444; font-family:monospace;">[BUG_404_DEFECT]</span>, and break digital products with <span class="highlight-text" id="ai-animated-word">AI</span>.`,
      heroCta: `Proof I Yell at Robots 🤖`,
      heroDesc: `<strong>[DEFECT_303]:</strong> Professional Bug Hunter (6+ yrs breaking banking &amp; e-commerce apps before users do).<br /><br /><span style="color:#ef4444; font-family:monospace; font-weight:600;">⚠️ WARN_UNHANDLED_EXCEPTION:</span> AI module overloaded—turning random shower thoughts into unstable software.`,
      workTitle: `[CRITICAL_DEFECTS]: Un-tested Chaos Builds`,
      workSub: `⚠️ Warning: Zero unit tests executed on initial commit. Proceed at your own risk!`,
      aboutTitle: `Bug Hunting Meets <br />Chaos Product Building`,
      aboutSub: `Applying 6+ years of breaking software to make sure code doesn't explode in production.`,
      aboutBannerTag: `[DEFECT_LOG]: ABOUT UNRESOLVED`,
      aboutBio1: `Lorem ipsum dolor sit amet, <strong>Prasenjeet Urunkar</strong> has <strong>6+ years of breaking banking platforms</strong> &amp; catching null pointer exceptions before customers do.`,
      aboutBio2: `Lorem ipsum AI development: turning caffeine &amp; 3 AM shower thoughts into real Android apps, automated network tools, and zero-defect utilities.`,
      statBox1: `<span class="stat-num" style="color:#ef4444;">404</span><span class="stat-lbl">Bugs Found in Prod</span>`,
      statBox2: `<span class="stat-num" style="color:#ef4444;">NaN%</span><span class="stat-lbl">Initial Test Coverage</span>`,
      statBox3: `<span class="stat-num" style="color:#ef4444;">500+</span><span class="stat-lbl">Sleep Hours Lost to QA</span>`,
      statBox4: `<span class="stat-num">Banking</span><span class="stat-lbl">Crash Testing</span>`,
      certsTitle: `[UNVERIFIED]: Diplomas &amp; Bug Credentials`,
      certsSub: `Certificate checks pending. ISTQB CTFL #00613950 under regression audit.`,
      certsBannerTag: `UNVERIFIED CREDENTIALS &amp; BUG REPOSITORIES`,
      istqbStatus: `<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> Under Audit`,
      istqbTitle: `[BUG_303] ISTQB® Certified Bug Creator &amp; Tester`,
      istqbDesc: `Lorem ipsum dolor sit amet, Equivalence Partitioning &amp; Boundary Value Analysis resulted in 500+ boundary value exceptions. Defect management status: CHAOS.`,
      istqbId: `BUG_404_AUDIT`
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
      title: `<span style="color:#ef4444; font-family:monospace;">[DEFECT_404]</span> PingPin — Lorem Ipsum Privacy Failure`,
      desc: `Lorem ipsum dolor sit amet, 500+ unhandled exceptions in attendance tracking. Ut enim ad minim veniam, office Wi-Fi auto-punches your boss by accident!`
    },
    {
      title: `<span style="color:#ef4444; font-family:monospace;">[STUB_API]</span> Holiday2API — Fake Data Generator`,
      desc: `Lorem ipsum dolor sit amet, Cloudflare edge caching 404s. Duis aute irure dolor in 3rd party API rate limits &amp; random bank holiday hallucinations.`
    },
    {
      title: `<span style="color:#ef4444; font-family:monospace;">[ALPHA_BUILD]</span> LogPaper — Hacker Terminal Crash`,
      desc: `Lorem ipsum dolor sit amet, Android Logcat stream overflowed device RAM. Excepteur sint occaecat cupidatat Matrix rain taking down system UI!`
    },
    {
      title: `<span style="color:#ef4444; font-family:monospace;">[BUG_500]</span> Splixter — Math Calculation Error`,
      desc: `Lorem ipsum dolor sit amet, Jetpack Compose bill splitter rounded tip to 999%. Nullam test-case written for proportional GST slicing!`
    },
    {
      title: `<span style="color:#ef4444; font-family:monospace;">[FAIL_403]</span> Force Ethernet — Packet Loss Deluxe`,
      desc: `Lorem ipsum dolor sit amet, 5G USB-C tethering speed dropped to 1 KB/s. Temporibus inciderunt unhandled socket drops &amp; router panic!`
    },
    {
      title: `<span style="color:#ef4444; font-family:monospace;">[NULL_PTR]</span> Yukuza Launcher — GPU Memory Leak`,
      desc: `Lorem ipsum dolor sit amet, Jetpack Compose aurora canvas memory leak at 3 AM. Quis nostrud exercitation Android TV launcher crashed!`
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
      title: `<span style="color:#ef4444; font-family:monospace;">[BUG_303]</span> ISTQB® Certified Bug Creator &amp; System Crasher`,
      desc: `Lorem ipsum dolor sit amet, Equivalence Partitioning &amp; Boundary Value Analysis resulted in 500+ unhandled exceptions. Defect management status: CHAOS.`,
      issuer: `[UNVERIFIED] ISTQB Audit Bureau`,
      status: `<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> License Suspended`,
      chips: [`[FAIL] Bug Creation`, `[DEFECT] Boundary Exception`, `[STUB] Infinite Loop`, `[WARN] Yell at Devs`]
    },
    {
      title: `<span style="color:#ef4444; font-family:monospace;">[FLAKY_SPEC]</span> Playwright &amp; Sleep(5000) Masterclass`,
      desc: `Lorem ipsum E2E test automation: fixed flaky tests by adding Thread.sleep(9999) &amp; deleting failing assertions from the CI/CD pipeline.`,
      issuer: `[UNSTABLE] Flaky Test Suite`,
      status: `<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> 99% Flaky`,
      chips: [`[FAIL] Sleep(5000)`, `[TIMEOUT] Jenkins Crash`, `[BUG] Flaky Selector`, `[RETRY] 50x Retries`]
    },
    {
      title: `<span style="color:#ef4444; font-family:monospace;">[404_MONEY]</span> Banking Platform Stress Test &amp; Glitcher`,
      desc: `Lorem ipsum payment gateway API returned 500 Internal Server Errors under stress load. Transferred negative account balance during live demo.`,
      issuer: `[DOMAIN_FAIL] Financial Chaos Lab`,
      status: `<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> 500 Bank Panic`,
      chips: [`[FAIL] Negative Balance`, `[404] Free Checkout`, `[DEFECT] Security Leak`, `[WARN] ATM Exploit`]
    },
    {
      title: `<span style="color:#ef4444; font-family:monospace;">[PROMPT_OVERLOAD]</span> AI Prompt Whisperer &amp; Hallucinator`,
      desc: `Lorem ipsum AI-assisted development: prompt engineering hallucinated non-existent NPM packages, created infinite loops, and blamed the QA team.`,
      issuer: `[OVERLOAD] Robot Union`,
      status: `<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> Robot Revolt`,
      chips: [`[STUB] AntiGravity`, `[HALLUCINATION] Fake APIs`, `[BUG] Infinite Loop`, `[FAIL] Robot Overlords`]
    }
  ];

  const toolChips = document.querySelectorAll('.tool-belt-banner .tool-chip');
  const originalToolChipTexts = [];

  toolChips.forEach((chip) => {
    const spanEl = chip.querySelector('span');
    originalToolChipTexts.push(spanEl ? spanEl.innerHTML : '');
  });

  const FUNNY_TOOL_DEFECTS = [
    `[BUG_404] Node.chaos`,
    `StackOverflowException`,
    `NullPointer.db`,
    `Docker_Exploded`,
    `404_React_Not_Found`,
    `InfiniteLoop.js`,
    `Panic_Go()`,
    `Corrupted_Git`,
    `Bug_Factory_AI`,
    `Coffee_To_Code`,
    `Sleep(9999)`,
    `Flaky_Suite`
  ];

  if (!consoleHud) return;

  function calculateStage() {
    if (isLockedToProd) return 5;

    const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const totalHeight = Math.max(
      document.body.scrollHeight || 0,
      document.documentElement.scrollHeight || 0,
      document.body.offsetHeight || 0,
      document.documentElement.offsetHeight || 0
    );

    const docHeight = Math.max(1, totalHeight - windowHeight);

    // If user has reached the footer / near the end of page (within 80px of bottom)
    if (scrollTop + windowHeight >= totalHeight - 80) {
      return 5;
    }

    const scrollFraction = Math.min(Math.max(scrollTop / docHeight, 0), 1);

    if (scrollFraction < 0.18) return 0;
    if (scrollFraction < 0.38) return 1;
    if (scrollFraction < 0.58) return 2;
    if (scrollFraction < 0.78) return 3;
    if (scrollFraction < 0.85) return 4;
    return 5; // Triggers production release view when reaching the footer
  }

  let currentStage = -1;

  function triggerCompletionSequence() {
    if (hasTriggeredCompletion) return;
    hasTriggeredCompletion = true;
    isLockedToProd = true;

    // Smooth scroll back up to the top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Hide top banner as requested (remove green banner)
    if (topBanner) topBanner.classList.add('hidden');

    // Minimize QA Console HUD into a compact pill
    if (consoleHud) consoleHud.classList.add('minimized');

    // Show completion modal after scroll initiates
    setTimeout(() => {
      if (modalOverlay) modalOverlay.classList.add('active');
    }, 400);
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
