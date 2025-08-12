---
title: "Illustration"
bodyClass: illustration
layout: layout.njk
permalink: "illustration.html"
---
<h1>Illustration</h1>
<div class="gallery" id="gallery"></div>
<script>
document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('gallery');
  const exts = ['jpg','jpeg','png','gif','webp'];
  let i = 1, misses = 0;
  function tryNext(iLocal) {
    let e = 0, found = false;
    (function attempt() {
      if (e >= exts.length) {
        if (!found) misses++;
        if (misses >= 2) return;
        i++;
        misses = misses;
        tryNext(i);
        return;
      }
      const path = `portfolio/illustration/images/img${i}.${exts[e]}`;
      const test = new Image();
        test.onload = () => {
          found = true; misses = 0;
          const thumb = document.createElement('img');
          thumb.src = path;
          thumb.alt = `Illustration ${i}`;
          thumb.loading = 'lazy';
          thumb.decoding = 'async';
          thumb.style.width = '100%';
          thumb.style.height = 'auto';
          const index = gallerySources.push(path) - 1;
          thumb.addEventListener('click', () => openLightbox(index));
          gallery.appendChild(thumb);
          i++;
          tryNext(i);
        };
      test.onerror = () => { e++; attempt(); };
      test.src = path;
    })();
  }
  tryNext(i);
});
</script>
