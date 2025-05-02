// 1) Shared globals
let lightbox, lightboxCanvas, ctx, currentIndex = 0, images = [];

// 2) On DOM ready:
document.addEventListener('DOMContentLoaded', () => {
  lightbox        = document.getElementById('lightbox');
  lightboxCanvas  = document.getElementById('lightboxCanvas');
  ctx             = lightboxCanvas.getContext('2d');

  // Lightbox controls
  document.querySelector('.close-btn-lightbox')
          ?.addEventListener('click', closeLightbox);
  document.querySelector('.nav-left')
          ?.addEventListener('click', () => navigate(-1));
  document.querySelector('.nav-right')
          ?.addEventListener('click', () => navigate(1));
  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // CV label toggle
  const cvLink = document.querySelector('.cv-label');
  if (cvLink) {
    cvLink.textContent = /Mobi|Android/i.test(navigator.userAgent)
                         ? 'Download CV'
                         : 'CV';
  }

  // Wire up static lightbox triggers
  document.querySelectorAll('.lightbox-trigger').forEach(el => {
    el.addEventListener('click', () => {
      const src = el.getAttribute('data-src') || el.src;
      openLightboxFromPath(src);
    });
  });
});

// 3) Menu toggles
function toggleMenu(e) {
  const menu    = document.getElementById('mobileMenu'),
        overlay = document.getElementById('overlay');
  if (e?.target.closest('.portfolio-sub')) return;
  menu.classList.toggle('open');
  overlay.style.display = menu.classList.contains('open') ? 'block' : 'none';
}
function toggleDropdown(el) {
  el.classList.toggle('open');
}
document.addEventListener('click', e => {
  const menu    = document.getElementById('mobileMenu'),
        overlay = document.getElementById('overlay'),
        ham     = document.querySelector('.hamburger');
  if (!menu.contains(e.target) && !ham.contains(e.target)) {
    menu.classList.remove('open');
    overlay.style.display = 'none';
  }
});

// 4) Lightbox core
function openLightboxPath(indexOrPath) {
  // not used here
}
function openLightboxFromPath(path) {
  const img = new Image();
  img.onload = () => {
    drawToLightbox(img);
    lightbox.style.display = 'flex';
  };
  img.src = path;
}
function closeLightbox() {
  lightbox.style.display = 'none';
}
function navigate(direction) {
  // unused in static-path mode
}

// 5) Preserve aspect ratio & retina
function drawToLightbox(img) {
  const maxW   = window.innerWidth * 0.9,
        maxH   = window.innerHeight * 0.8,
        ratio  = Math.min(maxW/img.naturalWidth, maxH/img.naturalHeight),
        dispW  = img.naturalWidth * ratio,
        dispH  = img.naturalHeight * ratio,
        dpr    = window.devicePixelRatio || 1;

  lightboxCanvas.width  = dispW * dpr;
  lightboxCanvas.height = dispH * dpr;
  lightboxCanvas.style.width  = dispW + 'px';
  lightboxCanvas.style.height = dispH + 'px';

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.clearRect(0, 0, dispW, dispH);
  ctx.drawImage(img, 0, 0, dispW, dispH);
}

// Hover-swap for Afrigarde (optional, CSS handles most of it)
document.addEventListener('DOMContentLoaded', () => {
  if (!document.body.classList.contains('afrigarde')) return;
  document.querySelectorAll('.image-hover').forEach(container => {
    const defaultImg = container.querySelector('.default-img');
    const hoverImg   = container.querySelector('.hover-img');
    // if you wanted JS fallback instead of CSS-only:
    container.addEventListener('mouseenter', () => {
      defaultImg.style.opacity = 0;
      hoverImg.style.opacity   = 1;
    });
    container.addEventListener('mouseleave', () => {
      defaultImg.style.opacity = 1;
      hoverImg.style.opacity   = 0;
    });
  });
});
