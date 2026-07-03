/* ============================================================
   KANAGA PRASATH — MNC GRADE PORTFOLIO
   JavaScript: Aurora Canvas | Custom Cursor | Reactive Effects
   ============================================================ */

/* ── PAGE INTRO LOADER ─────────────────────────────────────────────────
   IIFE — runs immediately when script.js is parsed.
   The loader HTML is at the top of <body>, so all elements
   already exist in the DOM when this script tag is reached.

   Animation timeline:
     300ms  → image fades in  (spring pop)
     700ms  → ring lights up clockwise
    ~2000ms → ring fully lit  (700 + 1300ms fill anim)
    2300ms  → center swells then collapses to nothing
    2550ms  → overlay dissolves (bg→transparent + blur, then opacity→0)
    3500ms  → element removed, body.page-loaded added
————————————————————————————————————————————————————— */
(function initLoader() {
  const loader = document.getElementById('loader');
  const center = document.getElementById('loader-center');
  if (!loader || !center) return;

  // Phase 1: Portrait image fades in with spring pop
  setTimeout(() => center.classList.add('img-in'),    300);

  // Phase 2: Ring lights up clockwise from 12 o’clock
  setTimeout(() => center.classList.add('ring-in'),   700);

  // Phase 3: Brief swell then collapse to nothing
  // (ring fill completes at ~2000ms; 300ms hold then shrink)
  setTimeout(() => center.classList.add('shrink-out'), 2300);

  // Phase 4: Overlay dissolves — black bg → transparent+blur → opacity 0
  // The CSS transition on #loader handles the blur-to-clear reveal
  setTimeout(() => loader.classList.add('lb-exit'), 2550);

  // Phase 5: Remove from DOM once fully invisible
  setTimeout(() => {
    loader.remove();
    document.body.classList.add('page-loaded');
  }, 3500);
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. CUSTOM CURSOR ─────────────────────────────────────── */
  const cursorDot  = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const spotlight  = document.getElementById('cursor-spotlight');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX  = mouseX;
  let ringY  = mouseY;

  const lerpFactor = 0.14;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    if (cursorDot) {
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';
    }
    ringX += (mouseX - ringX) * lerpFactor;
    ringY += (mouseY - ringY) * lerpFactor;
    if (cursorRing) {
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
    }
    if (spotlight) {
      spotlight.style.left = mouseX + 'px';
      spotlight.style.top  = mouseY + 'px';
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const interactiveEls = document.querySelectorAll(
    'a, button, .btn, .tab-btn, .glass-card, .tag, .action-link, .contact-info a'
  );
  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
  document.addEventListener('mouseleave', () => {
    if (cursorDot)  cursorDot.style.opacity  = '0';
    if (cursorRing) cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    if (cursorDot)  cursorDot.style.opacity  = '1';
    if (cursorRing) cursorRing.style.opacity = '1';
  });


  /* ── 2. AURORA CANVAS — BLUE-ONLY SCROLL PATTERN SYSTEM ─────── */
  //
  //  COLOR:   Locked to blue / cyan / indigo tones (hue 195–232).
  //           Color NEVER changes.
  //
  //  PATTERN: On scroll the SIZE, POSITION, and ARRANGEMENT of the
  //           5 gradient orbs morphs into a totally different shape
  //           for each section. Brightness is high & visible.
  //
  const canvas = document.getElementById('aurora-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    });

    /* ─────────────────────────────────────────────────────────────
       SCROLL PATTERN TABLE — each row = one section's orb layout
       x, y : centre position (0–1 of screen width/height)
       r    : radius (fraction of the shorter screen dimension)
       a    : opacity / brightness  ← boosted for visibility
    ─────────────────────────────────────────────────────────────── */
    const PATTERNS = [

      // 0 · HOME — Two giant orbs anchored top-left & bottom-right,
      //             small bright core in centre
      [
        { x: 0.02, y: 0.02, r: 0.60, a: 0.60 },   // huge top-left
        { x: 0.98, y: 0.95, r: 0.55, a: 0.55 },   // huge bottom-right
        { x: 0.50, y: 0.50, r: 0.22, a: 0.45 },   // bright centre
        { x: 0.82, y: 0.12, r: 0.20, a: 0.35 },   // accent top-right
        { x: 0.14, y: 0.85, r: 0.20, a: 0.35 },   // accent bottom-left
      ],

      // 1 · EDUCATION — Diagonal stripe: top-right → bottom-left
      [
        { x: 0.92, y: 0.04, r: 0.52, a: 0.58 },   // top-right anchor
        { x: 0.64, y: 0.32, r: 0.35, a: 0.50 },   // upper-mid diagonal
        { x: 0.36, y: 0.62, r: 0.35, a: 0.50 },   // lower-mid diagonal
        { x: 0.08, y: 0.94, r: 0.52, a: 0.58 },   // bottom-left anchor
        { x: 0.50, y: 0.50, r: 0.15, a: 0.38 },   // centre spark
      ],

      // 2 · WORK — Equilateral triangle: top-left, top-right, bottom-centre
      [
        { x: 0.05, y: 0.06, r: 0.48, a: 0.56 },   // top-left
        { x: 0.95, y: 0.06, r: 0.48, a: 0.56 },   // top-right
        { x: 0.50, y: 0.94, r: 0.52, a: 0.58 },   // bottom centre
        { x: 0.50, y: 0.38, r: 0.18, a: 0.38 },   // inner centre
        { x: 0.50, y: 0.62, r: 0.13, a: 0.30 },   // lower spark
      ],

      // 3 · SKILLS — Single massive central bloom (concentric rings)
      [
        { x: 0.50, y: 0.50, r: 0.75, a: 0.48 },   // vast outer halo
        { x: 0.50, y: 0.50, r: 0.45, a: 0.55 },   // mid ring
        { x: 0.50, y: 0.50, r: 0.22, a: 0.65 },   // bright inner core
        { x: 0.20, y: 0.20, r: 0.18, a: 0.32 },   // corner spark
        { x: 0.80, y: 0.80, r: 0.18, a: 0.32 },   // corner spark
      ],

      // 4 · PROJECTS — Horizontal glowing band across middle
      [
        { x: 0.06, y: 0.50, r: 0.46, a: 0.58 },   // left anchor
        { x: 0.50, y: 0.50, r: 0.40, a: 0.52 },   // centre
        { x: 0.94, y: 0.50, r: 0.46, a: 0.58 },   // right anchor
        { x: 0.28, y: 0.18, r: 0.22, a: 0.35 },   // top-left accent
        { x: 0.72, y: 0.82, r: 0.22, a: 0.35 },   // bottom-right accent
      ],

      // 5 · AWARDS — Four corners + blazing centre star
      [
        { x: 0.06, y: 0.06, r: 0.40, a: 0.52 },   // top-left corner
        { x: 0.94, y: 0.06, r: 0.40, a: 0.52 },   // top-right corner
        { x: 0.06, y: 0.94, r: 0.40, a: 0.52 },   // bottom-left corner
        { x: 0.94, y: 0.94, r: 0.40, a: 0.52 },   // bottom-right corner
        { x: 0.50, y: 0.50, r: 0.30, a: 0.65 },   // centre blazing star
      ],
    ];

    // Fixed blue/cyan/indigo hue per orb — never changes
    const BLUE_HUES = [218, 200, 232, 208, 222];

    // Live lerped orb state — starts at HOME pattern
    const orbs = PATTERNS[0].map((p, i) => ({
      tx: p.x, ty: p.y, tr: p.r, ta: p.a,  // targets
      cx: p.x, cy: p.y, cr: p.r, ca: p.a,  // current (displayed)
      hue: BLUE_HUES[i],
      phase: i * 1.15,
      speed: 0.000045 + i * 0.000008,
    }));

    // ── Scroll state ────────────────────────────────────────────
    let fromIdx = 0, toIdx = 0, blendT = 0;

    function onScroll() {
      const secs  = document.querySelectorAll('.scroll-section');
      const total = secs.length;
      let closestIdx = 0, closestDist = Infinity;

      secs.forEach((sec, i) => {
        const dist = Math.abs(sec.getBoundingClientRect().top - window.innerHeight * 0.38);
        if (dist < closestDist) { closestDist = dist; closestIdx = i; }
      });

      const cur  = secs[closestIdx];
      const next = secs[Math.min(closestIdx + 1, total - 1)];
      const prev = secs[Math.max(closestIdx - 1, 0)];

      if (cur.getBoundingClientRect().top > window.innerHeight * 0.38 && closestIdx > 0) {
        const fromTop = prev.getBoundingClientRect().top;
        const toTop   = cur.getBoundingClientRect().top;
        const span    = toTop - fromTop;
        fromIdx = Math.max(closestIdx - 1, 0);
        toIdx   = closestIdx;
        blendT  = span ? Math.min(Math.max((window.innerHeight * 0.38 - fromTop) / span, 0), 1) : 1;
      } else {
        const fromTop = cur.getBoundingClientRect().top;
        const toTop   = next.getBoundingClientRect().top;
        const span    = toTop - fromTop;
        fromIdx = closestIdx;
        toIdx   = Math.min(closestIdx + 1, total - 1);
        blendT  = span ? Math.min(Math.max((window.innerHeight * 0.38 - fromTop) / span, 0), 1) : 0;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const lerp = (a, b, t) => a + (b - a) * t;
    const ORB_SPEED = 0.06; // how fast orbs move toward target pattern

    // ── Draw loop ───────────────────────────────────────────────
    let lastTime = 0;
    function drawAurora(ts) {
      const dt = Math.min(ts - lastTime, 50);
      lastTime = ts;
      ctx.clearRect(0, 0, W, H);

      const fp = PATTERNS[Math.min(fromIdx, PATTERNS.length - 1)];
      const tp = PATTERNS[Math.min(toIdx,   PATTERNS.length - 1)];

      orbs.forEach((orb, i) => {
        orb.phase += orb.speed * dt;

        // Set targets = blend of two section patterns
        orb.tx = lerp(fp[i].x, tp[i].x, blendT);
        orb.ty = lerp(fp[i].y, tp[i].y, blendT);
        orb.tr = lerp(fp[i].r, tp[i].r, blendT);
        orb.ta = lerp(fp[i].a, tp[i].a, blendT);

        // Smoothly chase targets
        orb.cx = lerp(orb.cx, orb.tx, ORB_SPEED);
        orb.cy = lerp(orb.cy, orb.ty, ORB_SPEED);
        orb.cr = lerp(orb.cr, orb.tr, ORB_SPEED);
        orb.ca = lerp(orb.ca, orb.ta, ORB_SPEED);

        // Gentle drift on top of pattern position
        const driftX = Math.sin(orb.phase * 0.8 + i) * 0.025;
        const driftY = Math.cos(orb.phase * 0.6 + i) * 0.025;

        const px = (orb.cx + driftX) * W;
        const py = (orb.cy + driftY) * H;
        const r  = orb.cr * Math.min(W, H);

        // Radial gradient — blue tones only, boosted brightness
        const g = ctx.createRadialGradient(px, py, 0, px, py, r);
        g.addColorStop(0,    `hsla(${orb.hue}, 90%, 58%, ${orb.ca})`);
        g.addColorStop(0.30, `hsla(${orb.hue}, 82%, 42%, ${(orb.ca * 0.60).toFixed(3)})`);
        g.addColorStop(0.65, `hsla(${orb.hue}, 72%, 28%, ${(orb.ca * 0.22).toFixed(3)})`);
        g.addColorStop(1,    `hsla(${orb.hue}, 60%, 16%, 0.000)`);

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(drawAurora);
    }

    requestAnimationFrame(drawAurora);
  }


  /* ── 3. NAVBAR SCROLL EFFECT ────────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });


  /* ── 4. SCROLLSPY (Active Nav Highlight) ─────────────────────── */
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('.scroll-section');

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const id = entry.target.getAttribute('id');
        const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
          if (window.innerWidth <= 850) {
            activeLink.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          }
        }
      }
    });
  }, {
    root: null,
    rootMargin: '-40% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(s => scrollObserver.observe(s));


  /* ── 5. SCROLL REVEAL ANIMATIONS ────────────────────────────── */
  const animItems = document.querySelectorAll('.animate-item');

  animItems.forEach(item => {
    item.style.opacity   = '0';
    item.style.transform = 'translateY(28px)';
    item.style.transition = 'none';
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.transition =
            'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.08
  });

  // Delay observation until loader begins dissolving so scroll-reveal
  // animations fire just as the blurred overlay clears — creating the
  // "elements light up with blur" effect the user sees.
  setTimeout(() => animItems.forEach(item => revealObserver.observe(item)), 2800);


  /* ── 6. CARD MOUSE-REACTIVE GLOW ────────────────────────────── */
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });


  /* ── 7. MAGNETIC BUTTON EFFECT ───────────────────────────────── */
  document.querySelectorAll('.btn, .tab-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx   = (e.clientX - (rect.left + rect.width  / 2)) * 0.25;
      const dy   = (e.clientY - (rect.top  + rect.height / 2)) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });


  /* ── 8. TAG RIPPLE CLICK EFFECT ──────────────────────────────── */
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', e => {
      const ripple = document.createElement('span');
      const rect   = tag.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute; border-radius:50%; pointer-events:none;
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
        background:rgba(255,255,255,0.22);
        transform:scale(0); animation:rippleAnim 0.5s ease forwards;
      `;
      tag.style.position = 'relative';
      tag.style.overflow = 'hidden';
      tag.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `@keyframes rippleAnim { to { transform:scale(2.5); opacity:0; } }`;
  document.head.appendChild(rippleStyle);


  /* ── 9. HERO TYPING EFFECT ───────────────────────────────────── */
  const subtitle = document.querySelector('.hero .subtitle');
  if (subtitle) {
    const roles = [
      'Full Stack Developer',
      'IoT Engineer',
      'AI/ML Enthusiast',
      'Open Source Builder'
    ];
    let roleIdx = 0, charIdx = 0, deleting = false;

    function typeRole() {
      const current = roles[roleIdx];
      if (!deleting && charIdx <= current.length) {
        subtitle.textContent = current.substring(0, charIdx) + (charIdx < current.length ? '|' : ' ▌');
        charIdx++;
        setTimeout(typeRole, charIdx === current.length + 1 ? 1500 : 70);
      } else if (deleting && charIdx >= 0) {
        subtitle.textContent = current.substring(0, charIdx) + '|';
        charIdx--;
        setTimeout(typeRole, 40);
      } else if (!deleting) {
        deleting = true;
        setTimeout(typeRole, 800);
      } else {
        deleting = false; charIdx = 0;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(typeRole, 300);
      }
    }
    setTimeout(typeRole, 1200);
  }


  /* ── 10. STATS COUNTER ANIMATION ────────────────────────────── */
  const statValues = document.querySelectorAll('.stat span');
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.trim();
      const num = parseFloat(raw);
      if (isNaN(num)) return;
      const isFloat   = raw.includes('.');
      const suffix    = raw.replace(/[\d.]/g, '');
      const dur       = 1200;
      const startTime = performance.now();
      function animate(now) {
        const p = Math.min((now - startTime) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (isFloat ? (num * eased).toFixed(1) : Math.round(num * eased)) + suffix;
        if (p < 1) requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  statValues.forEach(v => counterObserver.observe(v));


  /* ── 11. IMAGE LIGHTBOX ──────────────────────────────────────── */
  const lbOverlay  = document.getElementById('lightbox-overlay');
  const lbImg      = document.getElementById('lightbox-img');
  const lbCaption  = document.getElementById('lightbox-caption');
  const lbBackBtn  = document.getElementById('lightbox-back-btn');

  let lbCloseTimer = null;
  const CLOSE_DURATION = 380; // ms — must match CSS transition

  function openLightbox(src, alt) {
    // Populate content
    lbImg.src = src;
    lbImg.alt = alt || '';
    lbCaption.textContent = alt || '';

    // Lock scroll
    document.body.classList.add('lb-open');

    // Trigger open animation
    lbOverlay.classList.remove('closing');
    lbOverlay.classList.add('open');
  }

  function closeLightbox() {
    if (lbCloseTimer) return; // already closing
    lbOverlay.classList.add('closing');
    lbOverlay.classList.remove('open');
    document.body.classList.remove('lb-open');

    lbCloseTimer = setTimeout(() => {
      lbOverlay.classList.remove('closing');
      lbImg.src = '';
      lbCaption.textContent = '';
      lbCloseTimer = null;
    }, CLOSE_DURATION);
  }

  // Click on any .dummy-img-wide to open
  document.querySelectorAll('.dummy-img-wide').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const img = wrap.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  // Back button
  lbBackBtn.addEventListener('click', closeLightbox);

  // Click backdrop (outside the card) to close
  lbOverlay.addEventListener('click', e => {
    if (e.target === lbOverlay) closeLightbox();
  });

  // Escape key to close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lbOverlay.classList.contains('open')) {
      closeLightbox();
    }
  });

});