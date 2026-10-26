/* Shared language switcher for demo screens.
   Any element with data-en / data-pt gets its textContent swapped.
   Elements with data-en-ph / data-pt-ph get their placeholder swapped.
   Language comes from location.hash (#en or #pt) and from parent postMessage({lang}). */
(function(){
  function apply(lang){
    lang = lang === 'pt' ? 'pt' : 'en';
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.querySelectorAll('[data-en]').forEach(function(el){
      var v = el.getAttribute('data-' + lang); if (v !== null) el.textContent = v;
    });
    document.querySelectorAll('[data-en-ph]').forEach(function(el){
      var v = el.getAttribute('data-' + lang + '-ph'); if (v !== null) el.setAttribute('placeholder', v);
    });
    window.DEMO_LANG = lang;
    document.dispatchEvent(new CustomEvent('demo-lang', {detail: lang}));
  }
  window.addEventListener('message', function(e){ if (e.data && e.data.lang) apply(e.data.lang); });
  window.addEventListener('hashchange', function(){ apply(location.hash.slice(1)); });
  document.addEventListener('DOMContentLoaded', function(){ apply(location.hash.slice(1) || 'en'); });
})();
/* Forward wheel scrolling to the portfolio page so the scroll story keeps moving over demos. */
window.addEventListener('wheel', function(e){ if (window.parent !== window) window.parent.postMessage({demoWheel: e.deltaY}, '*'); }, {passive: true});
