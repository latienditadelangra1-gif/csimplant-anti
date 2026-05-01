/* ═══════════════════════════════════════════════
   ANTIGRAVITY DENTAL — JavaScript
   Particles · Scroll FX · Nav · Form · Animations
═══════════════════════════════════════════════ */

// ── PARTICLES ──────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  const COLORS = ['rgba(0,102,255,', 'rgba(255,255,255,', 'rgba(200,200,224,'];

  function createParticle() {
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.3 + 0.1),
      alpha: Math.random() * 0.6 + 0.2,
      color: c,
      life: 0,
      maxLife: Math.random() * 300 + 150,
    };
  }

  function init() {
    resize();
    for (let i = 0; i < 120; i++) {
      const p = createParticle();
      p.life = Math.random() * p.maxLife; // stagger
      particles.push(p);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life++;
      if (p.life > p.maxLife) { particles.splice(i, 1); particles.push(createParticle()); continue; }
      const fade = Math.sin((p.life / p.maxLife) * Math.PI);
      p.x += p.vx; p.y += p.vy;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + (p.alpha * fade) + ')';
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init(); draw();
})();


// ── NAVBAR SCROLL FX ───────────────────────────
(function initNav() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();


// ── SMOOTH PARALLAX HERO ────────────────────────
(function initParallax() {
  const img = document.getElementById('hero-img');
  if (!img) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      img.style.transform = `scale(1.08) translateY(${y * 0.12}px)`;
    }
  }, { passive: true });
})();


// ── SCROLL REVEAL ──────────────────────────────
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.service-card, .tech-card, .team-card, .process-step, .location-card').forEach(el => observer.observe(el));
})();


// ── ACTIVE NAV LINK ─────────────────────────────
(function initActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        active?.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => io.observe(s));
})();


// ── FORM SUBMIT → WHATSAPP ──────────────────────
(function initForm() {
  const WHATSAPP_NUMBER = '584245123095'; // +58 424-5123095

  const form = document.getElementById('cita-form');
  const success = document.getElementById('form-success');
  const submitBtn = document.getElementById('form-submit');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name    = document.getElementById('form-name').value.trim();
    const phone   = document.getElementById('form-phone').value.trim();
    const email   = document.getElementById('form-email').value.trim();
    const service = document.getElementById('form-service').value.trim();
    const msg     = document.getElementById('form-msg').value.trim();

    if (!name || !phone) {
      shake(document.getElementById('form-name'));
      shake(document.getElementById('form-phone'));
      return;
    }

    // Build WhatsApp message
    let text = `🦷 *Nueva solicitud de cita - CS Implant Center*\n\n`;
    text += `👤 *Nombre:* ${name}\n`;
    text += `📞 *Teléfono:* ${phone}\n`;
    if (email)   text += `📧 *Email:* ${email}\n`;
    if (service) text += `🔬 *Servicio:* ${service}\n`;
    if (msg)     text += `💬 *Mensaje:* ${msg}\n`;

    submitBtn.textContent = 'Abriendo WhatsApp...';
    submitBtn.disabled = true;

    setTimeout(() => {
      // Open WhatsApp with pre-filled message
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');

      // Show success screen
      form.classList.add('hidden');
      success.classList.add('active');
    }, 800);
  });

  function shake(el) {
    if (!el) return;
    el.style.borderColor = '#ff6b8a';
    el.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-8px)' },
      { transform: 'translateX(8px)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(0)' },
    ], { duration: 400, easing: 'ease-in-out' });
    setTimeout(() => el.style.borderColor = '', 800);
  }
})();


// ── CURSOR GLOW (desktop only) ─────────────────
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch devices

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; width: 320px; height: 320px;
    border-radius: 50%; pointer-events: none; z-index: 0;
    background: radial-gradient(circle, rgba(0,102,255,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();


// ── COUNTER ANIMATION ──────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent;
      const prefix = raw.startsWith('+') ? '+' : '';
      const suffix = raw.endsWith('+') ? '+' : '';
      const target = parseInt(raw.replace(/[^0-9]/g, ''));
      let current = 0;
      const step = Math.max(1, Math.floor(target / 60));
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = prefix + current.toLocaleString() + suffix;
        if (current >= target) clearInterval(timer);
      }, 24);
      io.unobserve(el);
    });
  }, { threshold: 1 });
  counters.forEach(c => io.observe(c));
})();
