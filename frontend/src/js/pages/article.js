
import { initNavbar } from '../components/navbar.js';
import { initFooter } from '../components/footer.js';
import { API_BASE, getArticleBySlug, getCategories } from '../services/api.js';

function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function initials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

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
  dateEl.textContent = `publié le ${formatDate(pubDate)}`;
  dateEl.setAttribute('datetime', pubDate ?? '');

  // Contenu HTML
  const contentEl = document.getElementById('post-content');
  contentEl.innerHTML = content ?? '<p>Aucun contenu disponible.</p>';

  // image de couverture
  const coverImg = document.getElementById('post-cover');
  if (coverImg) {
    if (article.cover_image?.url) {
      coverImg.src = `${API_BASE}${article.cover_image.url}`;
      coverImg.alt = article.cover_image.alt || title;
    } else {
      coverImg.src = 'https://img.freepik.com/free-photo/boy-working-grey-laptop_23-2148190001.jpg';
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

  // partage
  const shareUrl = encodeURIComponent(location.href);
  const shareTitle = encodeURIComponent(title);
  document.getElementById('share-twitter').href =
    `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`;
  document.getElementById('share-linkedin').href =
    `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
  document.getElementById('share-copy')?.addEventListener('click', () => {
    navigator.clipboard.writeText(location.href).then(() => {
      const btn = document.getElementById('share-copy');
      const prev = btn.innerHTML;
      btn.textContent = '✓ Copié !';
      setTimeout(() => { btn.innerHTML = prev; }, 2000);
    });
  });
}


// catégories (sidebar)
async function loadSidebarCategories() {
  const container = document.getElementById('sidebar-cats');
  try {
    const data = await getCategories();
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

// recherche → redirige vers l'accueil
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


async function init() {
  const slug = new URLSearchParams(location.search).get('slug');

  const loadingEl = document.getElementById('post-loading');
  const errorEl   = document.getElementById('post-error');
  const errorMsg  = document.getElementById('post-error-msg');
  const mainEl    = document.getElementById('post-main');

  if (!slug) {
    location.replace('/');
    return;
  }

  initNavbar();
  initFooter();
  initSearchForm();

  // sidebar en parallèle
  loadSidebarCategories();

  let articleData;
  try {
    articleData = await getArticleBySlug(slug);
  } catch (err) {
    loadingEl.hidden = true;
    errorMsg.textContent = err.message ?? "Impossible de charger l'article.";
    errorEl.hidden = false;
    return;
  }

  loadingEl.hidden = true;

  if (!articleData?.success) {
    errorMsg.textContent = articleData?.error ?? "L'article demandé est introuvable.";
    errorEl.hidden = false;
    return;
  }

  renderArticle(articleData.article);
  mainEl.hidden = false;
  initReadingBar();
}

init();
