/**
 * article.js — Page de détail d'un article
 * Inspiré du layout Start Bootstrap blog-post, sans dépendance externe.
 */

const API_BASE = 'http://localhost:8079';

// --------------------------------------------------------------------------
// Utilitaires
// --------------------------------------------------------------------------

/**
 * Formate une date ISO en français (ex: "12 juin 2025").
 * @param {string} isoString
 * @returns {string}
 */
function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Génère les initiales d'un auteur pour l'avatar.
 * @param {string} name
 * @returns {string}
 */
function initials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// --------------------------------------------------------------------------
// Rendu de l'article
// --------------------------------------------------------------------------

/**
 * Injecte toutes les données de l'article dans le DOM.
 * @param {{ id: number, title: string, slug: string, content: string,
 *           excerpt: string, author_id: number, created_at: string,
 *           published_at: string, categories: Array, tags: Array }} article
 */
function renderArticle(article) {
  const {
    title,
    content,
    author,
    published_at,
    created_at,
    categories = [],
    tags = [],
  } = article;

  // <title>
  document.title = `${title} — DevFlow`;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', article.excerpt ?? title);

  // Fil d'Ariane
  if (categories.length > 0) {
    document.getElementById('bc-category').textContent = categories[0].name;
  }

  // Badges catégories
  const catsEl = document.getElementById('post-cats');
  catsEl.innerHTML = categories
    .map(
      (c) =>
        `<a href="/?category=${encodeURIComponent(c.slug)}" class="post__cat-badge">${c.name}</a>`
    )
    .join('');

  // Titre h1
  document.getElementById('post-title').textContent = title;

  // Méta : auteur + date
  const authorName = author
    ? `${author.firstname} ${author.lastname}`.trim()
    : 'Auteur inconnu';
  document.getElementById('post-avatar').textContent = initials(authorName);
  document.getElementById('post-author').textContent = authorName;

  const pubDate = published_at || created_at;
  const dateEl = document.getElementById('post-date');
  dateEl.textContent = formatDate(pubDate);
  dateEl.setAttribute('datetime', pubDate ?? '');

  // Contenu HTML
  const contentEl = document.getElementById('post-content');
  contentEl.innerHTML = content ?? '<p>Aucun contenu disponible.</p>';

  // Image de couverture : vraie image depuis l'API, sinon picsum en fallback
  const coverImg = document.getElementById('post-cover');
  if (coverImg) {
    if (article.cover_image?.url) {
      coverImg.src = `${API_BASE}${article.cover_image.url}`;
      coverImg.alt = article.cover_image.alt || title;
    } else {
      const seed = encodeURIComponent(article.slug ?? article.id ?? 'article');
      coverImg.src = `https://picsum.photos/seed/${seed}/900/400`;
      coverImg.alt = title;
    }
  }

  // Tags
  const tagsEl = document.getElementById('post-tags');
  if (tags.length > 0) {
    tagsEl.innerHTML = tags
      .map(
        (t) =>
          `<a href="/?search=${encodeURIComponent(t.name)}" class="post__tag">#${t.name}</a>`
      )
      .join('');
  } else {
    tagsEl.hidden = true;
  }

  // Boutons de partage
  const url = encodeURIComponent(location.href);
  const encodedTitle = encodeURIComponent(title);
  document.getElementById('share-twitter').href =
    `https://twitter.com/intent/tweet?url=${url}&text=${encodedTitle}`;
  document.getElementById('share-linkedin').href =
    `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  document.getElementById('share-copy').addEventListener('click', () => {
    navigator.clipboard.writeText(location.href).then(() => {
      const btn = document.getElementById('share-copy');
      const original = btn.textContent.trim();
      btn.textContent = '✓ Lien copié !';
      setTimeout(() => {
        btn.textContent = original;
      }, 2000);
    });
  });
}


// Chargement des catégories (sidebar)
async function loadSidebarCategories() {
  const container = document.getElementById('sidebar-cats');
  try {
    const res = await fetch(`${API_BASE}/api/v1/categories`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const categories = data.categories ?? data.data ?? [];

    if (categories.length === 0) {
      container.innerHTML = '<p class="sidebar-categories__empty">Aucune catégorie.</p>';
      return;
    }

    container.innerHTML = categories
      .map(
        (c) =>
          `<a href="/?category=${encodeURIComponent(c.slug)}" class="sidebar-categories__item">${c.name}</a>`
      )
      .join('');
  } catch {
    container.innerHTML = '<p class="sidebar-categories__empty">Erreur de chargement.</p>';
  }
}

// Barre de progression de lecture

function initReadingBar() {
  const bar = document.getElementById('reading-bar');
  if (!bar) return;

  function updateBar() {
    const article = document.getElementById('post-main');
    if (!article) return;

    const rect = article.getBoundingClientRect();
    const articleHeight = article.scrollHeight;
    const scrolled = Math.max(0, -rect.top);
    const total = articleHeight - window.innerHeight;
    const pct = total > 0 ? Math.min(100, Math.round((scrolled / total) * 100)) : 0;

    bar.style.width = `${pct}%`;
    bar.setAttribute('aria-valuenow', String(pct));
  }

  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();
}

// Menu mobile 

function initMenuToggle() {
  const btn = document.getElementById('menu-btn');
  const nav = document.getElementById('main-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('main-nav--open');
    btn.setAttribute('aria-expanded', String(open));
  });
}

// Header sticky 
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  let lastY = 0;
  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      header.classList.toggle('site-header--scrolled', y > 10);
      header.classList.toggle('site-header--hidden', y > lastY && y > 80);
      lastY = y;
    },
    { passive: true }
  );
}


// Formulaire newsletter

function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input?.value) {
      input.value = '';
      input.placeholder = '✓ Merci pour votre inscription !';
      setTimeout(() => {
        input.placeholder = 'votre@email.com';
      }, 3000);
    }
  });
}

// Formulaire de recherche sidebar → redirige vers l'accueil avec param ?q=
function initSearchForm() {
  const form = document.getElementById('search-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('search-input')?.value.trim();
    if (q) {
      location.href = `/?search=${encodeURIComponent(q)}`;
    }
  });
}


// Point d'entrée
async function init() {
  // Récupère le slug depuis l'URL (?slug=mon-article)
  const slug = new URLSearchParams(location.search).get('slug');

  const loadingEl = document.getElementById('post-loading');
  const errorEl   = document.getElementById('post-error');
  const errorMsg  = document.getElementById('post-error-msg');
  const mainEl    = document.getElementById('post-main');

  // Pas de slug → redirection immédiate
  if (!slug) {
    location.replace('/');
    return;
  }

  // Initialisations UI
  initMenuToggle();
  initStickyHeader();
  initNewsletter();
  initSearchForm();

  // Lancer la sidebar en arrière-plan (ne bloque PAS l'article)
  loadSidebarCategories();

  // Charger l'article
  let articleData;
  try {
    const res = await fetch(`${API_BASE}/api/v1/articles/slug/${encodeURIComponent(slug)}`);
    articleData = await res.json();
  } catch (err) {
    loadingEl.hidden = true;
    errorMsg.textContent = err.message ?? "Impossible de charger l'article.";
    errorEl.hidden = false;
    return;
  }

  // Masquer le spinner
  loadingEl.hidden = true;

  if (!articleData?.success) {
    errorMsg.textContent = articleData?.error ?? "L'article demandé est introuvable.";
    errorEl.hidden = false;
    return;
  }

  // Rendu de l'article
  renderArticle(articleData.article);
  mainEl.hidden = false;

  // Barre de progression (une fois l'article visible)
  initReadingBar();
}

init();
