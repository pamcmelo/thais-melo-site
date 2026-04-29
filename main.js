  // Navbar scroll
  const nav = document.getElementById('navbar');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // Hero image load animation
  window.addEventListener('load', () => {
    const heroImg = document.getElementById('heroImg');
    if (heroImg) heroImg.classList.add('loaded');
  });

  // Mobile nav
  function toggleMobileNav() {
    const mNav = document.getElementById('mobileNav');
    if (mNav.classList.contains('open')) { closeMobileNav(); } else { openMobileNav(); }
  }
  function openMobileNav() {
    document.getElementById('mobileNav').classList.add('open');
    document.querySelector('.burger').classList.add('open');
  }
  function closeMobileNav() {
    document.getElementById('mobileNav').classList.remove('open');
    document.querySelector('.burger').classList.remove('open');
  }

  // Tab system — DOM-based, funciona em todas as páginas
  function switchTab(id) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      const onclick = btn.getAttribute('onclick') || '';
      btn.classList.toggle('active', onclick.includes("'" + id + "'"));
    });
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('panel-' + id);
    if (!panel) return;
    panel.classList.add('active');
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

  // Galeria scroll (setas manuais)
  function scrollGaleria(amount) {
    const el = document.getElementById('galeriaScroll');
    if (el) el.scrollBy({ left: amount, behavior: 'smooth' });
  }

  // IntersectionObserver for fade-up
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // ── GALERIA AUTO-SCROLL ─────────────────────────────────────────────────────
  (function () {
    const scroller = document.getElementById('galeriaScroll');
    if (!scroller) return;
    const track = scroller.querySelector('.galeria-track');
    if (!track) return;

    // Clona as imagens para dentro do mesmo track — loop infinito sem linha dupla
    Array.from(track.querySelectorAll('img')).forEach(img => {
      track.appendChild(img.cloneNode(true));
    });

    const SPEED = 0.6;         // px por frame (~36px/s a 60fps)
    const RESUME_DELAY = 500;  // ms até retomar após interação
    let paused = false;
    let resumeTimer = null;

    function tick() {
      if (!paused) {
        scroller.scrollLeft += SPEED;
        const half = scroller.scrollWidth / 2;
        if (scroller.scrollLeft >= half) scroller.scrollLeft -= half;
      }
      requestAnimationFrame(tick);
    }

    function pause() {
      paused = true;
      clearTimeout(resumeTimer);
    }

    function scheduleResume() {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { paused = false; }, RESUME_DELAY);
    }

    scroller.addEventListener('mouseenter', pause);
    scroller.addEventListener('mouseleave', scheduleResume);
    scroller.addEventListener('touchstart', pause, { passive: true });
    scroller.addEventListener('touchend', scheduleResume, { passive: true });

    document.querySelectorAll('.galeria-arrow').forEach(btn => {
      btn.addEventListener('click', () => { pause(); scheduleResume(); });
    });

    requestAnimationFrame(tick);
  })();

  // ── CARDÁPIO DINÂMICO ───────────────────────────────────────────────────────
  if (document.getElementById('panel-brigadeiros')) {
    initCardapioDinamico();
  }

  function slugify(s) {
    return s.toLowerCase()
      .replace(/[áàãâä]/g, 'a').replace(/[éèêë]/g, 'e')
      .replace(/[íìîï]/g, 'i').replace(/[óòõôö]/g, 'o')
      .replace(/[úùûü]/g, 'u').replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function normalizeCategory(raw) {
    const s = raw.trim();
    const lower = s.toLowerCase();
    if (lower === 'doces finos') return 'Doces Finos';
    if (lower === 'bombons') return 'Bombons';
    if (lower === 'variados') return 'Variados';
    return s;
  }

  function parseCSV(text) {
    const rows = [];
    const lines = text.split(/\r?\n/);
    for (const line of lines) {
      if (!line.trim()) continue;
      const fields = [];
      let i = 0;
      while (i < line.length) {
        if (line[i] === '"') {
          let val = '';
          i++;
          while (i < line.length) {
            if (line[i] === '"' && line[i + 1] === '"') {
              val += '"'; i += 2;
            } else if (line[i] === '"') {
              i++; break;
            } else {
              val += line[i++];
            }
          }
          fields.push(val);
          if (line[i] === ',') i++;
        } else {
          let end = line.indexOf(',', i);
          if (end === -1) end = line.length;
          fields.push(line.slice(i, end));
          i = end + 1;
        }
      }
      rows.push(fields);
    }
    return rows;
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  const CATEGORY_TO_PANEL = {
    'Brigadeiros': 'brigadeiros',
    'Doces Finos': 'doces-finos',
    'Bombons': 'bombons',
    'Caixas de Brigadeiro': 'caixas',
    'Variados': 'variados',
  };

  // Ordem explícita de subcategorias (sobrepõe ordem do CSV)
  const SUBCAT_ORDER = {
    'Doces Finos': ['Doces Finos', 'Copinhos e Cestinhas', 'Bombons'],
  };

  async function initCardapioDinamico() {
    let text;
    try {
      const res = await fetch('categorias.csv');
      text = await res.text();
    } catch (e) {
      console.warn('Cardápio CSV indisponível:', e);
      return;
    }

    const rows = parseCSV(text);
    if (rows.length < 2) return;

    const headers = rows[0].map(h => h.trim());
    const data = rows.slice(1).map(r => {
      const o = {};
      headers.forEach((h, idx) => { o[h] = (r[idx] || '').trim(); });
      return o;
    });

    // Agrupa: { Categoria: { intro, subcats: { SubCategoria: [produtos] }, subcatOrder: [] } }
    const grouped = {};
    for (const item of data) {
      if (item['status'] !== 'ativo') continue;
      const cat = normalizeCategory(item['Categoria'] || '');
      if (!CATEGORY_TO_PANEL[cat]) continue;
      if (!grouped[cat]) grouped[cat] = { intro: '', subcats: {}, subcatOrder: [] };
      if (!grouped[cat].intro && item['cardapio-intro']) {
        grouped[cat].intro = item['cardapio-intro'];
      }
      const subcat = normalizeCategory(item['Sub-categoria'] || '');
      if (!grouped[cat].subcats[subcat]) {
        grouped[cat].subcats[subcat] = [];
        grouped[cat].subcatOrder.push(subcat);
      }
      grouped[cat].subcats[subcat].push(item);
    }

    for (const [cat, panelId] of Object.entries(CATEGORY_TO_PANEL)) {
      const panel = document.getElementById('panel-' + panelId);
      if (!panel || !grouped[cat]) continue;
      // Aplicar ordem explícita de subcategorias se definida
      if (SUBCAT_ORDER[cat]) {
        grouped[cat].subcatOrder = SUBCAT_ORDER[cat].filter(s => grouped[cat].subcats[s]);
      }
      panel.innerHTML = renderPanel(grouped[cat], panelId);
    }

    // Default: abre doces-finos direto na primeira subcategoria, não em "Todos"
    const dFPanel = document.getElementById('panel-doces-finos');
    if (dFPanel) {
      const firstBtn = dFPanel.querySelector('.subcat-nav a:not([data-filter="all"])');
      if (firstBtn) firstBtn.click();
    }
  }

  function renderPanel(data, panelId) {
    const { intro, subcats, subcatOrder } = data;
    const multiSubcat = subcatOrder.length > 1;
    let html = '';

    if (multiSubcat) {
      html += `<div class="subcat-nav">`;
      html += `<a data-filter="all" class="subcat-active" onclick="filterSubcat(this,'panel-${panelId}','all')">Todos</a>`;
      for (const subcat of subcatOrder) {
        const slug = slugify(subcat);
        html += `<a data-filter="${slug}" onclick="filterSubcat(this,'panel-${panelId}','${slug}')">${escapeHtml(subcat)}</a>`;
      }
      html += `</div>`;
    }

    if (intro) html += `<p class="cardapio-intro">${escapeHtml(intro)}</p>`;

    for (let i = 0; i < subcatOrder.length; i++) {
      const subcat = subcatOrder[i];
      const products = subcats[subcat];
      const slug = slugify(subcat);
      html += `<div class="subcat-group" data-subcat="${slug}">`;
      if (multiSubcat) html += `<h3 class="cat-title">${escapeHtml(subcat)}</h3>`;
      html += `<div class="products-grid">`;
      for (const p of products) {
        if (p['Preco-uni'] === 'Valor Sob Consulta') continue;
        html += renderProductCard(p);
      }
      html += `</div></div>`;
      if (i < subcatOrder.length - 1) html += `<hr class="cat-separator">`;
    }

    return html;
  }

  const FLAG_SLUG = { 'Em Breve': 'em-breve', 'Lançamento': 'lancamento', 'Mais Pedido': 'mais-pedido' };

  function renderProductCard(p) {
    const name = escapeHtml(p['Produto'] || '');
    const desc = p['Descricao'] ? escapeHtml(p['Descricao']) : '';
    const imgFile = p['prod-img'];
    const imgSrc = imgFile
      ? 'FILES/fotos-produtos/' + imgFile.replace(/ /g, '%20')
      : 'FILES/fotos-produtos/placeholder.png';
    const flag = (p['flag'] || '').trim();
    const flagSlug = FLAG_SLUG[flag] || '';

    let html = `<div class="product-card">`;
    html += `<div class="product-img-wrap">`;
    html += `<img class="product-img" src="${imgSrc}" alt="${name}" loading="lazy">`;
    if (flag && flagSlug) html += `<span class="product-badge product-badge--${flagSlug}">${escapeHtml(flag)}</span>`;
    html += `</div>`;
    html += `<div class="product-info"><h3 class="product-name">${name}</h3>`;
    if (desc) html += `<p class="product-desc">${desc}</p>`;
    html += `</div></div>`;
    return html;
  }
