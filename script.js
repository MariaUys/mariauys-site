// script.js

// 1) Shared globals
let lightbox, lightboxCanvas, ctx, currentIndex = 0;
let images = [];

// 2) On DOM ready:
  lightbox       = document.getElementById('lightbox');
  const canvasEl = document.getElementById('lightboxCanvas');
  if (canvasEl) {
    lightboxCanvas = canvasEl;
    ctx            = canvasEl.getContext('2d');
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

  // CV label toggle
  const cvLink = document.querySelector('.cv-label');
  if (cvLink) {
    cvLink.textContent = /Mobi|Android/i.test(navigator.userAgent)
                         ? 'Download CV'
                         : 'CV';
  }

  // ––– Register all static triggers into images[] –––
  document.querySelectorAll('.lightbox-trigger').forEach((el, idx) => {
    // stash the source and preload
    const src = el.getAttribute('data-src') || el.src;
    const img = new Image();
    img.src = src;
    images.push(img);

    // wire it up
    el.addEventListener('click', () => openLightbox(idx));
  });
});

// 3) Menu toggles (unchanged)
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

// after your other DOMContentLoaded handlers:
document.querySelectorAll('.graphic-gallery img').forEach(img => {
  img.addEventListener('error', () => {
    // only run once
    if (img.dataset.triedAlt) return;
    img.dataset.triedAlt = true;

    // build list of alternates based on what failed
    const ext = img.src.split('.').pop().toLowerCase();
    const alts = ext === 'jpg'
      ? ['jpeg','png','gif']
      : ext === 'png'
      ? ['jpg','jpeg','gif']
      : ['jpg','jpeg','png'];
    
    for (let alt of alts) {
      const candidate = img.src.replace(/\.\w+$/, '.' + alt);
      // test it
      const tester = new Image();
      tester.onload = () => img.src = candidate;    // if it loads, swap
      tester.onerror = () => {};                    // no sweat
      tester.src = candidate;
    }
  });
});

// 4) Lightbox core

// Open by array index
function openLightbox(index) {
  currentIndex = index;
  drawToLightbox(images[index]);
  lightbox.style.display = 'flex';
}

// Convenience: open a one-off path
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

// cycle through images[]
function navigate(direction) {
  currentIndex = (currentIndex + direction + images.length) % images.length;
  drawToLightbox(images[currentIndex]);
}

// 5) Draw preserving aspect ratio + Retina
function drawToLightbox(img) {
  const maxW  = window.innerWidth * 0.9,
        maxH  = window.innerHeight * 0.8,
        ratio = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight),
        dispW = img.naturalWidth * ratio,
        dispH = img.naturalHeight * ratio,
        dpr   = window.devicePixelRatio || 1;

  lightboxCanvas.width        = dispW * dpr;
  lightboxCanvas.height       = dispH * dpr;
  lightboxCanvas.style.width  = dispW + 'px';
  lightboxCanvas.style.height = dispH + 'px';

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.clearRect(0, 0, dispW, dispH);
  ctx.drawImage(img, 0, 0, dispW, dispH);
}

// (Optional) Afrigarde hover‐swap fallback in JS, if you prefer
document.addEventListener('DOMContentLoaded', () => {
  if (!document.body.classList.contains('afrigarde')) return;
  document.querySelectorAll('.image-hover').forEach(container => {
    const def = container.querySelector('.default-img'),
          hov = container.querySelector('.hover-img');
    container.addEventListener('mouseenter', () => {
      def.style.opacity = 0; hov.style.opacity = 1;
    });
    container.addEventListener('mouseleave', () => {
      def.style.opacity = 1; hov.style.opacity = 0;
    });
  });
});
