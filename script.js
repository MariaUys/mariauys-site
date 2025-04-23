// Global variables
let lightbox, lightboxCanvas, ctx, currentIndex = 0;
let images = [];

// Initialize after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  lightbox = document.getElementById('lightbox');
  lightboxCanvas = document.getElementById('lightboxCanvas');
  if (lightboxCanvas) ctx = lightboxCanvas.getContext('2d');

  // Lightbox control
  document.querySelector('.close-btn-lightbox')?.addEventListener('click', closeLightbox);
  document.querySelector('.nav-left')?.addEventListener('click', () => navigate(-1));
  document.querySelector('.nav-right')?.addEventListener('click', () => navigate(1));
  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Mobile CV label
  const cvLink = document.querySelector('.cv-label');
  if (cvLink) {
    cvLink.textContent = /Mobi|Android/i.test(navigator.userAgent) ? 'Download CV' : 'CV';
  }
});

// Hamburger menu toggle
function toggleMenu(e) {
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("overlay");
  if (e && e.target.closest('.portfolio-sub')) return;
  menu.classList.toggle("open");
  overlay.style.display = menu.classList.contains("open") ? "block" : "none";
}

// Dropdown toggle
function toggleDropdown(element) {
  element.classList.toggle("open");
}

// Close menu on outside click
document.addEventListener('click', function(event) {
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("overlay");
  const hamburger = document.querySelector('.hamburger');
  if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
    menu.classList.remove("open");
    overlay.style.display = "none";
  }
});

// Lightbox navigation
function openLightbox(index) {
  currentIndex = index;
  drawToLightbox(images[index]);
  lightbox.style.display = 'flex';
}

function closeLightbox() {
  lightbox.style.display = 'none';
}

function navigate(direction) {
  currentIndex = (currentIndex + direction + images.length) % images.length;
  drawToLightbox(images[currentIndex]);
}

// Aspect-ratio-preserving lightbox renderer
function drawToLightbox(img) 
function openLightboxFromPath(path) {
  const img = new Image();
  img.onload = () => {
    drawToLightbox(img);
    lightbox.style.display = 'flex';
  };
  img.src = path;
}
{
  const maxWidth = window.innerWidth * 0.9;
  const maxHeight = window.innerHeight * 0.8;

  const imgRatio = img.naturalWidth / img.naturalHeight;
  const boxRatio = maxWidth / maxHeight;

  let displayWidth, displayHeight;

  if (imgRatio > boxRatio) {
    displayWidth = Math.min(img.naturalWidth, maxWidth);
    displayHeight = displayWidth / imgRatio;
  } else {
    displayHeight = Math.min(img.naturalHeight, maxHeight);
    displayWidth = displayHeight * imgRatio;
  }

  // Retina display support
  const dpr = window.devicePixelRatio || 1;
  lightboxCanvas.width = displayWidth * dpr;
  lightboxCanvas.height = displayHeight * dpr;
  lightboxCanvas.style.width = `${displayWidth}px`;
  lightboxCanvas.style.height = `${displayHeight}px`;

  // Make drawings scale properly
  const ctx = lightboxCanvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, lightboxCanvas.width, lightboxCanvas.height);
  ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
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
