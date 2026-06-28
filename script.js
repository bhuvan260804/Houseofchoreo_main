document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const heroCopy = document.querySelector('.hero-copy');
  const observerOptions = { threshold: 0.12 };
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header shrink on scroll

  // Mobile menu toggle
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.getElementById('main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open);
    });

    mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Subtle hero parallax for bubbles
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroVisual.style.setProperty('--mx', x.toFixed(3));
      heroVisual.style.setProperty('--my', y.toFixed(3));
    });
    heroVisual.addEventListener('mouseleave', () => {
      heroVisual.style.setProperty('--mx', 0);
      heroVisual.style.setProperty('--my', 0);
    });
  }
  function onScroll() {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal on scroll using IntersectionObserver
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, observerOptions);

  document.querySelectorAll('.card, .service-card, .gallery-card, .hero-copy, .about-cards, .contact-form, .hero-visual').forEach(el => {
    io.observe(el);
  });

  // Smooth form submit (demo) — prevents navigation and shows inline success
// =====================================================================
// NEW: EMAIL DELIVERY — sends form submissions to the addresses below
// using FormSubmit (no backend, no library). To ADD/REMOVE/EDIT who
// receives the message, just edit this array.
// =====================================================================
const CONTACT_EMAILS = [
  "bhuvansingh2608@gmail.com",   // primary recipient
  "anshikajain112003@gmail.com"  // cc recipient — add more lines like this, or delete one to remove it
];

const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    formData.append("_subject", "New enquiry from House of Choreo website");
    formData.append("_template", "table");
    formData.append("_captcha", "false");
    // every email after the first is added as CC automatically
    if (CONTACT_EMAILS.length > 1) {
      formData.append("_cc", CONTACT_EMAILS.slice(1).join(","));
    }

    const primaryEmail = CONTACT_EMAILS[0];
    const msg = document.createElement('div');
    msg.className = 'form-toast';

    try {
      const res = await fetch(`https://formsubmit.co/${primaryEmail}`, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      });
      msg.textContent = res.ok
        ? 'Thanks — we\'ll get back to you soon!'
        : 'Something went wrong. Please try again or call us directly.';
    } catch (err) {
      msg.textContent = 'Something went wrong. Please try again or call us directly.';
    }

    form.appendChild(msg);
    setTimeout(() => msg.classList.add('visible'), 10);
    setTimeout(() => { msg.classList.remove('visible'); setTimeout(() => msg.remove(), 400); }, 3000);
    form.reset();
  });
}

  // Highlight nav link for current section
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(s => navObserver.observe(s));

  /* =====================================================================
     NEW: PREMIUM ENHANCEMENT LAYER (vanilla JS only, no libraries)
     Every block below is additive and does not touch the logic above.
     ===================================================================== */

  // ---------------------------------------------------------------------
  // NEW 1) LOADER — fade out the premium loading screen once the page
  // (and its assets) have finished loading.
  // ---------------------------------------------------------------------
  const loader = document.getElementById('page-loader');
  if (loader) {
    const hideLoader = () => loader.classList.add('loaded');
    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 300);
    } else {
      window.addEventListener('load', () => setTimeout(hideLoader, 300));
    }
  }

  // ---------------------------------------------------------------------
  // NEW 2) SCROLL PROGRESS INDICATOR — fills the thin bar at the top of
  // the page in proportion to how far the user has scrolled.
  // ---------------------------------------------------------------------
  const progressBar = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // ---------------------------------------------------------------------
  // NEW 3) CUSTOM CURSOR — small glowing dot + a larger ring that follows
  // with slight easing. Only enabled on devices with a fine pointer
  // (i.e. not touchscreens), and skipped entirely for reduced-motion.
  // ---------------------------------------------------------------------
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (cursorDot && cursorRing && hasFinePointer && !prefersReducedMotion) {
    document.body.classList.add('has-custom-cursor');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    // Smoothly ease the ring toward the cursor position for a "trailing" feel
    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateRing);
    }
    requestAnimationFrame(animateRing);

    // Expand the ring whenever it's over a clickable element
    document.querySelectorAll('a, button, input[type="submit"], .btn').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-active'));
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
  }

  // ---------------------------------------------------------------------
  // NEW 4) SMOOTH SCROLL FOR NAV LINKS — buttery scroll to in-page anchors
  // (CSS `scroll-behavior: smooth` already helps; this adds an offset-aware
  // JS fallback so the header never overlaps the target section).
  // ---------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  // ---------------------------------------------------------------------
  // NEW 5) HERO PARALLAX — the hero background drifts slightly slower
  // than the page scroll for a subtle depth effect (no scroll lag: this
  // is throttled with requestAnimationFrame).
  // ---------------------------------------------------------------------
if (heroVisual && !prefersReducedMotion && window.innerWidth > 768) {
  let parallaxTicking = false;
    function applyParallax() {
      const scrolled = window.scrollY;
      // Move at ~12% of scroll speed, capped so it never drifts too far
      const offset = Math.min(scrolled * 0.12, 60);
      heroVisual.style.transform = `translate3d(0, ${offset}px, 0)`;
      parallaxTicking = false;
    }
    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        requestAnimationFrame(applyParallax);
        parallaxTicking = true;
      }
    }, { passive: true });
  }

  // ---------------------------------------------------------------------
  // NEW 6) SCROLL-IN ANIMATIONS for [data-animate] elements — fade-up,
  // slide-left, zoom-in, pop. Fires once per element via IntersectionObserver.
  // ---------------------------------------------------------------------
  const animatedEls = document.querySelectorAll('[data-animate]');
  if (animatedEls.length) {
    const animateIO = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target); // animate only once
        }
      });
    }, { threshold: 0.15 });
    animatedEls.forEach(el => animateIO.observe(el));
  }

  // ---------------------------------------------------------------------
  // NEW 7) BUTTON RIPPLE EFFECT — a soft circular ripple spawns from the
  // click point on any .btn, then removes itself after the animation.
  // ---------------------------------------------------------------------
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  // ---------------------------------------------------------------------
  // NEW 8) STATISTICS COUNT-UP — utility that animates any element with a
  // [data-count-to="123"] attribute from 0 to its target once visible.
  // No stats markup exists in the current page, but this is ready to use
  // the moment a stats block with that attribute is added.
  // ---------------------------------------------------------------------
  const counters = document.querySelectorAll('[data-count-to]');
  if (counters.length) {
    const countIO = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-count-to')) || 0;
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          el.textContent = Math.floor(progress * target).toLocaleString();
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target.toLocaleString();
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(el => countIO.observe(el));
  }
});

