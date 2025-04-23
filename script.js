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
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  lightboxCanvas.width = canvasWidth;
  lightboxCanvas.height = canvasHeight;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const imgRatio = img.naturalWidth / img.naturalHeight;
  const maxW = canvasWidth * 0.9;
  const maxH = canvasHeight * 0.9;

  let drawW = img.naturalWidth;
  let drawH = img.naturalHeight;

  if (drawW > maxW || drawH > maxH) {
    if (imgRatio > maxW / maxH) {
      drawW = maxW;
      drawH = drawW / imgRatio;
    } else {
      drawH = maxH;
      drawW = drawH * imgRatio;
    }
  }

  const offsetX = (canvasWidth - drawW) / 2;
  const offsetY = (canvasHeight - drawH) / 2;

  ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
}
