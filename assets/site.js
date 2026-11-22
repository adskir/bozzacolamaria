// Menu mobile e pulsanti flottanti
(function () {
  var doc = document.documentElement;
  doc.classList.add('js');

  // Menu "hamburger"
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('menu');
  if (btn && nav) {
    var close = function () {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Apri il menu');
    };
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 860) close(); });
  }


  // Mobile: "Patologie" apre e chiude il sottomenu invece di portare alla home
  var dd = document.querySelector('nav .dd');
  if (dd) {
    var top = dd.querySelector('.dd-top');
    top.setAttribute('aria-expanded', 'false');
    top.addEventListener('click', function (e) {
      if (window.innerWidth > 860) return;
      e.preventDefault(); e.stopPropagation();
      var o = dd.classList.toggle('open');
      top.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
  }


  // Video: il player YouTube (youtube-nocookie) si carica solo quando il visitatore clicca
  document.querySelectorAll('.vid[data-yt] .vid-poster').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var box = btn.parentNode, id = box.getAttribute('data-yt');
      var wrap = document.createElement('div'); wrap.className = 'vid-frame';
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      f.title = 'Video'; f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true;
      wrap.appendChild(f); box.replaceChild(wrap, btn);
    });
  });

  // In home: il pulsante "Prenota" della testata, la barra di chiamata e WhatsApp
  // compaiono solo quando i pulsanti del primo schermo non sono più visibili.
  var hero = document.querySelector('.hero-actions');
  if (hero && 'IntersectionObserver' in window) {
    doc.classList.add('has-hero');
    new IntersectionObserver(function (entries) {
      doc.classList.toggle('past-hero', !entries[0].isIntersecting);
    }).observe(hero);
  }

  var y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
})();
