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
