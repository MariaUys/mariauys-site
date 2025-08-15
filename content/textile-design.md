---
title: "Textile Design"
bodyClass: textile
layout: layout.njk
permalink: "textile-design.html"
---
<h1>Textile Design</h1>
<div class="gallery" id="gallery"></div>
<script>
document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('gallery');
  const exts = ['jpg','jpeg','png','gif'];
  let idx = 1;
  function tryLoad() {
    let e = 0, img = new Image();
    (function attempt() {
      if (e >= exts.length) return;
      img.src = `/static/uploads/textile-design/img${idx}.${exts[e]}`;
      img.onload = () => {
        const c = document.createElement('canvas');
        const ctx = c.getContext('2d');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        c.style.width = '100%';
        c.style.height = 'auto';
        ctx.drawImage(img, 0, 0, c.width, c.height);
        gallery.appendChild(c);
        const hr = document.createElement('hr');
        gallery.appendChild(hr);
        idx++;
        tryLoad();
      };
      img.onerror = () => { e++; attempt(); };
    })();
  }
  tryLoad();
});
</script>
