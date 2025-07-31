// Loader to ensure export_patch.js is loaded after all dependencies
(function() {
  function loadScript(url, cb) {
    var s = document.createElement('script');
    s.src = url;
    s.onload = cb;
    document.body.appendChild(s);
  }
  // Wait for DOM and all scripts
  window.addEventListener('load', function() {
    loadScript('assets/js/custom/apps/ecommerce/customers/listing/export_patch.js');
  });
})();
