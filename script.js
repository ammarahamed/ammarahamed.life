/* ============================================
   AMMAR AHAMED — Animations & Interactions
   Growth-themed: elements scale up, counters grow
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 120;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      // Close mobile nav if open
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  // --- Nav scroll effect ---
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  // --- Mobile nav toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // --- Reveal on scroll (growth animation) ---
  const revealElements = document.querySelectorAll('.reveal-up');

  // Immediately reveal elements already in viewport on load
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.querySelectorAll('.reveal-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('revealed'), i * 120);
    });
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => {
    // Skip hero elements — they animate on load
    if (!heroSection || !heroSection.contains(el)) {
      revealObserver.observe(el);
    }
  });

  // --- Counter animation (numbers growing up) ---
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

  if (counters.length > 0) {
    counterObserver.observe(counters[0].closest('.hero-stats'));
  }

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const suffix = counter.dataset.suffix || '';
      const duration = 2000;
      const startTime = performance.now();

      function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      }

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const current = Math.floor(easedProgress * target);

        counter.textContent = current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString() + suffix;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // --- Parallax on hero background ---
  const heroBg = document.querySelector('.hero-bg-pattern');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    }, { passive: true });
  }

  // --- Track row expand on click ---
  document.querySelectorAll('.track-row[data-expandable]').forEach(row => {
    row.addEventListener('click', () => {
      const wasExpanded = row.classList.contains('expanded');

      // Close all
      document.querySelectorAll('.track-row.expanded').forEach(r => {
        r.classList.remove('expanded');
      });

      // Toggle clicked
      if (!wasExpanded) {
        row.classList.add('expanded');
      }
    });
  });

  // --- Theme toggle ---
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // --- Active nav link on scroll ---
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);

      if (link && link.classList) {
        if (scrollY >= top && scrollY < top + height) {
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }, { passive: true });
});
