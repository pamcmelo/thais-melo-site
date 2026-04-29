// ─── Gallery page logic: rendering + filter + shared lightbox ───

(function () {
  const PHOTOS = window.GALERIA_PHOTOS || [];

  // Mosaic feature pattern — indexes (within the filtered list) that get special spans.
  // Tweakable. Keeps rhythm interesting without feeling random.
  const MOSAIC_PATTERN = {
    0:  'feat-big',
    3:  'feat-tall',
    8:  'feat-wide',
    11: 'feat-big',
    16: 'feat-tall',
    21: 'feat-wide',
  };

  // Active gallery for lightbox = the currently filtered list
  let activeList = [...PHOTOS];
  let lbIndex = 0;

  // ─── Render a grid into a container ───
  function renderGrid(container, variant) {
    container.innerHTML = '';
    activeList.forEach((photo, i) => {
      const item = document.createElement('button');
      item.className = 'gal-item';
      item.dataset.cat = photo.cat;
      item.dataset.idx = i;
      item.setAttribute('aria-label', `Abrir foto: ${photo.alt}`);

      if (variant === 'mosaic' && MOSAIC_PATTERN[i]) {
        item.classList.add(MOSAIC_PATTERN[i]);
      }

      const img = document.createElement('img');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = photo.src;
      img.alt = photo.alt;
      item.appendChild(img);

      const ico = document.createElement('div');
      ico.className = 'zoom-ico';
      ico.innerHTML = '⤢';
      item.appendChild(ico);

      item.addEventListener('click', () => openLightbox(i));
      container.appendChild(item);
    });
  }

  // ─── Filtering ───
  function applyFilter(cat) {
    activeList = cat === 'all' ? [...PHOTOS] : PHOTOS.filter(p => p.cat === cat);
    document.querySelectorAll('[data-gal-grid]').forEach(el => {
      renderGrid(el, el.dataset.galGrid);
    });
    // Update counts + active pill
    document.querySelectorAll('.gal-filter').forEach(b => {
      b.classList.toggle('active', b.dataset.cat === cat);
    });
  }

  function updateCounts() {
    const counts = {
      all: PHOTOS.length,
      doces: PHOTOS.filter(p => p.cat === 'doces').length,
      eventos: PHOTOS.filter(p => p.cat === 'eventos').length,
    };
    document.querySelectorAll('.gal-filter').forEach(b => {
      const c = b.querySelector('.gal-count');
      if (c) c.textContent = counts[b.dataset.cat] ?? '';
    });
  }

  // ─── Lightbox ───
  const lb        = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lbImg');
  const lbCounter = document.getElementById('lbCounter');

  function openLightbox(i) {
    lbIndex = i;
    showImage();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  function showImage() {
    const p = activeList[lbIndex];
    if (!p) return;
    lbImg.classList.remove('loaded');
    lbImg.src = p.src;
    lbImg.alt = p.alt;
    lbImg.onload = () => lbImg.classList.add('loaded');
    lbCounter.textContent = `${lbIndex + 1} / ${activeList.length}`;
  }
  function next() { lbIndex = (lbIndex + 1) % activeList.length; showImage(); }
  function prev() { lbIndex = (lbIndex - 1 + activeList.length) % activeList.length; showImage(); }

  // Wire up lightbox controls
  if (lb) {
    document.getElementById('lbClose').addEventListener('click', closeLightbox);
    document.getElementById('lbNext').addEventListener('click', next);
    document.getElementById('lbPrev').addEventListener('click', prev);
    lb.addEventListener('click', (e) => { if (e.target === lb || e.target.classList.contains('lightbox-inner')) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft')  prev();
    });

    // Touch swipe on the lightbox image
    let tx = 0;
    lb.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend',   (e) => {
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
    }, { passive: true });
  }

  // Filter button wiring
  document.querySelectorAll('.gal-filter').forEach(b => {
    b.addEventListener('click', () => applyFilter(b.dataset.cat));
  });

  // Init
  updateCounts();
  applyFilter('all');
})();
