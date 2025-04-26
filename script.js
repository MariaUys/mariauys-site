// 1) Shared globals
let lightbox, lightboxCanvas, ctx, currentIndex = 0, images = [];

// 2) On DOM ready:
document.addEventListener('DOMContentLoaded', () => {
  // Cache elements
  lightbox = document.getElementById('lightbox');
  lightboxCanvas = document.getElementById('lightboxCanvas');
  ctx = lightboxCanvas.getContext('2d');

  // Lightbox controls
  document.querySelector('.close-btn-lightbox')?.addEventListener('click', closeLightbox);
  document.querySelector('.nav-left')?.addEventListener('click', () => navigate(-1));
  document.querySelector('.nav-right')?.addEventListener('click', () => navigate(1));
  lightbox?.addEventListener('click', e => { if (e.target===lightbox) closeLightbox(); });

  // Mobile CV label
  const cvLink = document.querySelector('.cv-label');
  if (cvLink) cvLink.textContent = /Mobi|Android/i.test(navigator.userAgent) ? 'Download CV' : 'CV';
});

// 3) Menu toggle & dropdown
function toggleMenu(e) {
  const menu = document.getElementById('mobileMenu'),
        overlay = document.getElementById('overlay');
  if (e?.target.closest('.portfolio-sub')) return;
  menu.classList.toggle('open');
  overlay.style.display = menu.classList.contains('open') ? 'block' : 'none';
}
function toggleDropdown(el){ el.classList.toggle('open'); }

document.addEventListener('click', e=>{
  const menu = document.getElementById('mobileMenu'),
        overlay = document.getElementById('overlay'),
        ham = document.querySelector('.hamburger');
  if (!menu.contains(e.target) && !ham.contains(e.target)) {
    menu.classList.remove('open');
    overlay.style.display='none';
  }
});

// 4) Lightbox functions
function openLightbox(i) {
  currentIndex = i;
  drawToLightbox(images[i]);
  lightbox.style.display='flex';
}
function closeLightbox(){ lightbox.style.display='none'; }
function navigate(dir){ openLightbox((currentIndex+dir+images.length)%images.length); }

// 5) Draw with correct aspect ratio & retina support
function drawToLightbox(img) {
  const maxW = window.innerWidth * .9,
        maxH = window.innerHeight * .8,
        ratio = Math.min(maxW/img.naturalWidth, maxH/img.naturalHeight),
        dispW = img.naturalWidth*ratio,
        dispH = img.naturalHeight*ratio,
        dpr = window.devicePixelRatio || 1;

  lightboxCanvas.width  = dispW*dpr;
  lightboxCanvas.height = dispH*dpr;
  lightboxCanvas.style.width  = dispW+'px';
  lightboxCanvas.style.height = dispH+'px';

  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.imageSmoothingEnabled = true;
  ctx.clearRect(0,0,dispW,dispH);
  ctx.drawImage(img,0,0,dispW,dispH);
}

function openLightboxFromPath(path) {
  const img = new Image();
  img.onload = () => {
    drawToLightbox(img);
    lightbox.style.display = 'flex';
  };
  img.src = path;
}

// Hover swap for Afrigarde grid
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.afri-item img').forEach(img => {
    const original = img.src;
    const hover = img.getAttribute('data-hover');
    if (hover) {
      img.addEventListener('mouseenter', () => img.src = hover);
      img.addEventListener('mouseleave', () => img.src = original);
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Lightbox trigger for static img tags
  document.querySelectorAll('.lightbox-trigger').forEach(img => {
    img.addEventListener('click', () => {
      const src = img.getAttribute('data-src') || img.src;
      openLightboxFromPath(path);
    });
  });
});

