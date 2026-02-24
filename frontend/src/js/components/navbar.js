// navbar — à importer dans chaque page, nécessite <div id="navbar-placeholder"></div>
import { API_BASE } from '../services/api.js';

const NAVBAR_HTML = `
<header class="site-header" id="site-header">
  <div class="container">
    <a href="/" class="logo-link">DevFlow</a>

    <nav class="main-nav" id="main-nav" aria-label="Navigation principale">
      <ul class="main-nav__list"></ul>
      <div class="main-nav__auth">
        <a href="${API_BASE}/admin" class="main-nav__link main-nav__link--admin" target="_blank" rel="noopener noreferrer">Administration</a>
      </div>
    </nav>

    <button class="menu-btn" id="menu-btn" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="main-nav">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </button>
  </div>
</header>
`;

// met en surbrillance le lien de la page en cours
function setActiveLink() {
  const path = location.pathname;
  document.querySelectorAll('.main-nav__link').forEach((link) => {
    const href = link.getAttribute('href');
    const isHome = href === '/' && (path === '/' || path === '/index.html');
    const isExact = href !== '/' && href === path;
    const isActive = isHome || isExact;

    link.classList.toggle('main-nav__link--active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

export function initNavbar() {
  const placeholder = document.getElementById('navbar-placeholder');
  if (!placeholder) return;

  placeholder.outerHTML = NAVBAR_HTML;
  setActiveLink();

  // sticky
  window.addEventListener(
    'scroll',
    () => {
      document.getElementById('site-header')?.classList.toggle('sticky', window.scrollY > 0);
    },
    { passive: true }
  );

  // burger
  document.getElementById('menu-btn')?.addEventListener('click', function () {
    const nav = document.getElementById('main-nav');
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    nav?.classList.toggle('visible');
  });

  // fermer si on clique un lien
  document.getElementById('main-nav')?.addEventListener('click', (e) => {
    if (e.target.closest('a[href]')) {
      document.getElementById('main-nav')?.classList.remove('visible');
      document.getElementById('menu-btn')?.setAttribute('aria-expanded', 'false');
    }
  });

  // clic en dehors = fermeture
  document.addEventListener('click', (e) => {
    const nav = document.getElementById('main-nav');
    const btn = document.getElementById('menu-btn');
    if (
      nav?.classList.contains('visible') &&
      !nav.contains(e.target) &&
      !btn?.contains(e.target)
    ) {
      nav.classList.remove('visible');
      btn?.setAttribute('aria-expanded', 'false');
    }
  });
}
