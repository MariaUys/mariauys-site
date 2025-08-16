// Global menu functions (top-level)
window.toggleMenu = function (e) {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('overlay');
  if (e?.target.closest('.portfolio-sub')) return;
  menu.classList.toggle('open');
  overlay.style.display = menu.classList.contains('open') ? 'block' : 'none';
};
window.toggleDropdown = function (el) {
  el.classList.toggle('open');
};

// script.js — image-based lightbox with extension fallback

let lightbox, currentIndex = 0;
let gallerySources = []; // raw URLs from the page (data-src or src)

// ---------- init ----------
document.addEventListener('DOMContentLoaded', () => {
  lightbox = document.getElementById('lightbox');
  const scrollContainer = document.getElementById('scrollContainer');
  if (scrollContainer) {
    const sections = scrollContainer.querySelectorAll('section');
    let chapterIndex = 0;

    function scrollToChapter(i) {
      sections[i].scrollIntoView({ behavior: 'smooth' });
      chapterIndex = i;
    }

    scrollContainer.addEventListener('scroll', () => {
      chapterIndex = Math.round(scrollContainer.scrollTop / window.innerHeight);
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' && chapterIndex < sections.length - 1) scrollToChapter(chapterIndex + 1);
      if (e.key === 'ArrowUp' && chapterIndex > 0) scrollToChapter(chapterIndex - 1);
    });

    const enterBtn = document.getElementById('enter');
    enterBtn?.addEventListener('click', () => scrollToChapter(1));

    window.addEventListener('wheel', () => {
      if (chapterIndex === 0) scrollToChapter(1);
    }, { once: true });
  }


  // Reveal animations
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Add a real <img> inside the lightbox (we'll ignore the <canvas>)
  let lbImg = document.getElementById('lightboxImg');
  if (!lbImg && lightbox) {
    lbImg = document.createElement('img');
    lbImg.id = 'lightboxImg';
    lbImg.style.maxWidth  = '90%';
    lbImg.style.maxHeight = '80vh';
    lbImg.style.borderRadius = '1rem';
    lbImg.style.display = 'none';
    lightbox.appendChild(lbImg);
  }

  // Controls
  const closeBtnLb = document.querySelector('button.close-btn-lightbox');
  closeBtnLb?.addEventListener('click', closeLightbox);
  closeBtnLb?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); closeLightbox(); }
  });
  const navLeft = document.querySelector('button.nav-left');
  navLeft?.addEventListener('click', () => navigate(-1));
  navLeft?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(-1); }
  });
  const navRight = document.querySelector('button.nav-right');
  navRight?.addEventListener('click', () => navigate(1));
  navRight?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(1); }
  });
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'ArrowLeft') navigate(-1);
  });

  // Menu
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
    const ham = document.querySelector('button.hamburger');
    if (!menu.contains(e.target) && !ham.contains(e.target)) {
      menu.classList.remove('open'); overlay.style.display = 'none';
    }
  });
  const hamBtn = document.querySelector('button.hamburger');
  hamBtn?.addEventListener('click', e => toggleMenu(e));
  hamBtn?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') toggleMenu(e);
  });
  const closeBtn = document.querySelector('button.close-btn');
  closeBtn?.addEventListener('click', e => toggleMenu(e));
  closeBtn?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') toggleMenu(e);
  });

  // Mobile CV label
  const cvLink = document.querySelector('.cv-label');
  if (cvLink) cvLink.textContent = /Mobi|Android/i.test(navigator.userAgent) ? 'Download CV' : 'CV';

  // CV embed/download
  const cvContent = document.getElementById('cvContent');
  if (cvContent) {
    const pdfPath = cvContent.dataset.pdf;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile) {
      const a = document.createElement('a');
      a.href = pdfPath;
      a.download = pdfPath.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      cvContent.innerHTML = `<p class="cv-message">Your download should begin shortly.<br><br><a href="${pdfPath}" download>Click here if it doesn't</a></p>`;
    } else {
      cvContent.innerHTML = `<iframe src="${pdfPath}" title="Maria Uys CV"></iframe>`;
    }
  }

  // ---- Bind ALL lightbox triggers on the page ----
  wireTriggers('.lightbox-trigger');

  // Subtle cursor trail
  let lastTrail = 0;
  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastTrail < 25) return;
    lastTrail = now;
    const trail = document.createElement('div');
    trail.className = 'trail';
    trail.style.left = `${e.pageX}px`;
    trail.style.top = `${e.pageY}px`;
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 400);
  });
});

// ---------- triggers ----------
function wireTriggers(selector) {
  gallerySources = [];
  document.querySelectorAll(selector).forEach((thumb, idx) => {
    // record the requested source
    const src = thumb.getAttribute('data-src') || thumb.src;
    gallerySources.push(src);

    // be safe: make them lazy
    thumb.loading = 'lazy';

    // click handler
    thumb.addEventListener('click', () => openLightbox(idx), { passive: true });
  });
}

// ---------- lightbox ----------
async function openLightbox(i) {
  currentIndex = i;
  const raw = gallerySources[i];
  if (!raw) return;

  const lbImg = document.getElementById('lightboxImg');
  if (!lbImg) return;

  lbImg.style.display = 'none';         // hide while resolving/loading

  // ensure the lightbox appears over the current viewport instead of the page top
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  lightbox.style.position = 'absolute';
  lightbox.style.top = `${scrollY}px`;
  lightbox.style.left = '0';
  lightbox.style.display = 'flex';

  try {
    const resolved = await resolveWithAlternates(raw);
    // load the working url
    await loadInto(lbImg, resolved);
    lbImg.style.display = 'block';
    // hide canvas if it exists
    const canvas = document.getElementById('lightboxCanvas');
    if (canvas) canvas.style.display = 'none';
  } catch {
    // show a tiny error state
    lbImg.alt = 'Image could not be loaded';
    lbImg.style.display = 'block';
    lbImg.src = raw; // will show broken icon if nothing works
  }
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.style.display = 'none';
    lb.style.position = '';
    lb.style.top = '';
    lb.style.left = '';
  }
}

function navigate(dir) {
  const len = gallerySources.length;
  if (!len) return;
  currentIndex = (currentIndex + dir + len) % len;
  openLightbox(currentIndex);
}

// ---------- helpers ----------
function loadInto(imgEl, url, timeout = 12000) {
  return new Promise((resolve, reject) => {
    let done = false;
    const t = setTimeout(() => { if (!done) { done = true; reject(new Error('timeout')); } }, timeout);
    imgEl.onload = () => { if (!done) { done = true; clearTimeout(t); resolve(); } };
    imgEl.onerror = () => { if (!done) { done = true; clearTimeout(t); reject(new Error('error')); } };
    imgEl.src = url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now(); // bust caches
  });
}

async function resolveWithAlternates(url) {
  // Try the given URL first, then flip extension among common types
  const m = url.match(/^(.*)\.(\w+)(\?.*)?$/);
  if (!m) { await testURL(url); return url; }
  const [, base, ext, q = ''] = m;
  const order = ['jpg','jpeg','png','gif','webp'];
  const candidates = [ext.toLowerCase(), ...order.filter(e => e !== ext.toLowerCase())];
  for (const e of candidates) {
    const candidate = `${base}.${e}${q}`;
    if (await testURL(candidate)) return candidate;
  }
  throw new Error('no working candidate');
}

function testURL(url, timeout = 8000) {
  return new Promise(resolve => {
    const img = new Image();
    let done = false;
    const t = setTimeout(() => { if (!done) { done = true; resolve(false); } }, timeout);
    img.onload  = () => { if (!done) { done = true; clearTimeout(t); resolve(true); } };
    img.onerror = () => { if (!done) { done = true; clearTimeout(t); resolve(false); } };
    img.src = url + (url.includes('?') ? '&' : '?') + 'probe=' + Date.now();
  });
}

// ---- Cloudinary "fetch" optimizer ----
(() => {
  try {
    const CLOUD = 'ddx7wc9ko';
    if (!/^https?:/.test(location.protocol)) return;

    const CDN_BASE = `https://res.cloudinary.com/${CLOUD}/image/fetch`;

    document.querySelectorAll('img').forEach(img => {
      if (!img.hasAttribute('loading')) img.loading = 'lazy';
      if (!img.hasAttribute('decoding')) img.decoding = 'async';
      if (img.hasAttribute('data-no-cdn')) return;

      const raw = img.getAttribute('data-src') || img.getAttribute('src');
      if (!raw || /^data:/.test(raw) || /\.gif(\?.*)?$/i.test(raw)) return;

      const abs = raw.startsWith('http') ? raw : new URL(raw, location.href).href;

      requestAnimationFrame(() => {
        const cssW = Math.ceil(img.getBoundingClientRect().width || 800);
        const optimized =
          `${CDN_BASE}/f_auto,q_auto,dpr_auto,c_limit,w_${cssW}/${encodeURIComponent(abs)}`;

        const test = new Image();
        test.onload = () => {
          img.src = optimized;
          if (img.dataset) img.dataset.src = optimized; // lightbox uses optimized too
        };
        test.onerror = () => {};
        test.referrerPolicy = 'no-referrer';
        test.src = optimized;
      });
    });
  } catch (e) {
    console.warn('[Cloudinary skipped]', e);
  }
})();

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.warn('Service worker registration failed', err);
    });
  });
}
