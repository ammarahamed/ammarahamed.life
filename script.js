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

    // Initialize — start at first card
    carouselIndex = 0;
    setTimeout(() => slideCarousel(), 100);
  }
});
