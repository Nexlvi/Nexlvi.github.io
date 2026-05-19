(function () {
  var STORAGE_KEY = 'kira-theme';
  var ATTR = 'data-theme';

  function getPref() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark';
  }

  function apply(theme) {
    document.documentElement.setAttribute(ATTR, theme);
  }

  function toggle() {
    var cur = document.documentElement.getAttribute(ATTR);
    var next = cur === 'dark' ? 'light' : 'dark';
    apply(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  // ---- build button ----
  function buildButton() {
    var btn = document.createElement('button');
    btn.id = 'themeToggle';
    btn.title = '切换深浅色';
    btn.setAttribute('aria-label', '切换深浅色');
    btn.innerHTML =
      '<svg class="kira-theme-icon-dark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' +
      '<svg class="kira-theme-icon-light" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>' +
      '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>' +
      '<line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>' +
      '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

    btn.addEventListener('click', toggle);

    var wrap = document.createElement('div');
    wrap.className = 'kira-theme-toggle';
    wrap.appendChild(btn);

    // inject into right column, before the back-to-top button
    var col = document.querySelector('.kira-right-column');
    if (col) {
      col.insertBefore(wrap, col.firstChild);
    }
  }

  // init
  apply(getPref());

  function init() {
    buildButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // system theme change
  window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      apply(e.matches ? 'dark' : 'light');
    }
  });

  // ---- link prefetch ----
  var prefetched = new Set();
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var href = e.target.href;
        if (href && !prefetched.has(href)) {
          prefetched.add(href);
          var link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = href;
          document.head.appendChild(link);
        }
      }
    });
  });

  function observeLinks() {
    var links = document.querySelectorAll('a[href^="/"]:not([target]):not([download])');
    links.forEach(function (a) {
      var h = a.href;
      if (!prefetched.has(h) && h !== location.href && h.indexOf('#') === -1) {
        observer.observe(a);
      }
    });
  }

  observeLinks();
  new MutationObserver(observeLinks).observe(document.body, { childList: true, subtree: true });
})();
