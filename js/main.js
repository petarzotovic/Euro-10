(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Vidljiva verzija sajta: desktop (.site-d) ili telefon (.site-m) */
  function isVisible(el) { return !!(el && el.offsetParent !== null || (el && el.getClientRects().length)); }

  /* ---------- Hamburger meni (telefon) ---------- */
  var ham = document.querySelector('.ham-m');
  var mnav = document.getElementById('mnav-m');
  var closeT = null;
  function openMenu() {
    clearTimeout(closeT);
    mnav.hidden = false;
    mnav.classList.remove('closing');
    ham.setAttribute('aria-expanded', 'true');
    ham.setAttribute('aria-label', 'Zatvori meni');
  }
  function closeMenu(instant) {
    if (!mnav || mnav.hidden) return;
    ham.setAttribute('aria-expanded', 'false');
    ham.setAttribute('aria-label', 'Otvori meni');
    if (instant || reduceMotion) { mnav.hidden = true; return; }
    mnav.classList.add('closing');
    closeT = setTimeout(function () { mnav.hidden = true; mnav.classList.remove('closing'); }, 220);
  }
  if (ham && mnav) {
    ham.addEventListener('click', function () {
      if (ham.getAttribute('aria-expanded') === 'true') closeMenu(false); else openMenu();
    });
  }

  /* ---------- Glatko skrolovanje do sekcija ---------- */
  var raf = null;
  function visibleHeader() {
    var hs = document.querySelectorAll('header');
    for (var i = 0; i < hs.length; i++) if (hs[i].getClientRects().length) return hs[i];
    return null;
  }
  function smoothTo(y) {
    if (raf) cancelAnimationFrame(raf);
    if (reduceMotion) { window.scrollTo(0, y); return; }
    var start = window.scrollY || 0;
    var d = y - start;
    var T = Math.min(1400, 600 + Math.abs(d) * 0.2);
    var t0 = performance.now();
    function step(now) {
      var p = Math.min(1, (now - t0) / T);
      var k = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      window.scrollTo({ top: start + d * k, behavior: 'instant' });
      if (p < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    if (a.classList.contains('logo-link')) {
      e.preventDefault();
      if (history.replaceState) history.replaceState(null, '', window.location.pathname);
      window.scrollTo(0, 0);
      window.location.reload();
      return;
    }
    var id = a.getAttribute('href').slice(1);
    var el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    var h = visibleHeader();
    var top = el.getBoundingClientRect().top + (window.scrollY || 0) - (h ? h.offsetHeight : 0);
    closeMenu(true);
    smoothTo(top);
  });

  /* ---------- Sat u hero sekciji ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.dial'), function (dial) {
    var idle = dial.querySelector('.needle-idle');
    if (!idle) return;
    var hover = false, t = null, iv = null;
    var setNeedle = function (deg, dur) {
      idle.style.transition = 'transform ' + dur + 's ease-in-out';
      idle.style.transform = 'rotate(' + deg + 'deg)';
    };
    var swing = function () {
      setNeedle((hover ? 50 : 0) + Math.round(Math.random() * 14 - 7), 3);
    };
    var startIdle = function () {
      clearTimeout(t); clearInterval(iv);
      if (reduceMotion) return;
      t = setTimeout(function () { swing(); iv = setInterval(swing, 3100); }, 2600);
    };
    dial.addEventListener('mouseenter', function () { hover = true; setNeedle(50, 2.4); startIdle(); });
    dial.addEventListener('mouseleave', function () { hover = false; setNeedle(0, 2.6); startIdle(); });
    startIdle();
  });

  /* ---------- Recenzije: automatsko klizanje + prevlačenje ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.rev-viewport'), function (vp) {
    var tr = vp.querySelector('.rev-track');
    if (!tr) return;
    var x = 0, drag = false, sx = 0, sx0 = 0, paused = false, last = performance.now(), resume = null;
    var loop = function (now) {
      var dt = Math.min(64, now - last); last = now;
      if (vp.getClientRects().length) {
        if (!drag && !paused && !reduceMotion) x -= dt * 0.04;
        var h = tr.scrollWidth / 2;
        if (h > 0) { while (x <= -h) x += h; while (x > 0) x -= h; }
        tr.style.transform = 'translateX(' + x + 'px)';
      }
      requestAnimationFrame(loop);
    };
    var up = function () {
      if (!drag) return;
      drag = false; vp.classList.remove('dragging');
      clearTimeout(resume);
      resume = setTimeout(function () { paused = false; }, 3000);
    };
    vp.addEventListener('pointerdown', function (e) {
      drag = true; paused = true; sx = e.clientX; sx0 = x; clearTimeout(resume);
      vp.classList.add('dragging');
      if (vp.setPointerCapture) vp.setPointerCapture(e.pointerId);
    });
    vp.addEventListener('pointermove', function (e) { if (drag) x = sx0 + (e.clientX - sx); });
    vp.addEventListener('pointerup', up);
    vp.addEventListener('pointercancel', up);
    requestAnimationFrame(loop);
  });

  /* ---------- Usluge na telefonu: kartice ---------- */
  var svc = Array.prototype.slice.call(document.querySelectorAll('.svc-card'));
  if (svc.length === 3) {
    var active = 1;
    var layout = function () {
      svc.forEach(function (c, i) {
        var pos = ((i - active + 4) % 3) - 1;
        c.style.transform = 'translateX(calc(-50% + ' + (pos * 140) + 'px)) scale(' + (pos === 0 ? 1 : 0.85) + ')';
        c.style.zIndex = pos === 0 ? 3 : 1;
        c.classList.toggle('on', pos === 0);
        c.setAttribute('aria-pressed', pos === 0 ? 'true' : 'false');
      });
    };
    var swiped = false;
    svc.forEach(function (c, i) {
      c.addEventListener('click', function () {
        if (swiped) { swiped = false; return; }
        active = i; layout();
      });
    });
    /* prevlačenje prstom levo/desno */
    var stage = svc[0].parentElement, x0 = null;
    stage.style.touchAction = 'pan-y';
    stage.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    stage.addEventListener('pointercancel', function () { x0 = null; });
    stage.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) < 40) return;
      swiped = true; setTimeout(function () { swiped = false; }, 400);
      active = (active + (dx < 0 ? 1 : 2)) % 3;
      layout();
    });
    layout();
  }
})();
