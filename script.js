/* ============================================
   AMMAR AHAMED — Interactions
   Minimal, smooth, human
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

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
    themeToggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // --- Testimonials carousel ---
  const slider = document.querySelector('.testimonials-slider');
  const prevBtn = document.querySelector('.testi-prev');
  const nextBtn = document.querySelector('.testi-next');

  if (slider && prevBtn && nextBtn) {
    let testiIndex = 0;
    const cards = slider.querySelectorAll('.testi-card');
    const gap = 20;

    function getCardWidth() {
      if (!cards.length) return 400;
      return cards[0].offsetWidth + gap;
    }

    function getMaxIndex() {
      const trackWidth = slider.parentElement.offsetWidth;
      const totalWidth = cards.length * getCardWidth() - gap;
      return Math.max(0, Math.ceil((totalWidth - trackWidth) / getCardWidth()));
    }

    function slideTestimonials() {
      slider.style.transform = `translateX(-${testiIndex * getCardWidth()}px)`;
    }

    nextBtn.addEventListener('click', () => {
      if (testiIndex < getMaxIndex()) {
        testiIndex++;
        slideTestimonials();
      }
    });

    prevBtn.addEventListener('click', () => {
      if (testiIndex > 0) {
        testiIndex--;
        slideTestimonials();
      }
    });
  }
});
