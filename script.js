/* ============================================================
   KANAGA PRASATH — HIGH-END ARCHITECTURAL & TOPOGRAPHIC PORTFOLIO
   JavaScript: Dynamic Topographic Canvas | 3D Tilt | Curtain Menu | 60fps UX
   ============================================================ */

/* ── 0. PAGE INTRO LOADER ────────────────────────────────────────────── */
(function initLoader() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  const loader = document.getElementById('loader');
  const center = document.getElementById('loader-center');
  if (!loader || !center) return;

  setTimeout(() => center.classList.add('img-in'), 300);
  setTimeout(() => center.classList.add('ring-in'), 700);
  setTimeout(() => center.classList.add('shrink-out'), 2300);
  setTimeout(() => loader.classList.add('lb-exit'), 2550);
  setTimeout(() => {
    loader.remove();
    document.body.classList.add('page-loaded');
  }, 3400);
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. SCROLL PROGRESS INDICATOR ───────────────────────────────── */
  const scrollProgressBar = document.getElementById('scroll-progress');
  let scrollTicking = false;

  function updateScrollProgress() {
    if (!scrollProgressBar) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min((window.scrollY / docHeight) * 100, 100) : 0;
    scrollProgressBar.style.width = `${progress}%`;
    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(updateScrollProgress);
      scrollTicking = true;
    }
  }, { passive: true });

  updateScrollProgress();


  /* ── 2. PRECISION ARCHITECTURAL CURSOR ──────────────────────────── */
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
    const lerpFactor = 0.18;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function renderCursor() {
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
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    function bindCursorHovers() {
      const interactiveEls = document.querySelectorAll(
        'a, button, .btn, .tab-btn, .glass-card, .tag, .action-link, .contact-info a, .filter-btn, .dummy-img-wide, .lightbox-link, .hamburger-btn, .menu-close-btn'
      );
      interactiveEls.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'), { passive: true });
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'), { passive: true });
      });
    }
    bindCursorHovers();

    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'), { passive: true });
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'), { passive: true });

    document.addEventListener('mouseleave', () => {
      if (cursorDot)  cursorDot.style.opacity  = '0';
      if (cursorRing) cursorRing.style.opacity = '0';
      if (spotlight)  spotlight.style.opacity  = '0';
    });
    document.addEventListener('mouseenter', () => {
      if (cursorDot)  cursorDot.style.opacity  = '1';
      if (cursorRing) cursorRing.style.opacity = '1';
      if (spotlight)  spotlight.style.opacity  = '1';
    });
  }


  /* ── 3. ORGANIC TOPOGRAPHIC CONTOUR MAP ENGINE (PC SCROLL & MOBILE TOUCH REACTIVE) ── */
  const canvas = document.getElementById('aurora-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d', { alpha: true });
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    let targetMouseX = W * 0.5;
    let targetMouseY = H * 0.35;
    let curMouseX = targetMouseX;
    let curMouseY = targetMouseY;
    let isTouching = false;

    // Real-time scroll physics & inertia
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let totalScrollOffset = window.scrollY;

    // Desktop & General scroll handler
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScrollY;
      scrollVelocity += delta * 0.12;
      totalScrollOffset = currentScroll;
      lastScrollY = currentScroll;
    }, { passive: true });

    // Desktop Mouse Wheel handler for instant reactive momentum
    window.addEventListener('wheel', (e) => {
      scrollVelocity += e.deltaY * 0.05;
    }, { passive: true });

    // Desktop Mouse tracking
    document.addEventListener('mousemove', (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    }, { passive: true });

    // Mobile Touch tracking: Instant drag & scroll warp
    let touchStartY = 0;
    let touchLastY = 0;

    window.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 0) {
        isTouching = true;
        touchStartY = e.touches[0].clientY;
        touchLastY = touchStartY;
        targetMouseX = e.touches[0].clientX;
        targetMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 0) {
        const clientY = e.touches[0].clientY;
        const clientX = e.touches[0].clientX;
        const deltaY = clientY - touchLastY;
        touchLastY = clientY;
        targetMouseX = clientX;
        targetMouseY = clientY;
        // Direct touch velocity injection for real-time mobile contour ripple
        scrollVelocity -= deltaY * 0.22;
        totalScrollOffset = window.scrollY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isTouching = false;
    }, { passive: true });

    // Authentic cartographic elevation levels for major index contours
    const elevationTags = ['▲ 200m', '▲ 280m', '▲ 360m', '▲ 440m', '▲ 520m', '▲ 600m', '▲ 680m', '▲ 760m', '▲ 840m'];

    let animId = null;
    let startTime = performance.now();

    const numContours = 28;

    function renderTopographicMap(now) {
      const time = now - startTime;
      ctx.clearRect(0, 0, W, H);

      // Smooth cursor lerping
      curMouseX += (targetMouseX - curMouseX) * 0.08;
      curMouseY += (targetMouseY - curMouseY) * 0.08;

      // Exponential decay of scroll velocity momentum
      scrollVelocity *= 0.92;

      // ── Precision Cartographic Corner Graticule Crosshairs ──
      ctx.strokeStyle = 'rgba(70, 130, 180, 0.22)';
      ctx.lineWidth = 1;
      const ch = 7;
      // Top Left
      ctx.beginPath();
      ctx.moveTo(28 - ch, 28); ctx.lineTo(28 + ch, 28);
      ctx.moveTo(28, 28 - ch); ctx.lineTo(28, 28 + ch);
      // Top Right
      ctx.moveTo(W - 28 - ch, 28); ctx.lineTo(W - 28 + ch, 28);
      ctx.moveTo(W - 28, 28 - ch); ctx.lineTo(W - 28, 28 + ch);
      // Bottom Left
      ctx.moveTo(28 - ch, H - 28); ctx.lineTo(28 + ch, H - 28);
      ctx.moveTo(28, H - 28 - ch); ctx.lineTo(28, H - 28 + ch);
      // Bottom Right
      ctx.moveTo(W - 28 - ch, H - 28); ctx.lineTo(W - 28 + ch, H - 28);
      ctx.moveTo(W - 28, H - 28 - ch); ctx.lineTo(W - 28, H - 28 + ch);
      ctx.stroke();

      // Precision Geodetic Quadrangle Legend
      ctx.font = '600 8.5px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(70, 130, 180, 0.38)';
      ctx.fillText('12°41\'24" N • 79°58\'48" E', 42, 31);
      ctx.fillText('ELEVATION DATUM: WGS84 • CONTOUR INTERVAL: 40m', W - 280, 31);

      // ── Flowing MNC-Grade Topographic Elevation Contours ──
      const step = W < 768 ? 16 : 12; // High-resolution horizontal stepping
      const extraMargin = 160;

      for (let i = 0; i < numContours; i++) {
        const isMajor = (i % 4 === 0);
        const isIntermediate = (i % 2 === 0);

        // Styling based on cartographic hierarchy
        if (isMajor) {
          ctx.strokeStyle = 'rgba(70, 130, 180, 0.44)'; // Steel Blue Major Index Contour
          ctx.lineWidth = 1.6;
        } else if (isIntermediate) {
          ctx.strokeStyle = 'rgba(2, 132, 199, 0.28)'; // Deep Sky Blue Intermediate Contour
          ctx.lineWidth = 1.1;
        } else {
          ctx.strokeStyle = 'rgba(71, 85, 105, 0.16)'; // Slate Blue Fine Contour
          ctx.lineWidth = 0.85;
        }

        // Base vertical distribution with smooth wrap-around for scrolling
        const spanH = H + extraMargin * 2;
        const normalizedY = ((i / numContours) * spanH + (totalScrollOffset * 0.45)) % spanH;
        const baseY = normalizedY - extraMargin;

        ctx.beginPath();

        let labelDrawn = false;
        // Stagger label placement across lines for natural cartographic aesthetic
        const labelTargetX = W * 0.18 + ((i * 127) % Math.floor(W * 0.65));

        for (let x = -30; x <= W + 30; x += step) {
          // 1. Natural diagonal architectural terrain sweep (breaks parallel horizontal look)
          const terrainAngle = Math.sin((x / W) * Math.PI * 0.85 + (i * 0.12)) * (H * 0.08);

          // 2. Multi-octave natural landscape elevation harmonics (ridges, valleys, saddles)
          const h1 = Math.sin(x * 0.0018 + baseY * 0.0024 + time * 0.00028 + i * 0.25) * 44;
          const h2 = Math.cos(x * 0.0036 - baseY * 0.0016 - time * 0.00020 + i * 0.15) * 22;
          const h3 = Math.sin(x * 0.0072 + baseY * 0.0038) * 9;

          // 3. Real-time scroll momentum dynamic wave
          const scrollPulse = Math.sin((x * 0.0022 + baseY * 0.0015) + (totalScrollOffset * 0.0025)) * (scrollVelocity * 0.7);

          // 4. Interactive Cursor / Touch Repulsion & Refraction (smooth Gaussian lens, NO attached lines)
          const dx = x - curMouseX;
          const approxY = baseY + terrainAngle + h1 + h2;
          const dy = approxY - curMouseY;
          const distSq = dx * dx + dy * dy;
          const maxInfluence = 220;

          let mouseDispY = 0;
          let mouseDispX = 0;

          if (distSq < maxInfluence * maxInfluence) {
            const dist = Math.sqrt(distSq);
            // Smooth Gaussian bell-curve falloff
            const gauss = Math.exp(-distSq / (2 * 70 * 70));
            const force = gauss * 46;
            mouseDispY = (dy / (dist + 1)) * force;
            mouseDispX = (dx / (dist + 1)) * (force * 0.4);
          }

          const curX = x + mouseDispX;
          const curY = baseY + terrainAngle + h1 + h2 + h3 + scrollPulse + mouseDispY;

          if (x === -30) {
            ctx.moveTo(curX, curY);
          } else {
            ctx.lineTo(curX, curY);
          }

          // Render elevation text tag along major index contour lines
          if (isMajor && !labelDrawn && x >= labelTargetX && x < W - 80) {
            labelDrawn = true;
            ctx.stroke();

            const tagIdx = Math.floor(i / 4) % elevationTags.length;
            const tag = elevationTags[tagIdx];

            ctx.font = '600 9px "JetBrains Mono", monospace';
            ctx.fillStyle = 'rgba(44, 94, 138, 0.72)';
            ctx.fillText(tag, curX + 6, curY - 4);

            // Precision contour elevation tick mark
            ctx.beginPath();
            ctx.moveTo(curX, curY - 3);
            ctx.lineTo(curX, curY + 3);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(curX, curY);
          }
        }

        ctx.stroke();
      }

      animId = requestAnimationFrame(renderTopographicMap);
    }

    animId = requestAnimationFrame(renderTopographicMap);

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
      }, 100);
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animId) cancelAnimationFrame(animId);
        animId = null;
      } else if (!animId) {
        startTime = performance.now();
        animId = requestAnimationFrame(renderTopographicMap);
      }
    });
  }


  /* ── 4. CAPSULE NAVBAR & ARCHITECTURAL CURTAIN MENU ──────────────── */
  const navbar = document.getElementById('navbar');
  const menuToggleBtn = document.getElementById('menu-toggle');
  const menuCloseBtn = document.getElementById('menu-close-btn');
  const menuBackdrop = document.getElementById('menu-backdrop');
  const menuOverlay = document.getElementById('menu-overlay');

  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 24);
    }
  }, { passive: true });

  function openMenu() {
    if (!menuOverlay) return;
    menuOverlay.classList.add('open');
    menuOverlay.setAttribute('aria-hidden', 'false');
    if (menuToggleBtn) menuToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    if (!menuOverlay) return;
    menuOverlay.classList.remove('open');
    menuOverlay.setAttribute('aria-hidden', 'true');
    if (menuToggleBtn) menuToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  if (menuToggleBtn) menuToggleBtn.addEventListener('click', openMenu);
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);
  if (menuBackdrop) menuBackdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOverlay && menuOverlay.classList.contains('open')) {
      closeMenu();
    }
  });

  // Nav link click smooth navigation & auto-close
  const overlayLinks = document.querySelectorAll('.overlay-link');
  overlayLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      closeMenu();
      overlayLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });


  /* ── 5. SCROLLSPY (ACTIVE TAB HIGHLIGHT) ────────────────────────── */
  const sections = document.querySelectorAll('.scroll-section');

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        overlayLinks.forEach(link => link.classList.remove('active'));
        const id = entry.target.getAttribute('id');
        const activeLink = document.querySelector(`.overlay-link[href="#${id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }, {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(s => scrollObserver.observe(s));


  /* ── 6. SCROLL REVEAL ANIMATIONS ────────────────────────────────── */
  const animItems = document.querySelectorAll('.animate-item');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -30px 0px',
    threshold: 0.05
  });

  setTimeout(() => animItems.forEach(item => revealObserver.observe(item)), 2400);


  /* ── 7. CREATIVE 3D PERSPECTIVE TILT & SPECULAR GLARE ON CARDS ──── */
  document.querySelectorAll('.glass-card').forEach(card => {
    let rect = null;
    let ticking = false;

    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
      card.style.setProperty('--glare-opacity', '1');
    }, { passive: true });

    card.addEventListener('mousemove', e => {
      if (!rect) rect = card.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (!ticking) {
        requestAnimationFrame(() => {
          if (rect) {
            const relX = clientX - rect.left;
            const relY = clientY - rect.top;
            
            // Normalized offset from card center (-0.5 to 0.5)
            const xRatio = (relX / rect.width) - 0.5;
            const yRatio = (relY / rect.height) - 0.5;

            // 3D Tilt angles (maximum 8 degrees for elegant tactile feedback)
            const rotX = -yRatio * 8;
            const rotY = xRatio * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(8px)`;
            card.style.setProperty('--mouse-x', `${relX}px`);
            card.style.setProperty('--mouse-y', `${relY}px`);
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      rect = null;
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      card.style.setProperty('--glare-opacity', '0');
    }, { passive: true });
  });


  /* ── 8. MAGNETIC BUTTON EFFECT ──────────────────────────────────── */
  document.querySelectorAll('.btn, .hamburger-btn, .menu-close-btn').forEach(btn => {
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


  /* ── 9. PROJECT CATEGORY FILTER WITH DYNAMIC COUNTS ─────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (filterBtns.length > 0 && projectCards.length > 0) {
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
              card.style.transition = 'opacity 0.32s ease, transform 0.32s var(--ease-spring)';
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


  /* ── 10. REFINED TAG RIPPLE CLICK EFFECT ────────────────────────── */
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
        background:rgba(2, 132, 199, 0.18);
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


  /* ── 11. HERO ROLE TYPING EFFECT ────────────────────────────────── */
  const subtitle = document.querySelector('.hero .subtitle');
  if (subtitle) {
    const roles = [
      'Full Stack Developer',
      'IoT Systems Engineer',
      'AI/ML Integrations Specialist',
      'Open Source Builder'
    ];
    let roleIdx = 0, charIdx = 0, deleting = false;

    function typeRole() {
      const current = roles[roleIdx];
      if (!deleting && charIdx <= current.length) {
        subtitle.textContent = current.substring(0, charIdx) + (charIdx < current.length ? '|' : ' ▌');
        charIdx++;
        setTimeout(typeRole, charIdx === current.length + 1 ? 1600 : 70);
      } else if (deleting && charIdx >= 0) {
        subtitle.textContent = current.substring(0, charIdx) + '|';
        charIdx--;
        setTimeout(typeRole, 40);
      } else if (!deleting) {
        deleting = true;
        setTimeout(typeRole, 750);
      } else {
        deleting = false;
        charIdx = 0;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(typeRole, 320);
      }
    }
    setTimeout(typeRole, 1200);
  }


  /* ── 12. STATS COUNTER ANIMATION ────────────────────────────────── */
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


  /* ── 13. IMAGE LIGHTBOX MODAL ────────────────────────────────────── */
  const lbOverlay  = document.getElementById('lightbox-overlay');
  const lbImg      = document.getElementById('lightbox-img');
  const lbCaption  = document.getElementById('lightbox-caption');
  const lbBackBtn  = document.getElementById('lightbox-back-btn');

  let lbCloseTimer = null;
  const CLOSE_DURATION = 350;

  function openLightbox(src, alt) {
    if (!lbOverlay || !lbImg) return;
    lbImg.src = src;
    lbImg.alt = alt || '';
    if (lbCaption) lbCaption.textContent = alt || '';

    document.body.classList.add('lb-open');
    lbOverlay.classList.remove('closing');
    lbOverlay.classList.add('open');
  }

  function closeLightbox() {
    if (!lbOverlay || lbCloseTimer) return;
    lbOverlay.classList.add('closing');
    lbOverlay.classList.remove('open');
    document.body.classList.remove('lb-open');

    lbCloseTimer = setTimeout(() => {
      lbOverlay.classList.remove('closing');
      if (lbImg) lbImg.src = '';
      if (lbCaption) lbCaption.textContent = '';
      lbCloseTimer = null;
    }, CLOSE_DURATION);
  }

  document.querySelectorAll('.dummy-img-wide').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const img = wrap.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  document.querySelectorAll('.lightbox-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const src = link.getAttribute('data-img');
      const alt = link.getAttribute('data-alt') || '';
      if (src) openLightbox(src, alt);
    });
  });

  if (lbBackBtn) lbBackBtn.addEventListener('click', closeLightbox);

  if (lbOverlay) {
    lbOverlay.addEventListener('click', e => {
      if (e.target === lbOverlay) closeLightbox();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lbOverlay && lbOverlay.classList.contains('open')) {
      closeLightbox();
    }
  });

});