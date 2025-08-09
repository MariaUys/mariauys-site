// script.js
// ------------------------------------------------------------
// One lightbox to rule them all (works for both <img> triggers
// and canvas-driven pages that push into a global images[]).
// ------------------------------------------------------------

let lightbox, lightboxCanvas, ctx;
let lightboxSources = [];      // for <img class="lightbox-trigger"> pages
let lightboxIndex   = 0;
let useBuffer       = false;   // true when navigating the images[] buffer

// For canvas pages (illustration / packaging) that push images here:
let images = [];               // don't remove - used by those inline scripts

document.addEventListener('DOMContentLoaded', () => {
  // --- Cache elements safely ---
  lightbox       = document.getElementById('lightbox') || null;
  lightboxCanvas = document.getElementById('lightboxCanvas') || null;
  ctx            = lightboxCanvas ? lightboxCanvas.getContext('2d') : null;
  // create a fallback <img> we can show if canvas can't draw
window._lbFallbackImg = document.createElement('img');
_lbFallbackImg.id = 'lightboxFallback';
_lbFallbackImg.style.display   = 'none';
_lbFallbackImg.style.maxWidth  = '90%';
_lbFallbackImg.style.maxHeight = '80vh';
_lbFallbackImg.style.borderRadius = '1rem';
lightbox?.appendChild(_lbFallbackImg);


  // --- Lightbox controls (only if present) ---
  document.querySelector('.close-btn-lightbox')
    ?.addEventListener('click', closeLightbox);

  document.querySelector('.nav-left')
    ?.addEventListener('click', () => navigate(-1));

  document.querySelector('.nav-right')
    ?.addEventListener('click', () => navigate(1));

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // once after you set up 'lightbox':
if (!document.getElementById('lightboxFallback')) {
  const f = document.createElement('img');
  f.id = 'lightboxFallback';
  f.style.display = 'none';
  f.style.maxWidth = '90%';
  f.style.maxHeight = '80vh';
  f.style.borderRadius = '1rem';
  lightbox.appendChild(f);
}

  // --- CV label text (mobile vs desktop) ---
  const cvLink = document.querySelector('.cv-label');
  if (cvLink) {
    cvLink.textContent = /Mobi|Android/i.test(navigator.userAgent) ? 'Download CV' : 'CV';
  }

  // --- Sidebar / hamburger wiring ---
  // (Other handlers live below as plain functions)

  // --- Collect .lightbox-trigger images (if any) for this page ---
  const triggers = Array.from(document.querySelectorAll('.lightbox-trigger'));
  if (triggers.length) {
    lightboxSources = triggers.map(el => el.getAttribute('data-src') || el.src);
    triggers.forEach((el, i) => {
      el.addEventListener('click', () => openLightboxAt(i), { passive: true });
    });
  }

  // --- Optional Afrigarde hover fallback (CSS already handles it) ---
  if (document.body.classList.contains('afrigarde')) {
    document.querySelectorAll('.image-hover').forEach(container => {
      const def = container.querySelector('.default-img');
      const hov = container.querySelector('.hover-img');
      if (!def || !hov) return;
      container.addEventListener('mouseenter', () => { def.style.opacity = 0; hov.style.opacity = 1; });
      container.addEventListener('mouseleave', () => { def.style.opacity = 1; hov.style.opacity = 0; });
    });
  }

  // --- Resilient file-extension fallback for gallery <img> elements ---
  const tryOrder = ['jpeg','jpg','png','gif','webp'];
  document.querySelectorAll('.graphic-gallery img, .grid-small img, .grid-two img, .grid-three img, .grid-four img')
    .forEach((img) => {
      img.loading = img.loading || 'lazy';
      let trying = false, tried = new Set();
      img.addEventListener('error', () => {
        if (trying) return;
        const m = img.src.match(/^(.*)\.(\w+)(\?.*)?$/);
        if (!m) return;
        const [, base, ext, query=''] = m;
        tried.add(ext.toLowerCase());
        const candidates = tryOrder.filter(e => !tried.has(e));
        if (!candidates.length) return;
        trying = true;
        (function next(i=0){
          if (i >= candidates.length) { trying = false; return; }
          const candidate = `${base}.${candidates[i]}${query}`;
          const test = new Image();
          test.onload  = () => { img.src = candidate; trying = false; };
          test.onerror = () => next(i+1);
          test.src = candidate;
        })();
      });
    });
});

// ------------------------------------------------------------
// Menu
// ------------------------------------------------------------
function toggleMenu(e) {
  const menu    = document.getElementById('mobileMenu');
  const overlay = document.getElementById('overlay');
  if (!menu || !overlay) return;
  if (e?.target?.closest('.portfolio-sub')) return;
  menu.classList.toggle('open');
  overlay.style.display = menu.classList.contains('open') ? 'block' : 'none';
}

function toggleDropdown(el) {
  el?.classList?.toggle('open');
}

document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('overlay');
  const ham = document.querySelector('.hamburger');
  if (!menu || !overlay || !ham) return;
  if (!menu.contains(e.target) && !ham.contains(e.target)) {
    menu.classList.remove('open');
    overlay.style.display = 'none';
  }
});

// ------------------------------------------------------------
// Lightbox API (works with both sources list and images[] buffer)
// ------------------------------------------------------------
function openLightboxAt(i) {
  // Use sources list from .lightbox-trigger images
  if (!lightbox || !lightboxCanvas || !ctx || !lightboxSources.length) return;
  useBuffer = false;
  lightboxIndex = i;
  loadAndDraw(lightboxSources[i]);
  lightbox.style.display = 'flex';
}

// Support legacy calls from canvas pages that push into images[]
function openLightbox(index) {
  if (!lightbox || !lightboxCanvas || !ctx) return;
  if (!images.length || !images[index]) return;
  useBuffer = true;
  lightboxIndex = index;
  drawToLightbox(images[index]);
  lightbox.style.display = 'flex';
}

// Convenience: open with a raw path (still navigates among sources if present)
function openLightboxFromPath(path) {
  if (!lightbox || !lightboxCanvas || !ctx) return;
  useBuffer = false;
  const idx = lightboxSources.indexOf(path);
  lightboxIndex = idx >= 0 ? idx : 0;
  loadAndDraw(path);
  lightbox.style.display = 'flex';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.style.display = 'none';
}

function navigate(dir) {
  if (!lightbox || !lightboxCanvas || !ctx) return;
  const total = useBuffer && images.length ? images.length : lightboxSources.length;
  if (!total) return;
  lightboxIndex = (lightboxIndex + dir + total) % total;
  if (useBuffer && images.length) {
    drawToLightbox(images[lightboxIndex]);
  } else {
    loadAndDraw(lightboxSources[lightboxIndex]);
  }
}

// ------------------------------------------------------------
// Image loading with extension fallback
// ------------------------------------------------------------
function loadAndDraw(src) {
  if (!ctx || !lightboxCanvas) return;

  // always hide fallback when we *try* canvas
  if (window._lbFallbackImg) window._lbFallbackImg.style.display = 'none';
  lightboxCanvas.style.display = 'block';

  const img = new Image();
  img.crossOrigin = 'anonymous'; // safe default
  img.onload  = () => drawToLightbox(img);
  img.onerror = () => {
    const alts = altCandidates(src);
    tryNextAlt(alts, 0, src);
  };
  img.src = src;
}

function altCandidates(src) {
  // try both lower + UPPER case exts (Netlify is case-sensitive)
  const m = src.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const base = m ? src.slice(0, -m[0].length) : src;
  const lower = ['jpeg','jpg','png','gif','webp'];
  const upper = lower.map(e => e.toUpperCase());
  const cur   = m ? m[1] : '';
  return [...lower, ...upper].filter(e => e !== cur).map(e => `${base}.${e}`);
}

function tryNextAlt(list, i, original) {
  if (i >= list.length) {
    // last resort: show a normal <img> instead of canvas so it never looks broken
    if (window._lbFallbackImg) {
      lightboxCanvas.style.display = 'none';
      _lbFallbackImg.src = original;   // still try the original URL
      _lbFallbackImg.onload  = () => { _lbFallbackImg.style.display = 'block'; };
      _lbFallbackImg.onerror = () => { _lbFallbackImg.style.display = 'none'; };
    }
    return;
  }
  const attempt = list[i];
  const test = new Image();
  test.crossOrigin = 'anonymous';
  test.onload  = () => drawToLightbox(test);
  test.onerror = () => tryNextAlt(list, i + 1, original);
  test.src = attempt;
}

// ------------------------------------------------------------
// Canvas drawing (retina + aspect ratio preserved)
// ------------------------------------------------------------
function drawToLightbox(img) {
  const fb = document.getElementById('lightboxFallback');

  if (!img || !img.naturalWidth) {
    // show fallback <img>
    if (fb) {
      lightboxCanvas.style.display = 'none';
      fb.src = img?.src || '';
      fb.style.display = 'block';
    }
    return;
  }

  // normal canvas path
  const maxW = window.innerWidth * 0.9;
  const maxH = window.innerHeight * 0.8;
  const ratio = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
  const dispW = img.naturalWidth * ratio;
  const dispH = img.naturalHeight * ratio;
  const dpr   = window.devicePixelRatio || 1;

  lightboxCanvas.width  = dispW * dpr;
  lightboxCanvas.height = dispH * dpr;
  lightboxCanvas.style.width  = dispW + 'px';
  lightboxCanvas.style.height = dispH + 'px';

  const ctx = lightboxCanvas.getContext('2d');
  try {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.clearRect(0, 0, dispW, dispH);
    ctx.drawImage(img, 0, 0, dispW, dispH);

    // canvas succeeded → hide fallback
    if (fb) fb.style.display = 'none';
    lightboxCanvas.style.display = 'block';
  } catch (e) {
    // if canvas drawing fails for any reason, use fallback <img>
    if (fb) {
      lightboxCanvas.style.display = 'none';
      fb.src = img.src;
      fb.style.display = 'block';
    }
  }
}
