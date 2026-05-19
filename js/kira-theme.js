(function () {
  // ---- theme toggle ----
  var STORAGE_KEY = 'kira-theme';
  var ATTR = 'data-theme';

  function getPref() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia('(prefers-color-scheme:dark)').matches) return 'dark';
    return 'light';
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

  // init on DOM ready
  apply(getPref());

  // wait for button to exist, then bind
  function bind() {
    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', toggle);
    } else {
      // sidebar might render after this script; retry once
      setTimeout(function () {
        var b = document.getElementById('themeToggle');
        if (b) b.addEventListener('click', toggle);
      }, 300);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }

  // listen for system theme changes
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
