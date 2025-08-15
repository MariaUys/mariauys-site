---
title: "Maria Uys — Designer & Artist"
bodyClass: home
layout: layout.njk
permalink: "index.html"
---
<section class="hero reveal">
  <div class="hero-bg">
    <img src="/static/uploads/graphic-design/img1.gif" data-no-cdn alt="" aria-hidden="true" loading="eager" decoding="async" width="1191" height="842">
  </div>
  <div class="hero-copy">
    <h1><span>Maria Uys</span></h1>
    <p class="tagline">Brand Identity · Packaging · Illustration · Textile · Styling</p>
    <a class="btn" href="#work">View the work ↓</a>
  </div>
</section>

<section id="work" class="cards">
  <a class="card reveal" href="brand-identity.html">
    <img src="/static/uploads/brand-identity/img3.jpg" alt="Brand Identity" loading="lazy" decoding="async" width="2480" height="2480">
    <h3>Brand Identity</h3>
  </a>
  <a class="card reveal" href="graphic-design.html">
    <img src="/static/uploads/graphic-design/img2.jpg" alt="Graphic Design" loading="lazy" decoding="async" width="960" height="640">
    <h3>Graphic Design</h3>
  </a>
  <a class="card reveal" href="illustration.html">
    <img src="/static/uploads/illustration/img1.jpg" alt="Illustration" loading="lazy" decoding="async" width="3840" height="3840">
    <h3>Illustration</h3>
  </a>
  <a class="card reveal" href="packaging-design.html">
    <img src="/static/uploads/packaging-design/img1.jpg" alt="Packaging Design" loading="lazy" decoding="async" width="6633" height="3508">
    <h3>Packaging</h3>
  </a>
  <a class="card reveal" href="stylist.html">
    <img src="/static/uploads/stylist/img1.jpg" alt="Stylist" loading="lazy" decoding="async" width="1280" height="853">
    <h3>Stylist</h3>
  </a>
  <a class="card reveal" href="textile-design.html">
    <img src="/static/uploads/textile-design/img1.jpg" alt="Textile Design" loading="lazy" decoding="async" width="1200" height="849">
    <h3>Textile</h3>
  </a>
</section>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  });
</script>
