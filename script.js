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

  /* ── 1. CUSTOM CURSOR (GPU Accelerated & Touch Safe) ──────────────── */
  const cursorDot  = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const spotlight  = document.getElementById('cursor-spotlight');
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  if (isTouchDevice) {
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
    if (spotlight) spotlight.style.display = 'none';
    document.body.style.cursor = 'auto';
  } else {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;
    const lerpFactor = 0.16;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function animateCursor() {
      if (cursorDot) {
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      ringX += (mouseX - ringX) * lerpFactor;
      ringY += (mouseY - ringY) * lerpFactor;
      if (cursorRing) {
        cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      if (spotlight) {
        spotlight.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    const interactiveEls = document.querySelectorAll(
      'a, button, .btn, .tab-btn, .glass-card, .tag, .action-link, .contact-info a, .filter-btn'
    );
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'), { passive: true });
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'), { passive: true });
    });

    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'), { passive: true });
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'), { passive: true });
    document.addEventListener('mouseleave', () => {
      if (cursorDot)  cursorDot.style.opacity  = '0';
      if (cursorRing) cursorRing.style.opacity = '0';
      if (spotlight)  spotlight.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      if (cursorDot)  cursorDot.style.opacity  = '1';
      if (cursorRing) cursorRing.style.opacity = '1';
      if (spotlight)  spotlight.style.opacity = '1';
    });
  }


  /* ── 2. HONEYCOMB BACKGROUND (Precomputed Vertices & Pausable) ───────── */
  const canvas = document.getElementById('aurora-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d', { alpha: true });
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const hexRadius = 40;
    const hexWidth = Math.sqrt(3) * hexRadius;
    const hexHeight = 2 * hexRadius;
    const yOffset = hexHeight * 0.75;
    let hexagons = [];

    // Precalculate hexagon vertex offsets once to avoid thousands of Math.cos/sin per frame
    const hexOffsets = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - (Math.PI / 6);
      hexOffsets.push({
        x: hexRadius * Math.cos(angle),
        y: hexRadius * Math.sin(angle)
      });
    }

    class Hexagon {
      constructor(x, y, row, col) {
        this.x = x;
        this.y = y;
        this.row = row;
        this.col = col;
        this.baseOpacity = Math.random() * 0.1;
        this.pulseSpeed = 0.005 + Math.random() * 0.01;
        this.phase = Math.random() * Math.PI * 2;
        this.floatSpeed = 0.5 + Math.random() * 1;
        this.floatOffset = Math.random() * Math.PI * 2;
      }

      draw(ctx, time) {
        const opacity = this.baseOpacity + (Math.sin(time * this.pulseSpeed + this.phase) * 0.08);
        if (opacity <= 0.01) return;
        
        const currentY = this.y + Math.sin(time * 0.002 * this.floatSpeed + this.floatOffset) * 10;

        ctx.beginPath();
        ctx.moveTo(this.x + hexOffsets[0].x, currentY + hexOffsets[0].y);
        for (let i = 1; i < 6; i++) {
          ctx.lineTo(this.x + hexOffsets[i].x, currentY + hexOffsets[i].y);
        }
        ctx.closePath();

        ctx.strokeStyle = `rgba(0, 243, 255, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        if (opacity > 0.15) {
          ctx.fillStyle = `rgba(0, 102, 255, ${opacity * 0.2})`;
          ctx.fill();
        }
      }
    }

    function initHexGrid() {
      hexagons = [];
      const cols = Math.ceil(W / hexWidth) + 1;
      const rows = Math.ceil(H / yOffset) + 1;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          let x = col * hexWidth;
          let y = row * yOffset;
          if (row % 2 !== 0) {
            x += hexWidth / 2;
          }
          if (Math.random() > 0.3) {
            hexagons.push(new Hexagon(x, y, row, col));
          }
        }
      }
    }

    initHexGrid();

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        initHexGrid();
      }, 100);
    }, { passive: true });

    let canvasAnimId = null;
    function drawHoneycomb(time) {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < hexagons.length; i++) {
        hexagons[i].draw(ctx, time);
      }
      canvasAnimId = requestAnimationFrame(drawHoneycomb);
    }

    canvasAnimId = requestAnimationFrame(drawHoneycomb);

    // Stop canvas animation completely when document is hidden to save 100% CPU/GPU
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (canvasAnimId) cancelAnimationFrame(canvasAnimId);
        canvasAnimId = null;
      } else if (!canvasAnimId) {
        canvasAnimId = requestAnimationFrame(drawHoneycomb);
      }
    });
  }



  /* ── 3. NAVBAR SCROLL EFFECT & MOBILE MENU ──────────────────── */
  const navbar = document.querySelector('.navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu');
  const navLinksContainer = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
    });

    const links = navLinksContainer.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
      });
    });
  }


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
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(s => scrollObserver.observe(s));


  /* ── 5. SCROLL REVEAL ANIMATIONS (CSS Class-Based, Zero Jank) ── */
  const animItems = document.querySelectorAll('.animate-item');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.05
  });

  setTimeout(() => animItems.forEach(item => revealObserver.observe(item)), 2400);


  /* ── 6. CARD MOUSE-REACTIVE GLOW (Throttled & Cached Rects) ─── */
  document.querySelectorAll('.glass-card').forEach(card => {
    let rect = null;
    let ticking = false;

    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
    }, { passive: true });

    card.addEventListener('mousemove', e => {
      if (!rect) rect = card.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (!ticking) {
        requestAnimationFrame(() => {
          if (rect) {
            card.style.setProperty('--mouse-x', `${clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${clientY - rect.top}px`);
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      rect = null;
    }, { passive: true });
  });


  /* ── 7. MAGNETIC BUTTON EFFECT (Smooth & Safe) ───────────────── */
  document.querySelectorAll('.btn, .tab-btn').forEach(btn => {
    let rect = null;
    btn.addEventListener('mouseenter', () => {
      rect = btn.getBoundingClientRect();
    }, { passive: true });
    btn.addEventListener('mousemove', e => {
      if (!rect) rect = btn.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width  / 2)) * 0.22;
      const dy = (e.clientY - (rect.top  + rect.height / 2)) * 0.22;
      btn.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    }, { passive: true });
    btn.addEventListener('mouseleave', () => {
      rect = null;
      btn.style.transform = '';
    }, { passive: true });
  });


  /* ── 7.1. PROJECT CATEGORY FILTER (Smooth Transition & Dynamic Counts) ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    // Dynamically update count badges from DOM elements
    const compCount = document.querySelectorAll('.project-card[data-category="competition"]').length;
    const clientCount = document.querySelectorAll('.project-card[data-category="client"]').length;
    const allCount = projectCards.length;

    const allPill = document.querySelector('.filter-btn[data-filter="all"] .filter-count');
    const compPill = document.querySelector('.filter-btn[data-filter="competition"] .filter-count');
    const clientPill = document.querySelector('.filter-btn[data-filter="client"] .filter-count');

    if (allPill) allPill.textContent = allCount;
    if (compPill) compPill.textContent = compCount;
    if (clientPill) clientPill.textContent = clientCount;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetFilter = btn.getAttribute('data-filter');
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (targetFilter === 'all' || category === targetFilter) {
            card.classList.remove('filter-hidden');
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px) translateZ(0)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.35s ease, transform 0.35s var(--ease-spring)';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) translateZ(0)';
            });
          } else {
            card.classList.add('filter-hidden');
          }
        });
      });
    });
  }


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

  // Click on text links to open lightbox (for local images)
  document.querySelectorAll('.lightbox-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const src = link.getAttribute('data-img');
      const alt = link.getAttribute('data-alt') || '';
      if (src) openLightbox(src, alt);
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