// Interaksi tambahan paket Serius. Tidak perlu diubah.
// Setiap fitur hanya aktif jika elemennya ada di halaman.

(function () {
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }
  function fmt(v, dec) { return v.toFixed(dec).replace('.', ','); }

  // ----- Angka hasil menghitung naik -----
  function countUp(el) {
    var to = parseFloat(el.dataset.to), dec = +el.dataset.dec || 0, suf = el.dataset.suffix || '';
    if (calm) { el.textContent = fmt(to, dec) + suf; return; }
    var start = null, dur = 1400;
    function tick(t) {
      if (!start) start = t;
      var k = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(to * e, dec) + suf;
      if (k < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    each('.count', function (el) { cio.observe(el); });
  }

  // ----- Slider sebelum/sesudah -----
  each('.ba', function (box) {
    var range = box.querySelector('.ba-range');
    if (!range) return;
    function set() { box.style.setProperty('--pos', range.value + '%'); }
    range.addEventListener('input', set);
    set();
  });

  // ----- Hero slideshow (Desain 1) -----
  each('.slides', function (wrap) {
    var slides = wrap.querySelectorAll('.slide');
    var dots = document.querySelectorAll('.slide-dot');
    var cap = document.querySelector('.slide-caption');
    if (slides.length < 2) return;
    var i = 0, timer;
    function show(n) {
      slides[i].classList.remove('on');
      if (dots[i]) dots[i].setAttribute('aria-pressed', 'false');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('on');
      if (dots[i]) dots[i].setAttribute('aria-pressed', 'true');
      if (cap) cap.textContent = slides[i].dataset.caption || '';
    }
    function play() { if (!calm) timer = setInterval(function () { show(i + 1); }, 5000); }
    Array.prototype.forEach.call(dots, function (d, n) {
      d.addEventListener('click', function () { clearInterval(timer); show(n); play(); });
    });
    play();
  });

  // ----- Pratinjau karya mengikuti kursor (Desain 1) -----
  var peek = document.querySelector('.peek');
  if (peek && finePointer) {
    var pImg = peek.querySelector('img'), pText = peek.querySelector('.peek-text');
    var x = 0, y = 0, px = 0, py = 0, raf;
    function loop() {
      px += (x - px) * 0.18; py += (y - py) * 0.18;
      peek.style.transform = 'translate(' + px + 'px,' + py + 'px)';
      raf = requestAnimationFrame(loop);
    }
    each('.row', function (row) {
      row.addEventListener('mouseenter', function () {
        var thumb = row.dataset.thumb;
        if (thumb) { pImg.src = thumb; pImg.hidden = false; pText.hidden = true; }
        else {
          var ex = row.querySelector('.excerpt');
          pText.textContent = ex ? ex.textContent : '';
          pImg.hidden = true; pText.hidden = false;
        }
        peek.classList.toggle('tegak', row.classList.contains('vertikal'));
        peek.classList.add('on');
        if (!raf) loop();
      });
      row.addEventListener('mouseleave', function () { peek.classList.remove('on'); });
    });
    document.addEventListener('mousemove', function (e) { x = e.clientX + 24; y = e.clientY - 80; });
  }

  // ----- Huruf nama bereaksi saat disentuh (Desain 2) -----
  each('.wiggle', function (el) {
    var text = el.textContent;
    el.setAttribute('aria-label', text.replace(/\s+/g, ' ').trim());
    el.textContent = '';
    text.split('').forEach(function (ch) {
      var s = document.createElement('span');
      s.setAttribute('aria-hidden', 'true');
      if (ch === ' ') { s.className = 'sp'; s.innerHTML = '&nbsp;'; }
      else { s.className = 'ch'; s.textContent = ch; }
      el.appendChild(s);
    });
    if (calm) return;
    el.addEventListener('pointerover', function (e) {
      var t = e.target;
      if (!t.classList || !t.classList.contains('ch')) return;
      t.classList.remove('hit'); void t.offsetWidth; t.classList.add('hit');
      clearTimeout(t._h);
      t._h = setTimeout(function () { t.classList.remove('hit'); }, 900);
    });
  });

  // ----- Galeri geser horizontal (Desain 2) -----
  each('.track-wrap', function (wrap) {
    var track = wrap.querySelector('.track');
    var bar = wrap.querySelector('.track-progress span');
    var prev = wrap.querySelector('.track-prev'), next = wrap.querySelector('.track-next');
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      var k = max > 0 ? track.scrollLeft / max : 1;
      if (bar) bar.style.width = Math.max(8, k * 100) + '%';
      if (prev) prev.disabled = track.scrollLeft < 4;
      if (next) next.disabled = track.scrollLeft > max - 4;
    }
    function step(dir) { track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: calm ? 'auto' : 'smooth' }); }
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    document.querySelectorAll('.chip').forEach(function (c) { c.addEventListener('click', function () { track.scrollLeft = 0; setTimeout(update, 50); }); });
    // geser dengan mouse
    var down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = false; sx = e.clientX; sl = track.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 5) { moved = true; track.classList.add('dragging'); }
      track.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () { down = false; track.classList.remove('dragging'); });
    track.addEventListener('click', function (e) { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
    update();
  });

  // ----- Tab case study (Desain 2) -----
  each('[role="tablist"]', function (list) {
    var tabs = list.querySelectorAll('[role="tab"]');
    function select(tab) {
      Array.prototype.forEach.call(tabs, function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) {
          panel.hidden = !on;
          if (on) panel.querySelectorAll('.count').forEach(function (c) { countUp(c); });
        }
      });
    }
    Array.prototype.forEach.call(tabs, function (t, n) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        var nt = tabs[(n + d + tabs.length) % tabs.length];
        select(nt); nt.focus();
      });
    });
  });

  // ----- Kartu miring mengikuti kursor (Desain 3) -----
  if (finePointer && !calm) {
    each('[data-tilt]', function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
        el.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-2px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  // ----- Buka/tutup case study (Desain 3) -----
  each('.case-toggle', function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      btn.querySelector('.toggle-text').textContent = open ? 'Tutup prosesnya' : 'Lihat prosesnya';
      if (panel) panel.classList.toggle('open', open);
    });
  });

  // ----- Tombol mode terang/gelap (Desain 3) -----
  var tbtn = document.querySelector('.theme-toggle');
  if (tbtn) {
    var root = document.documentElement;
    try { var saved = localStorage.getItem('mode'); if (saved) root.dataset.theme = saved; } catch (e) {}
    function label() {
      var dark = root.dataset.theme === 'gelap';
      tbtn.setAttribute('aria-pressed', String(dark));
      tbtn.querySelector('span').textContent = dark ? 'Mode terang' : 'Mode gelap';
    }
    tbtn.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'gelap' ? 'terang' : 'gelap';
      try { localStorage.setItem('mode', root.dataset.theme); } catch (e) {}
      label();
    });
    label();
  }
})();
