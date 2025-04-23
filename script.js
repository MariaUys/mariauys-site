# Let's prepare the complete and corrected `script.js` content based on the requirements:
# - Dynamic lightbox
# - Responsive image sizing with aspect ratio preserved
# - Support navigation and overlay
# - Auto-adjusts for CV link on mobile
# - Menu toggle support

script_js_content = """
// Global variables
let lightbox, lightboxCanvas, ctx, currentIndex = 0;
let images = [];

// Initialize after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  lightbox = document.getElementById('lightbox');
  lightboxCanvas = document.getElementById('lightboxCanvas');
  ctx = lightboxCanvas.getContext('2d');

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

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.clearRect(0, 0, displayWidth, displayHeight);
  ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
}
"""

# Save to file so user can download it
import os
script_path = "/mnt/data/script.js"
with open(script_path, "w") as f:
    f.write(script_js_content)

script_path

