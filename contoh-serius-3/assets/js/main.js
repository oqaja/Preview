// Filter karya dan jendela untuk video, gambar, atau tulisan.
// Tidak perlu diubah.

(function () {
  var chips = document.querySelectorAll('.chip');
  var works = document.querySelectorAll('.work');
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----- Karya muncul saat di-scroll -----
  if (!calm && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-anim');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    works.forEach(function (w, i) {
      w.style.setProperty('--delay', (i % 3) * 0.08 + 's');
      io.observe(w);
    });
  }

  // ----- Filter -----
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.dataset.filter;
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      works.forEach(function (w) {
        w.hidden = !(f === 'semua' || w.dataset.kategori === f);
        if (!w.hidden && !calm) {
          w.classList.add('in');
          w.classList.remove('pop');
          void w.offsetWidth; // mulai ulang animasi
          w.classList.add('pop');
        }
      });
    });
  });

  // ----- Jendela karya -----
  var dialog = document.querySelector('.viewer');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  var title = dialog.querySelector('#viewer-title');
  var body = dialog.querySelector('.viewer-body');

  function note(text) {
    var p = document.createElement('p');
    p.className = 'viewer-note';
    p.textContent = text;
    return p;
  }

  function open(work) {
    var tipe = work.dataset.tipe;
    var src = work.dataset.src || '';
    var heading = work.querySelector('h3');
    title.textContent = heading ? heading.textContent : '';
    body.innerHTML = '';

    if (tipe === 'video') {
      if (!src || src.indexOf('ID_VIDEO') !== -1) {
        body.appendChild(note('Ganti ID_VIDEO di data-src dengan ID video YouTube kamu.'));
      } else {
        var iframe = document.createElement('iframe');
        iframe.src = src + (src.indexOf('?') === -1 ? '?' : '&') + 'autoplay=1&rel=0';
        iframe.title = title.textContent;
        iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        iframe.allowFullscreen = true;
        if (work.classList.contains('vertikal')) iframe.className = 'vertikal';
        body.appendChild(iframe);
      }
    } else if (tipe === 'gambar') {
      var img = document.createElement('img');
      var thumb = work.querySelector('img');
      img.src = src;
      img.alt = thumb ? thumb.alt : '';
      body.appendChild(img);
    } else if (tipe === 'tulisan') {
      var tpl = work.querySelector('template');
      var wrap = document.createElement('div');
      wrap.className = 'text';
      if (tpl) wrap.appendChild(tpl.content.cloneNode(true));
      body.appendChild(wrap);
    }

    dialog.showModal();
  }

  works.forEach(function (work) {
    var btn = work.querySelector('.work-open');
    if (btn) btn.addEventListener('click', function () { open(work); });
  });

  function close() { dialog.close(); }
  dialog.querySelector('.viewer-close').addEventListener('click', close);
  dialog.addEventListener('click', function (e) { if (e.target === dialog) close(); });
  dialog.addEventListener('close', function () { body.innerHTML = ''; });
})();
