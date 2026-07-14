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


  /* ── 2. GRADIENT WAVE BACKGROUND ────────────────────────────── */
  //
  //  Six sine-wave layers flow across the canvas at different speeds,
  //  frequencies, and phases. Each layer is a filled path that peaks
  //  in colour at the wave crest and fades to transparent below,
  //  creating the appearance of glowing aurora-style wave bands.
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

    // ── Wave layer definitions ───────────────────────────────────
    // baseY  : vertical centre of wave as a fraction of canvas H
    // amp    : sine amplitude as a fraction of H
    // freq   : spatial frequency in radians per pixel
    // phase  : starting phase (radians) — staggered for variety
    // speed  : phase advance per millisecond (controls flow speed)
    // hue    : CSS hue (locked to blue–violet–cyan range)
    // sat    : saturation %
    // alpha  : peak opacity at the wave crest
    const WAVES = [
      { baseY: 0.88, amp: 0.08, freq: 0.0016, phase: 0.00, speed: 0.000200, hue: 215, sat: 88, alpha: 0.40 },
      { baseY: 0.74, amp: 0.07, freq: 0.0022, phase: 1.57, speed: 0.000320, hue: 200, sat: 92, alpha: 0.32 },
      { baseY: 0.60, amp: 0.10, freq: 0.0014, phase: 3.14, speed: 0.000165, hue: 228, sat: 84, alpha: 0.28 },
      { baseY: 0.46, amp: 0.07, freq: 0.0027, phase: 4.71, speed: 0.000400, hue: 250, sat: 80, alpha: 0.22 },
      { baseY: 0.31, amp: 0.08, freq: 0.0018, phase: 0.78, speed: 0.000255, hue: 196, sat: 90, alpha: 0.18 },
      { baseY: 0.16, amp: 0.06, freq: 0.0021, phase: 2.36, speed: 0.000290, hue: 218, sat: 82, alpha: 0.13 },
    ];

    let lastTime = 0;

    function drawWaves(ts) {
      const dt = Math.min(ts - lastTime, 50); // cap delta to avoid jumps after tab switch
      lastTime = ts;

      ctx.clearRect(0, 0, W, H);

      // Paint from bottommost wave upward (painter's algorithm).
      // Waves are already sorted bottom → top by baseY descending.
      const ordered = [...WAVES].sort((a, b) => b.baseY - a.baseY);

      ordered.forEach(wave => {
        // Advance phase — this drives the horizontal flow
        wave.phase += wave.speed * dt;

        const peakY = wave.baseY * H;
        const ampPx = wave.amp * H;

        // ── Build the filled wave path ─────────────────────────
        ctx.beginPath();

        // Start at left edge at wave's current y
        ctx.moveTo(0, peakY + ampPx * Math.sin(wave.phase));

        // Trace sine curve across the full width (step every 4px for perf)
        for (let x = 4; x <= W; x += 4) {
          ctx.lineTo(x, peakY + ampPx * Math.sin(x * wave.freq + wave.phase));
        }

        // Close path down to the canvas bottom-left corner
        ctx.lineTo(W, H);
        ctx.lineTo(0, H);
        ctx.closePath();

        // ── Vertical gradient: bright at crest, transparent below ─
        // gradTop is slightly above the peak so the colour fully fades in
        const gradTop = peakY - ampPx * 1.8;
        const grad = ctx.createLinearGradient(0, gradTop, 0, H);
        grad.addColorStop(0.00, `hsla(${wave.hue}, ${wave.sat}%, 62%, 0)`);
        grad.addColorStop(0.10, `hsla(${wave.hue}, ${wave.sat}%, 62%, ${wave.alpha})`);
        grad.addColorStop(0.38, `hsla(${wave.hue}, ${wave.sat}%, 54%, ${+(wave.alpha * 0.28).toFixed(3)})`);
        grad.addColorStop(1.00, `hsla(${wave.hue}, ${wave.sat}%, 44%, 0)`);

        ctx.fillStyle = grad;
        ctx.fill();
      });

      requestAnimationFrame(drawWaves);
    }

    requestAnimationFrame(drawWaves);
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