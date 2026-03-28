/* ═══════════════════════════════════════════════════════
   PISTO — Interactive JS
   Scroll animations · Counter · Cursor · Parallax
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. CUSTOM CURSOR ────────────────────────────── */
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursor) {
        cursor.style.left = mouseX + 'px';
        cursor.style.top  = mouseY + 'px';
      }
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      if (follower) {
        follower.style.left = followerX + 'px';
        follower.style.top  = followerY + 'px';
      }
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverTargets = document.querySelectorAll(
      'a, button, .vendor-card, .impact-card, .team-card, .contact-card, .orbit-node'
    );
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => follower && follower.classList.add('hovered'));
      el.addEventListener('mouseleave', () => follower && follower.classList.remove('hovered'));
    });
  }

  /* ── 2. NAV SCROLL ───────────────────────────────── */
  const nav = document.getElementById('nav');
  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ── 3. MOBILE HAMBURGER ─────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ── 4. SMOOTH SCROLL ────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── 5. REVEAL ANIMATIONS ────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── 6. COUNTER ANIMATION ────────────────────────── */
  function animateCounter(el, target, duration) {
    const start     = performance.now();
    const startVal  = 0;
    function step(timestamp) {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(startVal + (target - startVal) * eased);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const statEls = document.querySelectorAll('.stat-number[data-count]');
  const barEls  = document.querySelectorAll('.stat-bar-fill');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const stat   = entry.target;
      const target = parseInt(stat.dataset.count);
      animateCounter(stat, target, 1800);

      // Animate bars in same section
      barEls.forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0';
        requestAnimationFrame(() => {
          setTimeout(() => { bar.style.width = w; }, 200);
        });
      });

      counterObserver.unobserve(stat);
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => counterObserver.observe(el));

  /* ── 7. PARALLAX (HERO ORBS) ─────────────────────── */
  const orbs = document.querySelectorAll('.orb');
  let ticking = false;

  function updateParallax() {
    const sy = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = [0.12, 0.08, 0.05][i] || 0.1;
      const sign  = i % 2 === 0 ? 1 : -1;
      orb.style.transform = `translateY(${sy * speed * sign}px)`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  /* ── 8. HERO TITLE STAGGER ───────────────────────── */
  const heroLines = document.querySelectorAll('.hero-title .line');
  heroLines.forEach((line, i) => {
    line.style.opacity   = '0';
    line.style.transform = 'translateY(30px)';
    line.style.transition = `opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)`;
    line.style.transitionDelay = `${i * 120}ms`;
    setTimeout(() => {
      line.style.opacity   = '1';
      line.style.transform = 'translateY(0)';
    }, 200 + i * 120);
  });

  /* ── 9. STEP CARDS — HOVER RIPPLE ───────────────── */
  document.querySelectorAll('.step-item').forEach(item => {
    const icon = item.querySelector('.step-icon-wrap');
    if (!icon) return;
    item.addEventListener('mouseenter', () => {
      icon.style.boxShadow = '0 0 0 8px rgba(52,199,123,0.08)';
    });
    item.addEventListener('mouseleave', () => {
      icon.style.boxShadow = 'none';
    });
  });

  /* ── 10. ORBIT NODES — SUBTLE PULSE ─────────────── */
  const nodes = document.querySelectorAll('.orbit-node');
  nodes.forEach((node, i) => {
    const icon = node.querySelector('.node-icon');
    if (!icon) return;
    setInterval(() => {
      icon.style.transform = 'scale(1.08)';
      setTimeout(() => { icon.style.transform = 'scale(1)'; }, 400);
    }, 2000 + i * 600);
    icon.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.3s, border-color 0.3s';
  });

  /* ── 11. VENDOR CARDS — STAGGER ON ENTER ─────────── */
  const vendorCards = document.querySelectorAll('.vendor-card');
  const vcObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const cards = entry.target.closest('.vendor-grid')?.querySelectorAll('.vendor-card') || [];
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity   = '1';
          card.style.transform = 'translateY(0)';
        }, i * 70);
      });
      vcObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  if (vendorCards.length) {
    vendorCards.forEach(c => {
      c.style.opacity   = '0';
      c.style.transform = 'translateY(24px)';
      c.style.transition = 'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)';
    });
    vcObserver.observe(vendorCards[0]);
  }

  /* ── 12. TRUST BADGE SHIMMER ─────────────────────── */
  const trustBadge = document.querySelector('.trust-badge-large');
  if (trustBadge) {
    trustBadge.addEventListener('mouseenter', () => {
      trustBadge.style.boxShadow = '0 0 40px rgba(201,168,76,0.15)';
    });
    trustBadge.addEventListener('mouseleave', () => {
      trustBadge.style.boxShadow = 'none';
    });
    trustBadge.style.transition = 'box-shadow 0.4s ease, transform 0.3s ease';
    trustBadge.addEventListener('mouseenter', () => { trustBadge.style.transform = 'scale(1.01)'; });
    trustBadge.addEventListener('mouseleave', () => { trustBadge.style.transform = 'scale(1)'; });
  }

  /* ── 13. BOTTLE DRAG TILT ────────────────────────── */
  const bottleCenter = document.querySelector('.bottle-center');
  if (bottleCenter) {
    document.addEventListener('mousemove', (e) => {
      const rect    = document.body.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const dx = (e.clientX - centerX) / centerX;
      const dy = (e.clientY - centerY) / centerY;
      bottleCenter.style.transform = `translate(-50%, -50%) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg)`;
    });
    bottleCenter.style.transition = 'transform 0.4s ease';
  }

  /* ── 14. SECTION ACTIVE LINKS ────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a');

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinksAll.forEach(a => {
          a.style.color = a.getAttribute('href') === '#' + id
            ? 'var(--cream)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => activeObserver.observe(s));

  /* ── 15. CONTACT CARDS — PHONE HIGHLIGHT ─────────── */
  document.querySelectorAll('.contact-card').forEach(card => {
    const num = card.querySelector('.cc-num');
    card.addEventListener('mouseenter', () => {
      if (num) num.style.color = 'var(--green-lt)';
    });
    card.addEventListener('mouseleave', () => {
      if (num) num.style.color = '';
    });
    if (num) num.style.transition = 'color 0.25s';
  });

  /* ── 16. PAGE LOAD FADE ───────────────────────────── */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });

})();
