import { initNavbar } from '../components/navbar.js';
import { initFooter } from '../components/footer.js';
import { API_BASE, getTagBySlug, getArticlesByTagId, getCategories } from '../services/api.js';

const loadingEl    = document.getElementById('cat-loading');
const errorEl      = document.getElementById('cat-error');
const errorMsgEl   = document.getElementById('cat-error-msg');
const mainEl       = document.getElementById('cat-main');
const listEl       = document.getElementById('articles-list');
const listLoadEl   = document.getElementById('articles-loading');
const emptyEl      = document.getElementById('articles-empty');
const paginationEl = document.getElementById('articles-pagination');

let currentSlug = '';

function escapeHtml(text) {
  if (!text) return '';
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

function estimateReadTime(article) {
  const words = (article.content || '').replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min de lecture`;
}

function getExcerpt(article) {
  const text = article.excerpt || (article.content || '').replace(/<[^>]+>/g, '');
  return text.length > 160 ? text.slice(0, 160) + '…' : text;
}


function buildArticleItem(article) {
  const excerpt  = getExcerpt(article);
  const rawDate  = article.published_at || article.updated_at || article.created_at;
  const slug     = article.slug || article.id;
  const link     = `/article.html?slug=${encodeURIComponent(slug)}`;
  const readTime = estimateReadTime(article);

  const imgSrc = article.cover_image?.url
    ? `${API_BASE}${article.cover_image.url}`
    : 'https://img.freepik.com/free-photo/boy-working-grey-laptop_23-2148190001.jpg';

  const authorName = article.author
    ? `${article.author.firstname || ''} ${article.author.lastname || ''}`.trim()
    : '';

  const metaHTML = rawDate
    ? `<div class="card__meta">Publié le <time datetime="${rawDate}">${formatDate(rawDate)}</time></div>`
    : '';

  const li = document.createElement('li');
  li.className = 'blog__grid-col';
  li.innerHTML = `
    <article class="card">
      <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(article.title)}" class="card__image" loading="lazy" />
      ${metaHTML}
      <h2 class="card__title"><a href="${link}">${escapeHtml(article.title)}</a></h2>
      <p class="card__description">${escapeHtml(excerpt)}</p>
      <div class="card__footer">
        ${authorName ? `<span class="card__author-name">${escapeHtml(authorName)}</span>` : '<span></span>'}
        <a href="${link}" class="button button--indigo button--sm">Voir plus <svg fill="#ffffff" width="12px" height="12px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.71,11.29l-3-3a1,1,0,0,0-1.42,1.42L18.59,11H3a1,1,0,0,0,0,2H18.59l-1.3,1.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l3-3A1,1,0,0,0,21.71,11.29Z" style="fill:#fff"/></svg></a>
      </div>
    </article>
  `;
  return li;
}

// pagination

function buildPagination(currentPage, totalPages) {
  if (totalPages <= 1) return '';

  const base  = window.location.pathname;
  const extra = `&slug=${encodeURIComponent(currentSlug)}`;
  const items = [];

  items.push(currentPage > 1
    ? `<li class="pagination__item"><a class="pagination__link" href="${base}?page=${currentPage - 1}${extra}">← Précédent</a></li>`
    : `<li class="pagination__item"><span class="pagination__link pagination__link--disabled">← Précédent</span></li>`
  );

  for (let p = 1; p <= totalPages; p++) {
    const far = p > 2 && p < totalPages - 1 && Math.abs(p - currentPage) > 2;
    if (far) {
      if (p === 3 || p === totalPages - 2)
        items.push(`<li class="pagination__item"><span class="pagination__link pagination__link--disabled">…</span></li>`);
      continue;
    }
    items.push(p === currentPage
      ? `<li class="pagination__item"><span class="pagination__link pagination__link--active" aria-current="page">${p}</span></li>`
      : `<li class="pagination__item"><a class="pagination__link" href="${base}?page=${p}${extra}">${p}</a></li>`
    );
  }

  items.push(currentPage < totalPages
    ? `<li class="pagination__item"><a class="pagination__link" href="${base}?page=${currentPage + 1}${extra}">Suivant →</a></li>`
    : `<li class="pagination__item"><span class="pagination__link pagination__link--disabled">Suivant →</span></li>`
  );

  return `<ul class="pagination__list">${items.join('')}</ul>`;
}


let currentTagId = null;

async function loadPage(page = 1) {
  listLoadEl.hidden = false;
  emptyEl.hidden    = true;
  listEl.hidden     = true;
  paginationEl.hidden = true;
  listEl.innerHTML  = '';

  const data = await getArticlesByTagId(currentTagId, page, 10);

  listLoadEl.hidden = true;

  if (!data.success) {
    emptyEl.textContent = 'Une erreur est survenue lors du chargement.';
    emptyEl.hidden = false;
    return;
  }

  if (!data.articles || data.articles.length === 0) {
    emptyEl.textContent = 'Aucun article pour ce tag pour le moment.';
    emptyEl.hidden = false;
    return;
  }

  data.articles.forEach(a => listEl.appendChild(buildArticleItem(a)));
  listEl.hidden = false;

  if (data.totalPages > 1) {
    paginationEl.innerHTML = buildPagination(data.currentPage, data.totalPages);
    paginationEl.hidden = false;
  }
}

// sidebar catégories

async function loadSidebarCategories() {
  const container = document.getElementById('sidebar-cats');
  if (!container) return;
  try {
    const data = await getCategories();
    const cats = data.categories ?? [];
    if (!cats.length) return;
    container.innerHTML = cats
      .map(c => `<a href="/category.html?slug=${encodeURIComponent(c.slug)}" class="sidebar-categories__item${c.slug === currentSlug ? ' sidebar-categories__item--active' : ''}">${escapeHtml(c.name)}</a>`)
      .join('');
  } catch {
    container.innerHTML = '<p class="sidebar-categories__empty">Erreur de chargement.</p>';
  }
}

function initSearchForm() {
  document.getElementById('search-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const q = document.getElementById('search-input')?.value.trim();
    if (q) location.href = `/search.html?q=${encodeURIComponent(q)}`;
  });
}


async function init() {
  const params = new URLSearchParams(location.search);
  currentSlug  = params.get('slug') ?? '';
  const page   = Math.max(1, parseInt(params.get('page') || '1', 10));

  if (!currentSlug) {
    location.replace('/');
    return;
  }

  initNavbar();
  initFooter();
  initSearchForm();

  // sidebar en parallèle
  loadSidebarCategories();

  let tag;
  try {
    tag = await getTagBySlug(currentSlug);
  } catch (err) {
    loadingEl.hidden = true;
    errorMsgEl.textContent = 'Tag introuvable.';
    errorEl.hidden = false;
    return;
  }

  currentTagId = tag.id;

  document.title = `#${tag.name} — DevFlow`;
  document.querySelector('meta[name="description"]')
    ?.setAttribute('content', `Articles tagués ${tag.name} sur DevFlow`);

  document.getElementById('cat-name-bc').textContent  = tag.name;
  document.getElementById('cat-title').textContent    = `#${tag.name}`;

  const descEl = document.getElementById('cat-desc');
  if (tag.description) {
    descEl.textContent = tag.description;
  } else {
    descEl.hidden = true;
  }

  loadingEl.hidden = true;
  mainEl.hidden    = false;

  await loadPage(page);
}

init();
