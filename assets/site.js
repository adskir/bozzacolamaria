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
