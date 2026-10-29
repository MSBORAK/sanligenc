// Kayarken beliren bölümler, konuşma balonları ve gezinti çubuğu gölgesi
(function () {
  var nav = document.getElementById('nav');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var bubbles = Array.prototype.slice.call(document.querySelectorAll('.bubble'));

  // Hareket azaltma tercihi ya da IntersectionObserver yoksa her şey doğrudan görünür
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.concat(bubbles).forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      // aynı alandaki konuşma balonları da kısa gecikmeyle çıksın
      entry.target.querySelectorAll('.bubble').forEach(function (b) { b.classList.add('in'); });
      io.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });

  items.forEach(function (el) { io.observe(el); });
})();

// ---- Yayın günü: mağaza adreslerini buraya yaz, düğmeler otomatik aktif olur ----
(function () {
  var STORES = {
    ios: '',      // örn. 'https://apps.apple.com/tr/app/sanligenc/id0000000000'
    android: ''   // örn. 'https://play.google.com/store/apps/details?id=com.xxx'
  };
  var any = !!(STORES.ios || STORES.android);
  var both = !!(STORES.ios && STORES.android);
  document.querySelectorAll('[data-store]').forEach(function (el) {
    var url = STORES[el.getAttribute('data-store')];
    if (!url) return;
    var a = document.createElement('a');
    a.className = el.className;
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    a.innerHTML = el.innerHTML.replace(/Çok yakında/g, 'İndir');
    el.parentNode.replaceChild(a, el);
  });
  if (both) {
    ['dlTitle', 'dlSub'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.getAttribute('data-live')) el.innerHTML = el.getAttribute('data-live');
    });
  }
  if (any) {
    var nav = document.getElementById('navCta');
    if (nav) { nav.textContent = nav.getAttribute('data-live') || nav.textContent; nav.classList.remove('soon'); }
  }
})();


// ---- Akordiyon: telefonda ilk madde açık, diğerleri kapalı; masaüstünde hepsi açık ----
(function () {
  var mq = window.matchMedia('(min-width: 760px)');
  var groups = document.querySelectorAll('.cards, .steps');
  function apply() {
    groups.forEach(function (g) {
      g.querySelectorAll('details.acc').forEach(function (d, i) {
        if (mq.matches) d.open = true;
        else if (!d.dataset.touched) d.open = (i === 0);
      });
    });
  }
  document.querySelectorAll('details.acc > summary').forEach(function (s) {
    s.addEventListener('click', function (e) {
      if (mq.matches) e.preventDefault();
      else s.parentNode.dataset.touched = '1';
    });
  });
  apply();
  if (mq.addEventListener) mq.addEventListener('change', apply); else mq.addListener(apply);
})();
