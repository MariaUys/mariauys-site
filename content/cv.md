---
title: "CV"
bodyClass: cv-page
layout: layout.njk
permalink: "cv.html"
---
<h1>CV</h1>
<div id="cvContent"></div>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const container = document.getElementById('cvContent');
    const pdfPath = 'portfolio/cv/Maria_Uys_CV.pdf';
    if (isMobile) {
      const a = document.createElement('a');
      a.href = pdfPath;
      a.download = 'Maria_Uys_CV.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      container.innerHTML = `
        <p class="cv-message">
          Your download should begin shortly.<br><br>
          <a href="${pdfPath}" download>Click here if it doesn’t</a>
        </p>`;
    } else {
      container.innerHTML = `<iframe src="${pdfPath}" title="Maria Uys CV"></iframe>`;
    }
  });
</script>
