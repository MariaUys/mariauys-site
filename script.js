// script.js

// Shared globals
let lightbox, lightboxCanvas, ctx, currentIndex = 0;
let images = [];

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Cache lightbox elements
  lightbox = document.getElementById('lightbox');
  lightboxCanvas = document.getElementById('lightboxCanvas');
  if (lightboxCanvas) {
    ctx = lightboxCanvas.getContext('2d');
  }

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

  // Mobile CV label
  const cvLink = document.querySelector('.cv-label');
  if (cvLink) {
    cvLink.textContent = /Mobi|Android/i.test(navigator.userAgent) 
      ? 'Download CV' 
      : 'CV';
  }

  // Wire up any <img class="lightbox-trigger" data-src="...">
  document.querySelectorAll('.lightbox-trigger').forEach((el, idx) => {
    const src = el.dataset.src || el.src;
    // preload into our images[]
    const img = new Image();
    img.src = src;
    images.push(img);

    el.addEventListener('click', () => openLightbox(idx));
  });

  // Afrigarde hover-swap fallback (CSS handles it; JS fallback optional)
  if (document.body.classList.contains('afrigarde')) {
    document.querySelectorAll('.image-hover').forEach(container => {
      const def = container.querySelector('.default-img');
      const hov = container.querySelector('.hover-img');
      container.addEventListener('mouseenter', () => {
        def.style.opacity = 0; hov.style.opacity = 1;
      });
      container.addEventListener('mouseleave', () => {
        def.style.opacity = 1; hov.style.opacity = 0;
      });
    });
  }
});

// Menu toggles
function toggleMenu(e) {
  const menu = document.getElementById('mobileMenu'),
        overlay = document.getElementById('overlay');
  if (e?.target.closest('.portfolio-sub')) return;
  menu.classList.toggle('open');
  overlay.style.display = menu.classList.contains('open') ? 'block' : 'none';
}

function toggleDropdown(el) {
  el.classList.toggle('open');
}

document.addEventListener('click', e => {
  const menu = document.getElementById('mobileMenu'),
        overlay = document.getElementById('overlay'),
        ham = document.querySelector('.hamburger');
  if (!menu.contains(e.target) && !ham.contains(e.target)) {
    menu.classList.remove('open');
    overlay.style.display = 'none';
  }
});

// Lightbox core
function openLightbox(index) {
  currentIndex = index;
  drawToLightbox(images[index]);
  lightbox.style.display = 'flex';
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
  currentIndex = (currentIndex + direction + images.length) % images.length;
  drawToLightbox(images[currentIndex]);
}

// Draw with aspect‐ratio + retina support
function drawToLightbox(img) {
  const maxW  = window.innerWidth * 0.9,
        maxH  = window.innerHeight * 0.8,
        ratio = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight),
        dispW = img.naturalWidth * ratio,
        dispH = img.naturalHeight * ratio,
        dpr   = window.devicePixelRatio || 1;

  lightboxCanvas.width  = dispW * dpr;
  lightboxCanvas.height = dispH * dpr;
  lightboxCanvas.style.width  = dispW + 'px';
  lightboxCanvas.style.height = dispH + 'px';

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.clearRect(0, 0, dispW, dispH);
  ctx.drawImage(img, 0, 0, dispW, dispH);
}
