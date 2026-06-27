document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const heroCopy = document.querySelector('.hero-copy');
  const observerOptions = { threshold: 0.12 };

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
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = document.createElement('div');
      msg.className = 'form-toast';
      msg.textContent = 'Thanks — we\'ll get back to you soon!';
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
});
