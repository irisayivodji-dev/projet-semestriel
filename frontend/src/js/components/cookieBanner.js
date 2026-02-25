export function initCookieBanner() {
  if (localStorage.getItem('cookie_consent')) return; 

  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Consentement cookies');
  banner.innerHTML = `
    <p class="cookie-banner__text">
      Ce site stocke vos préférences localement. Pas de tracking, pas de pub.
      <a href="/pages/legal.html">En savoir plus</a>
    </p>
    <div class="cookie-banner__actions">
      <button id="cookie-accept" class="cookie-banner__btn cookie-banner__btn--accept">Accepter</button>
      <button id="cookie-refuse" class="cookie-banner__btn cookie-banner__btn--refuse">Refuser</button>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById('cookie-accept').addEventListener('click', () => {
    localStorage.setItem('cookie_consent', 'accepted');
    banner.remove();
  });
  document.getElementById('cookie-refuse').addEventListener('click', () => {
    localStorage.setItem('cookie_consent', 'refused');
    banner.remove();
  });
}