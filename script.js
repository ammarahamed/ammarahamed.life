/* ============================================
   AMMAR AHAMED — Interactions
   Minimal, smooth, human
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll Progress Bar ---
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = progress + '%';
    }, { passive: true });
  }

  // --- Smooth scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 120;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      // Close mobile menu
      mobileMenu.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  // --- Nav scroll ---
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // --- Mobile toggle ---
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  // --- Reveal on scroll ---
  const reveals = document.querySelectorAll('.reveal');

  // Hero elements — reveal immediately with stagger
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.querySelectorAll('.reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('revealed'), i * 150);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => {
    if (!hero || !hero.contains(el)) {
      observer.observe(el);
    }
  });

  // --- Counter animation ---
  const counters = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsRow = document.querySelector('.stats-row');
  if (statsRow) counterObserver.observe(statsRow);

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const suffix = counter.dataset.suffix || '';
      const duration = 2000;
      const start = performance.now();

      function ease(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const current = Math.floor(ease(progress) * target);
        counter.textContent = current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else counter.textContent = target.toLocaleString() + suffix;
      }

      requestAnimationFrame(update);
    });
  }

  // --- Timeline expand ---
  document.querySelectorAll('.timeline-row[data-expandable]').forEach(row => {
    row.addEventListener('click', () => {
      const wasExpanded = row.classList.contains('expanded');
      document.querySelectorAll('.timeline-row.expanded').forEach(r => r.classList.remove('expanded'));
      if (!wasExpanded) row.classList.add('expanded');
    });
  });

  // --- Theme toggle ---
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  const saved = localStorage.getItem('theme');
  if (saved) html.setAttribute('data-theme', saved);

  if (themeToggle) {
    const themeOrder = ['light', 'dark', 'colorful'];
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') || 'light';
      const idx = themeOrder.indexOf(current);
      const next = themeOrder[(idx + 1) % themeOrder.length];
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // --- Testimonial Carousel (Phidata style) ---
  const carouselSlider = document.querySelector('.carousel-slider');
  const carouselPrev = document.querySelector('.carousel-prev');
  const carouselNext = document.querySelector('.carousel-next');

  if (carouselSlider && carouselPrev && carouselNext) {
    let carouselIndex = 0;
    const carouselCards = carouselSlider.querySelectorAll('.carousel-card');
    const gap = 24;

    function getCarouselCardWidth() {
      if (!carouselCards.length) return 404;
      return carouselCards[0].offsetWidth + gap;
    }

    function updateActiveCard() {
      // Calculate which card is most centered in the viewport
      const trackRect = carouselSlider.parentElement.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;

      carouselCards.forEach((card, i) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(trackCenter - cardCenter);
        if (distance < card.offsetWidth * 0.6) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    }

    function slideCarousel() {
      const trackWidth = carouselSlider.parentElement.offsetWidth;
      const cardWidth = getCarouselCardWidth();
      const totalWidth = carouselCards.length * cardWidth - gap;

      // Center the active card in the track
      const centerOffset = (trackWidth - (cardWidth - gap)) / 2;
      let offset = carouselIndex * cardWidth - centerOffset;

      // Clamp so we don't scroll past edges
      offset = Math.max(0, Math.min(offset, totalWidth - trackWidth));

      carouselSlider.style.transform = `translateX(-${offset}px)`;

      // Update active states
      carouselCards.forEach((card, i) => {
        card.classList.toggle('active', i === carouselIndex);
      });
    }

    carouselNext.addEventListener('click', () => {
      if (carouselIndex < carouselCards.length - 1) {
        carouselIndex++;
        slideCarousel();
      }
    });

    carouselPrev.addEventListener('click', () => {
      if (carouselIndex > 0) {
        carouselIndex--;
        slideCarousel();
      }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const track = carouselSlider.parentElement;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchStartX - touchEndX;
      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0 && carouselIndex < carouselCards.length - 1) {
          carouselIndex++;
          slideCarousel();
        } else if (swipeDistance < 0 && carouselIndex > 0) {
          carouselIndex--;
          slideCarousel();
        }
      }
    }, { passive: true });

    // Initialize — start at first card
    carouselIndex = 0;
    setTimeout(() => slideCarousel(), 100);
  }

  // --- Hero Canvas Animation (disabled) ---
  const canvas = null; // removed
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let W, H;
    let mouseOver = false;
    let lightIntensity = 0.12;
    let time = 0;
    let beamAngle = 0; // sweeping beam angle

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    canvas.addEventListener('mouseenter', () => { mouseOver = true; });
    canvas.addEventListener('mouseleave', () => { mouseOver = false; });
    canvas.addEventListener('click', () => {
      lightIntensity = 1;
      setTimeout(() => { if (!mouseOver) lightIntensity = 0.12; }, 2500);
    });

    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

    // 3D perspective transform helper
    function project(x, y, z) {
      // Simple perspective: map (x,y) on a tilted plane
      const cx = W * 0.5, cy = H * 0.45;
      const scale = 0.7;
      const tiltX = 0.55; // perspective tilt
      const px = cx + (x - 0.5) * W * scale + (y - 0.5) * W * 0.15;
      const py = cy + (y - 0.5) * H * scale * tiltX + (x - 0.5) * H * 0.05;
      return { x: px, y: py };
    }

    // Topo lines stored as curves on the 0-1 plane
    const topoSeeds = [];
    for (let i = 0; i < 14; i++) {
      topoSeeds.push({
        yBase: 0.08 + i * 0.065,
        amp: 0.03 + Math.random() * 0.04,
        freq: 2.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Journey path control points (on 0-1 plane)
    const journeyPts = [
      { x: 0.15, y: 0.85 },
      { x: 0.3, y: 0.7 },
      { x: 0.45, y: 0.55 },
      { x: 0.48, y: 0.35 },
    ];

    // Traveling dots
    const dots = [];
    for (let i = 0; i < 4; i++) {
      dots.push({ t: i * 0.25, speed: 0.002 + Math.random() * 0.002 });
    }

    // Floating labels on the map
    const labels = [
      { text: 'Growth', mx: 0.72, my: 0.4, phase: 0 },
      { text: 'Strategy', mx: 0.25, my: 0.45, phase: 2 },
      { text: 'Marketing', mx: 0.65, my: 0.7, phase: 4 },
    ];

    function catmull(t, p0, p1, p2, p3) {
      const t2 = t * t, t3 = t2 * t;
      return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2*p0 - 5*p1 + 4*p2 - p3) * t2 + (-p0 + 3*p1 - 3*p2 + p3) * t3);
    }

    function getJourneyPoint(t) {
      const pts = journeyPts;
      const n = pts.length - 1;
      const i = Math.min(Math.floor(t * n), n - 1);
      const lt = (t * n) - i;
      const p0 = pts[Math.max(i - 1, 0)];
      const p1 = pts[i];
      const p2 = pts[Math.min(i + 1, n)];
      const p3 = pts[Math.min(i + 2, n)];
      return {
        x: catmull(lt, p0.x, p1.x, p2.x, p3.x),
        y: catmull(lt, p0.y, p1.y, p2.y, p3.y),
      };
    }

    function draw() {
      time += 0.016;
      ctx.clearRect(0, 0, W, H);

      const dark = isDark();
      const mapLineCol = dark ? 'rgba(200,200,200,' : 'rgba(100,100,100,';
      const borderCol = dark ? '#888' : '#333';
      const textCol = dark ? '#f0f0ee' : '#002b31';
      const bgCard = dark ? '#1a1a1a' : '#ffffff';
      const mapBg = dark ? '#111' : '#f0ede6';
      const targetIntensity = mouseOver ? 0.8 : 0.12;
      lightIntensity += (targetIntensity - lightIntensity) * 0.04;

      // Sweep beam angle (slow oscillation like a real lighthouse)
      beamAngle = Math.sin(time * 0.4) * 0.6; // sweeps ~70 degrees

      // === 3D MAP SURFACE ===
      // Draw map border (quadrilateral)
      const corners = [
        project(0, 0), project(1, 0),
        project(1, 1), project(0, 1),
      ];

      // Map shadow
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(corners[0].x + 6, corners[0].y + 8);
      ctx.lineTo(corners[1].x + 6, corners[1].y + 8);
      ctx.lineTo(corners[2].x + 6, corners[2].y + 8);
      ctx.lineTo(corners[3].x + 6, corners[3].y + 8);
      ctx.closePath();
      ctx.fillStyle = dark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)';
      ctx.fill();
      ctx.restore();

      // Map fill
      ctx.beginPath();
      ctx.moveTo(corners[0].x, corners[0].y);
      ctx.lineTo(corners[1].x, corners[1].y);
      ctx.lineTo(corners[2].x, corners[2].y);
      ctx.lineTo(corners[3].x, corners[3].y);
      ctx.closePath();
      ctx.fillStyle = mapBg;
      ctx.fill();
      ctx.strokeStyle = borderCol;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Clip to map for topo lines
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(corners[0].x, corners[0].y);
      ctx.lineTo(corners[1].x, corners[1].y);
      ctx.lineTo(corners[2].x, corners[2].y);
      ctx.lineTo(corners[3].x, corners[3].y);
      ctx.closePath();
      ctx.clip();

      // === TOPO LINES ===
      topoSeeds.forEach((s, idx) => {
        ctx.beginPath();
        for (let x = -0.05; x <= 1.05; x += 0.02) {
          const ty = s.yBase + Math.sin(x * s.freq * Math.PI + s.phase) * s.amp;
          const p = project(x, ty);
          if (x <= -0.04) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = mapLineCol + '0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Concentric rings around lighthouse base
      const lhBase = project(0.48, 0.32);
      for (let r = 1; r <= 3; r++) {
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.1) {
          const rx = 0.48 + Math.cos(a) * r * 0.06;
          const ry = 0.32 + Math.sin(a) * r * 0.04;
          const p = project(rx, ry);
          if (a === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.strokeStyle = '#1a6b4a';
        ctx.globalAlpha = 0.15 + lightIntensity * 0.2;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // === SWEEPING LIGHT BEAM (on map surface) ===
      const beamOrigin = project(0.48, 0.3);
      const beamLen = W * 0.5;
      const beamWidth = 0.35 + lightIntensity * 0.15;

      ctx.save();
      const bAngle1 = -Math.PI / 2 + beamAngle - beamWidth / 2;
      const bAngle2 = -Math.PI / 2 + beamAngle + beamWidth / 2;
      const bx1 = beamOrigin.x + Math.cos(bAngle1) * beamLen;
      const by1 = beamOrigin.y + Math.sin(bAngle1) * beamLen * 0.6;
      const bx2 = beamOrigin.x + Math.cos(bAngle2) * beamLen;
      const by2 = beamOrigin.y + Math.sin(bAngle2) * beamLen * 0.6;

      const beamGrad = ctx.createRadialGradient(beamOrigin.x, beamOrigin.y, 5, beamOrigin.x, beamOrigin.y, beamLen * 0.7);
      const beamA = lightIntensity;
      beamGrad.addColorStop(0, 'rgba(46,204,113,' + (beamA * 0.5) + ')');
      beamGrad.addColorStop(0.4, 'rgba(46,204,113,' + (beamA * 0.2) + ')');
      beamGrad.addColorStop(1, 'rgba(46,204,113,0)');

      ctx.beginPath();
      ctx.moveTo(beamOrigin.x, beamOrigin.y);
      ctx.lineTo(bx1, by1);
      ctx.lineTo(bx2, by2);
      ctx.closePath();
      ctx.fillStyle = beamGrad;
      ctx.fill();
      ctx.restore();

      // === JOURNEY PATH ===
      ctx.beginPath();
      for (let t = 0; t <= 1; t += 0.01) {
        const jp = getJourneyPoint(t);
        const p = project(jp.x, jp.y);
        if (t === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = borderCol;
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.stroke();

      // Journey dots
      dots.forEach(d => {
        d.t += d.speed;
        if (d.t > 1) d.t -= 1;
        const jp = getJourneyPoint(d.t);
        const p = project(jp.x, jp.y);
        // Outer ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#2ecc71';
        ctx.globalAlpha = 0.2 + Math.sin(d.t * Math.PI) * 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;
        // Inner dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#e74c3c';
        ctx.fill();
      });

      // End dot (at lighthouse base)
      const endPt = project(0.48, 0.35);
      ctx.beginPath();
      ctx.arc(endPt.x, endPt.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#e74c3c';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(endPt.x, endPt.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = dark ? '#222' : '#fff';
      ctx.fill();

      ctx.restore(); // end clip

      // === LIGHTHOUSE (drawn above map, not clipped) ===
      const lhTop = project(0.48, 0.08);
      const lhBot = project(0.48, 0.32);
      const lhMid = { x: (lhTop.x + lhBot.x) / 2, y: (lhTop.y + lhBot.y) / 2 };
      const lhH = lhBot.y - lhTop.y;
      const bw = lhH * 0.16; // base half-width
      const tw = bw * 0.55; // top half-width

      // Lighthouse body outline
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(lhBot.x - bw, lhBot.y);
      ctx.lineTo(lhTop.x - tw, lhTop.y + lhH * 0.18);
      ctx.lineTo(lhTop.x + tw, lhTop.y + lhH * 0.18);
      ctx.lineTo(lhBot.x + bw, lhBot.y);
      ctx.closePath();
      ctx.fillStyle = dark ? '#1a1a1a' : '#ffffff';
      ctx.fill();
      ctx.strokeStyle = borderCol;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Green stripes on lighthouse
      const stripes = 4;
      for (let s = 0; s < stripes; s++) {
        const t1 = 0.22 + (s * 2 + 1) / (stripes * 2 + 1) * 0.78;
        const t2 = 0.22 + (s * 2 + 2) / (stripes * 2 + 1) * 0.78;
        const sy1 = lhTop.y + lhH * t1;
        const sy2 = lhTop.y + lhH * t2;
        const sw1 = tw + (bw - tw) * t1;
        const sw2 = tw + (bw - tw) * t2;
        ctx.beginPath();
        ctx.moveTo(lhBot.x - sw1, sy1);
        ctx.lineTo(lhBot.x - sw2, sy2);
        ctx.lineTo(lhBot.x + sw2, sy2);
        ctx.lineTo(lhBot.x + sw1, sy1);
        ctx.closePath();
        ctx.fillStyle = '#1a6b4a';
        ctx.fill();
      }

      // Window/door slit
      ctx.beginPath();
      ctx.rect(lhBot.x - 3, lhTop.y + lhH * 0.5, 6, lhH * 0.08);
      ctx.fillStyle = '#1a6b4a';
      ctx.globalAlpha = 0.5;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Gallery/railing platform
      const galleryY = lhTop.y + lhH * 0.15;
      const galleryW = tw * 1.6;
      ctx.beginPath();
      ctx.rect(lhTop.x - galleryW, galleryY, galleryW * 2, 4);
      ctx.fillStyle = dark ? '#444' : '#ccc';
      ctx.fill();
      ctx.strokeStyle = borderCol;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Railing posts
      for (let r = -1; r <= 1; r += 0.5) {
        const rx = lhTop.x + r * galleryW * 0.8;
        ctx.beginPath();
        ctx.moveTo(rx, galleryY);
        ctx.lineTo(rx, galleryY - 8);
        ctx.strokeStyle = borderCol;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // Railing top bar
      ctx.beginPath();
      ctx.moveTo(lhTop.x - galleryW * 0.9, galleryY - 8);
      ctx.lineTo(lhTop.x + galleryW * 0.9, galleryY - 8);
      ctx.strokeStyle = borderCol;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Lantern room
      const lanternY = lhTop.y + lhH * 0.06;
      const lanternH = lhH * 0.1;
      const lanternW = tw * 1.1;
      ctx.beginPath();
      ctx.rect(lhTop.x - lanternW, lanternY, lanternW * 2, lanternH);
      ctx.fillStyle = 'rgba(46,204,113,' + (0.2 + lightIntensity * 0.6) + ')';
      ctx.fill();
      ctx.strokeStyle = borderCol;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Lantern glow
      const gr = 10 + lightIntensity * 25 + Math.sin(time * 2.5) * 4 * lightIntensity;
      const lg = ctx.createRadialGradient(lhTop.x, lanternY + lanternH / 2, 2, lhTop.x, lanternY + lanternH / 2, gr);
      lg.addColorStop(0, 'rgba(46,204,113,' + (0.5 + lightIntensity * 0.5) + ')');
      lg.addColorStop(1, 'rgba(46,204,113,0)');
      ctx.beginPath();
      ctx.arc(lhTop.x, lanternY + lanternH / 2, gr, 0, Math.PI * 2);
      ctx.fillStyle = lg;
      ctx.fill();

      // Dome
      ctx.beginPath();
      ctx.moveTo(lhTop.x - lanternW, lanternY);
      ctx.quadraticCurveTo(lhTop.x, lanternY - lanternH, lhTop.x + lanternW, lanternY);
      ctx.fillStyle = '#1a6b4a';
      ctx.fill();
      ctx.strokeStyle = borderCol;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Spire/point
      ctx.beginPath();
      ctx.moveTo(lhTop.x, lanternY - lanternH - 6);
      ctx.lineTo(lhTop.x - 4, lanternY - lanternH * 0.3);
      ctx.lineTo(lhTop.x + 4, lanternY - lanternH * 0.3);
      ctx.closePath();
      ctx.fillStyle = '#1a6b4a';
      ctx.fill();
      ctx.strokeStyle = borderCol;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Base ellipse
      ctx.beginPath();
      ctx.ellipse(lhBot.x, lhBot.y + 3, bw + 6, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = dark ? '#333' : '#d8d5cc';
      ctx.fill();
      ctx.strokeStyle = borderCol;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      // === FLOATING LABELS (above everything) ===
      labels.forEach(l => {
        const mp = project(l.mx, l.my);
        const lxp = mp.x;
        const lyp = mp.y + Math.sin(time * 0.7 + l.phase) * 5;

        ctx.font = '500 11px Inter, -apple-system, sans-serif';
        const tw2 = ctx.measureText(l.text).width;
        const cw = tw2 + 30;
        const ch = 26;
        const cx2 = lxp - cw / 2;
        const cy2 = lyp - ch / 2;

        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.1)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 3;

        // Rounded rect helper
        ctx.beginPath();
        ctx.roundRect(cx2, cy2, cw, ch, 6);
        ctx.fillStyle = bgCard;
        ctx.fill();
        ctx.restore();

        ctx.beginPath();
        ctx.roundRect(cx2, cy2, cw, ch, 6);
        ctx.strokeStyle = '#1a6b4a40';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Colored dot
        ctx.beginPath();
        ctx.arc(cx2 + 11, lyp, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#2ecc71';
        ctx.fill();

        ctx.fillStyle = textCol;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(l.text, cx2 + 20, lyp + 0.5);
      });

      requestAnimationFrame(draw);
    }

    setTimeout(draw, 200);
  }
});
