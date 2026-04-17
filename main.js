  // Navbar scroll
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Hero image load animation
  window.addEventListener('load', () => {
    document.getElementById('heroImg').classList.add('loaded');
  });

  // Mobile nav
  function openMobileNav() { document.getElementById('mobileNav').classList.add('open'); }
  function closeMobileNav() { document.getElementById('mobileNav').classList.remove('open'); }

  // Tab system
  function switchTab(id) {
    document.querySelectorAll('.tab-btn').forEach((btn, i) => {
      const ids = ['doces-finos','brigadeiros','brigadeiros-trad','brigadeiros-belga'];
      btn.classList.toggle('active', ids[i] === id);
    });
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + id).classList.add('active');
  }

  // IntersectionObserver for fade-up
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
