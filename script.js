// script.js (clean + robust)

let lightbox, canvas, ctx;
let galleryImages = [];   // images for the current page only
let currentIndex = 0;

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  lightbox = document.getElementById('lightbox');
  canvas   = document.getElementById('lightboxCanvas');
  if (canvas) ctx = canvas.getContext('2d');

  // Fallback <img> inside the lightbox (shown if canvas can’t draw)
  if (lightbox && !document.getElementById('lightboxFallback')) {
    const fb = document.createElement('img');
    fb.id = 'lightboxFallback';
    fb.style.display    = 'none';
    fb.style.maxWidth   = '90%';
    fb.style.maxHeight  = '80vh';
    fb.style.borderRadius = '1rem';
    lightbox.appendChild(fb);
  }

  // Controls
  document.querySelector('.close-btn-lightbox')?.addEventListener('click', closeLightbox);
  document.querySelector('.nav-left')?.addEventListener('click', () => navigate(-1));
  document.querySelector('.nav-right')?.addEventListener('click', () => navigate(1));
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  // Menu (unchanged)
  window.toggleMenu = function (e) {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('overlay');
    if (e?.target.closest('.portfolio-sub')) return;
    menu.classList.toggle('open');
    overlay.style.display = menu.classList.contains('open') ? 'block' : 'none';
  };
  window.toggleDropdown = el => el.classList.toggle('open');
  document.addEventListener('click', e => {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('overlay');
    const ham = document.querySelector('.hamburger');
    if (!menu.contains(e.target) && !ham.contains(e.target)) {
      menu.classList.remove('open');
      overlay.style.display = 'none';
    }
  });

  // Mobile CV label
  const cvLink = document.querySelector('.cv-label');
  if (cvLink) cvLink.textContent = /Mobi|Android/i.test(navigator.userAgent) ? 'Download CV' : 'CV';

  // Page-specific: wire triggers
  if (document.body.classList.contains('graphic-design')) {
    wireTriggers('.graphic-design .lightbox-trigger');
  }
  if (document.body.classList.contains('brand-identity')) {
    wireTriggers('.brand-identity .lightbox-trigger');
  }
  if (document.body.classList.contains('illustration')) {
    wireTriggers('.illustration .lightbox-trigger');
  }
  if (document.body.classList.contains('packaging')) {
    wireTriggers('.packaging .lightbox-trigger');
  }
  if (document.body.classList.contains('stylist')) {
    wireTriggers('.stylist .lightbox-trigger');
  }
  if (document.body.classList.contains('textile')) {
    wireTriggers('.textile .lightbox-trigger');
  }
});

// ---------- Wire gallery thumbnails to lightbox ----------
function wireTriggers(selector) {
  galleryImages = []; // reset per page
  const order = ['jpg','jpeg','png','gif','webp'];

  document.querySelectorAll(selector).forEach((thumb, idx) => {
    // Lazy by default
    thumb.loading = 'lazy';

    // Preload the big source for lightbox
    const src = thumb.dataset.src || thumb.src;
    const img = new Image();
    img.onload  = () => {/* ready */};
    img.onerror = () => console.warn('[preload fail]', src);
    img.src = src;
    galleryImages.push(img);

    // Click → open by index (waits for load inside openLightbox)
    thumb.addEventListener('click', () => openLightbox(idx), { passive: true });

    // If the thumb itself 404s, try alternate extensions
    thumb.addEventListener('error', () => {
      const m = (thumb.src || '').match(/^(.*)\.(\w+)(\?.*)?$/);
      if (!m) return;
      const [, base, ext, q=''] = m;
      const candidates = order.filter(e => e !== ext.toLowerCase());
      (function tryNext(i=0){
        if (i >= candidates.length) return;
        const candidate = `${base}.${candidates[i]}${q}`;
        const t = new Image();
        t.onload  = () => { thumb.src = candidate; };
        t.onerror = () => tryNext(i+1);
        t.src = candidate;
      })();
    });
  });
}

// ---------- Lightbox core ----------
function openLightbox(i) {
  currentIndex = i;
  const img = galleryImages[i];
  if (!img) return;

  if (img.complete && img.naturalWidth > 0) {
    draw(img);
    lightbox.style.display = 'flex';
  } else {
    img.onload = () => {
      draw(img);
      lightbox.style.display = 'flex';
    };
    img.onerror = () => {
      showFallback(img.src);
      lightbox.style.display = 'flex';
    };
  }
}

// Convenience for pages that pass a direct path
function openLightboxFromPath(path) {
  const img = new Image();
  img.onload  = () => { draw(img); lightbox.style.display = 'flex'; };
  img.onerror = () => { showFallback(path); lightbox.style.display = 'flex'; };
  img.src = path;
}

function closeLightbox() { if (lightbox) lightbox.style.display = 'none'; }

function navigate(dir) {
  const len = galleryImages.length;
  if (!len) return;
  currentIndex = (currentIndex + dir + len) % len;
  openLightbox(currentIndex);
}

// ---------- Drawing & fallback ----------
function draw(img) {
  const fb = document.getElementById('lightboxFallback');
  if (!canvas || !ctx) return showFallback(img.src);

  // Guard: if dimensions are missing, don’t draw to canvas
  if (!img.naturalWidth || !img.naturalHeight) {
    return showFallback(img.src);
  }

  const maxW = window.innerWidth * 0.9;
  const maxH = window.innerHeight * 0.8;
  const ratio = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
  if (!isFinite(ratio) || ratio <= 0) return showFallback(img.src);

  const w = Math.round(img.naturalWidth * ratio);
  const h = Math.round(img.naturalHeight * ratio);
  const dpr = window.devicePixelRatio || 1;

  canvas.width  = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width  = w + 'px';
  canvas.style.height = h + 'px';

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(img, 0, 0, w, h);

  if (fb) fb.style.display = 'none';
  canvas.style.display = 'block';
}

function showFallback(src) {
  const fb = document.getElementById('lightboxFallback');
  if (fb) {
    fb.src = src || '';
    fb.style.display = 'block';
  }
  if (canvas) canvas.style.display = 'none';
}
