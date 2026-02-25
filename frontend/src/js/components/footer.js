// footer — à importer dans chaque page, nécessite <div id="footer-placeholder"></div>

const FOOTER_HTML = `
<footer class="site-footer">
  <div class="container">
    <div class="site-footer__inner">

      <div class="site-footer__brand">
        <a href="/" class="site-footer__logo">DevFlow</a>
        <p class="site-footer__tagline">
          Le blog des développeurs passionnés — tutoriels, conseils et actualités tech.
        </p>
      </div>

      <nav class="site-footer__nav" aria-label="Navigation du pied de page">
         <a href="/pages/legal.html" class="site-footer__link">Mentions légales</a>
      </nav>

    </div>

    <div class="site-footer__bottom">
      <p>© 2026 DevFlow — Tous droits réservés.</p>
    </div>
  </div>
</footer>
`;


export function initFooter() {
  const placeholder = document.getElementById('footer-placeholder');
  if (!placeholder) return;

  placeholder.outerHTML = FOOTER_HTML;
}
