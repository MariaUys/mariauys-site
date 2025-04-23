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

// Adjust CV label on mobile
document.addEventListener('DOMContentLoaded', () => {
  const cvLink = document.querySelector('.cv-label');
  if (cvLink) {
  if (/Mobi|Android/i.test(navigator.userAgent)) {
  const cvLink = document.querySelector('.cv-label');
    } else {
      cvLink.textContent = 'CV';
    }
  }
});

// Only run this block on the illustration page
if (document.querySelector('.gallery') && document.title.includes('Illustration')) {
  const imageCount = 9;
  const gallery = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  const lightboxCanvas = document.getElementById('lightboxCanvas');
  const ctx = lightboxCanvas.getContext('2d');
  let currentIndex = 0;
  const images = [];

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

  function drawToLightbox(img) {
    lightboxCanvas.width = img.width;
    lightboxCanvas.height = img.height;
    ctx.clearRect(0, 0, lightboxCanvas.width, lightboxCanvas.height);
    ctx.drawImage(img, 0, 0);
  }

  for (let i = 1; i <= imageCount; i++) {
    const canvas = document.createElement('canvas');
    const thumbCtx = canvas.getContext('2d');
    const img = new Image();
    img.src = `portfolio/illustration/images/img${i}.jpg`;
    images.push(img);
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      thumbCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    canvas.onclick = () => openLightbox(i - 1);
    gallery.appendChild(canvas);
  }

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Expose these globally in case needed elsewhere
  window.closeLightbox = closeLightbox;
  window.navigate = navigate;
}
