/* Consenso cookie — Dott. Antonio Colamaria
   Strumenti statistici caricati SOLO dopo consenso esplicito (Linee guida Garante Privacy 10/06/2021).
   Inserire qui gli ID quando disponibili: se vuoti, il banner non compare e nulla viene caricato. */
(function () {
  var CONFIG = {
    ga: '',       // Google Analytics 4, es. 'G-XXXXXXXXXX'
    clarity: ''   // Microsoft Clarity, es. 'abcd1234ef'
  };
  var KEY = 'cc_v1', MAX_AGE = 1000 * 60 * 60 * 24 * 180; // nuova richiesta dopo 6 mesi
  var tools = [];
  if (CONFIG.ga) tools.push({ id: 'ga', name: 'Google Analytics', desc: 'statistiche anonime sulle visite (pagine viste, provenienza, dispositivo)' });
  if (CONFIG.clarity) tools.push({ id: 'clarity', name: 'Microsoft Clarity', desc: 'come vengono usate le pagine (clic, scorrimento), per migliorare il sito' });

  function read() { try { var v = JSON.parse(localStorage.getItem(KEY)); if (v && Date.now() - v.ts < MAX_AGE) return v; } catch (e) {} return null; }
  function save(c) { c.ts = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} }

  var loaded = {};
  function loadGA() {
    if (loaded.ga || !CONFIG.ga) return; loaded.ga = 1;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
    gtag('js', new Date()); gtag('config', CONFIG.ga);
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.ga; document.head.appendChild(s);
  }
  function loadClarity() {
    if (loaded.clarity || !CONFIG.clarity) return; loaded.clarity = 1;
    (function (c, l, a, r, i, t, y) { c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i; y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CONFIG.clarity);
    window.clarity('consent');
  }
  function clearCookies() {
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (/^(_ga|_gid|_gat|_clck|_clsk|CLID|MUID|ANONCHK|SM)/.test(n)) {
        var host = location.hostname.replace(/^www\./, '');
        ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) { document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d; });
      }
    });
  }
  function apply(c) { if (c.ga) loadGA(); if (c.clarity) loadClarity(); }

  var box;
  function close() { if (box) { box.remove(); box = null; } }
  function decide(c) {
    var prev = read(); save(c); close();
    var revoked = prev && ((prev.ga && !c.ga) || (prev.clarity && !c.clarity));
    if (revoked) { clearCookies(); location.reload(); return; }
    apply(c);
  }
  function all(v) { var c = {}; tools.forEach(function (t) { c[t.id] = v; }); return c; }

  function show(detail) {
    if (!tools.length) return;
    close();
    var cur = read() || {};
    box = document.createElement('div');
    box.className = 'cc'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Preferenze cookie');
    var rows = tools.map(function (t) {
      return '<label class="cc-row"><input type="checkbox" data-t="' + t.id + '"' + (cur[t.id] ? ' checked' : '') + '><span><b>' + t.name + '</b> — ' + t.desc + '</span></label>';
    }).join('');
    box.innerHTML =
      '<button type="button" class="cc-x" aria-label="Chiudi senza accettare">×</button>' +
      '<p class="cc-t">Questo sito usa solo cookie tecnici e, <b>se lo accetti</b>, cookie statistici per capire come viene usato e migliorarlo. Nessun cookie di pubblicità. ' +
      '<a href="cookie.html">Cookie Policy</a></p>' +
      '<div class="cc-detail"' + (detail ? '' : ' hidden') + '>' + rows +
      '<p class="cc-tech">Cookie tecnici: sempre attivi, necessari al funzionamento del sito.</p></div>' +
      '<div class="cc-btns">' +
      '<button type="button" class="cc-b" data-a="no">Rifiuta</button>' +
      '<button type="button" class="cc-b cc-pref" data-a="pref"' + (detail ? ' hidden' : '') + '>Personalizza</button>' +
      '<button type="button" class="cc-b" data-a="save"' + (detail ? '' : ' hidden') + '>Salva le scelte</button>' +
      '<button type="button" class="cc-b cc-yes" data-a="yes">Accetta</button></div>';
    document.body.appendChild(box);
    box.addEventListener('click', function (e) {
      var a = e.target.getAttribute('data-a');
      if (e.target.classList.contains('cc-x') || a === 'no') return decide(all(false));
      if (a === 'yes') return decide(all(true));
      if (a === 'pref') { box.querySelector('.cc-detail').hidden = false; e.target.hidden = true; box.querySelector('[data-a="save"]').hidden = false; return; }
      if (a === 'save') { var c = {}; box.querySelectorAll('input[data-t]').forEach(function (i) { c[i.getAttribute('data-t')] = i.checked; }); return decide(c); }
    });
  }

  function init() {
    // link "Preferenze cookie" nel footer
    document.querySelectorAll('.cc-open').forEach(function (b) {
      if (!tools.length) { b.hidden = true; var sep = b.previousSibling; if (sep && sep.nodeType === 3) sep.textContent = sep.textContent.replace(/\s·\s$/, ''); return; }
      b.addEventListener('click', function () { show(true); });
    });
    if (!tools.length) return;
    var c = read();
    if (c) apply(c); else show(false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
