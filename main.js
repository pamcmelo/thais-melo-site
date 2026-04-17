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
      const ids = ['doces-finos','brigadeiros','criacoes','caixas'];
      btn.classList.toggle('active', ids[i] === id);
    });
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('panel-' + id);
    panel.classList.add('active');
    // Reset subcategory filter when switching tabs
    panel.querySelectorAll('.subcat-group').forEach(g => g.style.display = '');
    panel.querySelectorAll('.cat-separator').forEach(hr => hr.style.display = '');
    panel.querySelectorAll('.subcat-nav a').forEach(a => a.classList.remove('subcat-active'));
    const allBtn = panel.querySelector('.subcat-nav a[data-filter="all"]');
    if (allBtn) allBtn.classList.add('subcat-active');
  }

  // Subcategory filter
  function filterSubcat(btn, panelId, subcat) {
    const panel = document.getElementById(panelId);
    panel.querySelectorAll('.subcat-nav a').forEach(a => a.classList.remove('subcat-active'));
    btn.classList.add('subcat-active');
    panel.querySelectorAll('.subcat-group').forEach(g => {
      g.style.display = (subcat === 'all' || g.dataset.subcat === subcat) ? '' : 'none';
    });
    panel.querySelectorAll('.cat-separator').forEach(hr => {
      hr.style.display = subcat === 'all' ? '' : 'none';
    });
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
