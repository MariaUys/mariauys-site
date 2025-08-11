---
title: "Packaging Design"
bodyClass: packaging
layout: layout.njk
permalink: "packaging-design.html"
---
<h1>Packaging Design</h1>
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
        tryNext(i);
        return;
      }
      const path = `portfolio/packaging-design/images/img${i}.${exts[e]}`;
      const test = new Image();
      test.onload = () => {
        found = true; misses = 0;
        const thumb = document.createElement('img');
        thumb.src = path;
        thumb.alt = `Packaging ${i}`;
        thumb.loading = 'lazy';
        thumb.decoding = 'async';
        thumb.style.width = '100%';
        thumb.style.height = 'auto';
        thumb.addEventListener('click', () => openLightboxFromPath(path));
        gallery.appendChild(thumb);
        const hr = document.createElement('hr');
        gallery.appendChild(hr);
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
