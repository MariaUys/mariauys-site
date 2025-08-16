document.addEventListener('DOMContentLoaded', () => {
  const opener = document.getElementById('opener');
  requestAnimationFrame(() => opener.classList.add('animate'));

  const enter = document.getElementById('enter');
  const chaptersEl = document.getElementById('chapters');
  const topbar = document.getElementById('topbar');

  const gotoChapters = () => chaptersEl.scrollIntoView({ behavior: 'smooth' });
  enter.addEventListener('click', gotoChapters);
  window.addEventListener('wheel', function onFirstScroll() {
    gotoChapters();
    window.removeEventListener('wheel', onFirstScroll);
  }, { once: true, passive: true });

  const chapters = [...document.querySelectorAll('.chapter')];
  const dots = [...document.querySelectorAll('#progress button')];
  const prev = document.querySelector('.arrow.prev');
  const next = document.querySelector('.arrow.next');
  let current = 0;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        current = chapters.indexOf(entry.target);
        updateNav();
      }
    });
  }, { threshold: 0.6 });

  chapters.forEach((ch, i) => {
    io.observe(ch);
    const img = ch.querySelector('img');
    if (img) {
      img.decode().then(() => img.classList.add('loaded')).catch(() => img.classList.add('loaded'));
    }
  });

  function updateNav() {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
    prev.disabled = current === 0;
    next.disabled = current === chapters.length - 1;
    const isDark = chapters[current].classList.contains('dark');
    topbar.classList.toggle('dark', isDark);
  }

  const scrollToIndex = (i) => {
    if (i >= 0 && i < chapters.length) {
      chapters[i].scrollIntoView({ behavior: 'smooth' });
    }
  };

  prev.addEventListener('click', () => scrollToIndex(current - 1));
  next.addEventListener('click', () => scrollToIndex(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => scrollToIndex(i)));

  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      scrollToIndex(current + 1);
    } else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
      e.preventDefault();
      scrollToIndex(current - 1);
    }
  });

  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const parallaxEls = document.querySelectorAll('.parallax');
  if (!prefersReduce && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.speed) || 0.2;
        el.style.setProperty('--offset', `${y * speed * -1}px`);
      });
    }, { passive: true });
  }
});
