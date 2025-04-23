// Global variables (put at the top of script.js)
let lightbox, lightboxCanvas, ctx, currentIndex = 0;
let images = [];

// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize elements
  lightbox = document.getElementById('lightbox');
  lightboxCanvas = document.getElementById('lightboxCanvas');
  ctx = lightboxCanvas.getContext('2d');

  // Optional: assign lightbox event listeners
  document.querySelector('.close-btn-lightbox')?.addEventListener('click', closeLightbox);
  document.querySelector('.nav-left')?.addEventListener('click', () => navigate(-1));
  document.querySelector('.nav-right')?.addEventListener('click', () => navigate(1));
  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
});

// Reuse this on all pages with images[] and currentIndex
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


function toggleMenu(e) {
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("overlay");
  if (e && e.target.closest('.portfolio-sub')) return;
  menu.classList.toggle("open");
  overlay.style.display = menu.classList.contains("open") ? "block" : "none";
}

function toggleDropdown(element) {
  element.classList.toggle("open");
}

document.addEventListener('click', function(event) {
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("overlay");
  const hamburger = document.querySelector('.hamburger');
  if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
    menu.classList.remove("open");
    overlay.style.display = "none";
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const cvLink = document.querySelector('.cv-label');
  if (cvLink) {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      cvLink.textContent = 'Download CV';
    } else {
      cvLink.textContent = 'CV';
    }
  }
});

function drawToLightbox(img) {
  const maxWidth = window.innerWidth * 0.9;
  const maxHeight = window.innerHeight * 0.8;

  const imgRatio = img.naturalWidth / img.naturalHeight;
  const boxRatio = maxWidth / maxHeight;

  let displayWidth, displayHeight;

  if (imgRatio > boxRatio) {
    displayWidth = maxWidth;
    displayHeight = maxWidth / imgRatio;
  } else {
    displayHeight = maxHeight;
    displayWidth = maxHeight * imgRatio;
  }

  lightboxCanvas.width = displayWidth;
  lightboxCanvas.height = displayHeight;

  ctx.clearRect(0, 0, displayWidth, displayHeight);
  ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
}
