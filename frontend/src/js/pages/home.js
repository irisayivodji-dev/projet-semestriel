import { initNavbar } from '../components/navbar.js';
import { initFooter } from '../components/footer.js';
import { API_BASE, getArticles, getCategories, getTags } from '../services/api.js';

const listEl       = document.getElementById('articles-list');
const loadingEl    = document.getElementById('articles-loading');
const emptyEl      = document.getElementById('articles-empty');
const paginationEl = document.getElementById('articles-pagination');
const catsInnerEl  = document.querySelector('.blog-cats__inner');
const tagsInnerEl  = document.querySelector('.sidebar-tags');
const sectionTitle = document.querySelector('.blog__section-title');

let currentCategory = '';  // slug de catégorie actif
let currentSearch   = '';  // terme de recherche actif

// layout
initNavbar();
initFooter();

function escapeHtml(text) {
  if (!text) return '';
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

function getExcerpt(article) {
  const text = article.excerpt || (article.content || '').replace(/<[^>]+>/g, '');
  return text.length > 160 ? text.slice(0, 160) + '…' : text;
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


function updateSectionTitle() {
  if (!sectionTitle) return;
  if (currentSearch) {
    sectionTitle.textContent = `Résultats pour « ${currentSearch} »`;
  } else if (currentCategory) {
    const activeBtn = document.querySelector(`.blog-cats__item[data-cat="${currentCategory}"]`);
    const label = activeBtn ? activeBtn.textContent.trim() : currentCategory;
    sectionTitle.textContent = `Articles — ${label}`;
  } else {
    sectionTitle.textContent = 'Derniers articles publiés';
  }
}

//carte article 

function buildArticleItem(article) {
  const excerpt    = getExcerpt(article);
  const rawDate    = article.published_at || article.updated_at || article.created_at;
  const slug       = article.slug || article.id;
  const link       = `/article.html?slug=${encodeURIComponent(slug)}`;
  const readTime   = estimateReadTime(article);

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
        <a href="${link}" class="button button--indigo button--sm">Voir plus <svg fill="#ffffff" width="12px" height="12px" viewBox="0 0 24 24" id="right-arrow" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg" class="icon flat-color" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path id="primary" d="M21.71,11.29l-3-3a1,1,0,0,0-1.42,1.42L18.59,11H3a1,1,0,0,0,0,2H18.59l-1.3,1.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l3-3A1,1,0,0,0,21.71,11.29Z" style="fill: #ffffff;"></path></g></svg></a>
      </div>
    </article>
  `;
  return li;
}

// pagination 

function buildPagination(currentPage, totalPages) {
  if (totalPages <= 1) return '';

  const base = window.location.pathname;
  const extra = currentCategory ? `&category=${encodeURIComponent(currentCategory)}`
              : currentSearch   ? `&search=${encodeURIComponent(currentSearch)}`
              : '';

  const items = [];

  items.push(currentPage > 1
    ? `<li class="pagination__item"><a class="pagination__link" href="${base}?page=${currentPage - 1}${extra}">← Précédent</a></li>`
    : `<li class="pagination__item"><span class="pagination__link pagination__link--disabled">← Précédent</span></li>`
  );

  for (let p = 1; p <= totalPages; p++) {
    const far = p > 2 && p < totalPages - 1 && Math.abs(p - currentPage) > 2;
    if (far) {
      if (p === 3 || p === totalPages - 2) {
        items.push(`<li class="pagination__item"><span class="pagination__link pagination__link--disabled">…</span></li>`);
      }
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

// chargement articles

async function loadPage(page = 1, category = '', search = '') {
  loadingEl.hidden    = false;
  emptyEl.hidden      = true;
  listEl.hidden       = true;
  paginationEl.hidden = true;
  listEl.innerHTML    = '';

  try {
    const data = await getArticles({ page, perPage: 10, category, search });

    loadingEl.hidden = true;

    if (!data.success) {
      if (data?.error) console.error('[API]', data.error);
      emptyEl.textContent = 'Une erreur est survenue lors du chargement.';
      emptyEl.hidden = false;
      return;
    }

    if (!data.articles || data.articles.length === 0) {
      emptyEl.textContent = search   ? `Aucun résultat pour « ${search} ».`
                          : category ? `Aucun article dans cette catégorie.`
                          : 'Aucun article disponible pour le moment.';
      emptyEl.hidden = false;
      return;
    }

    data.articles.forEach(article => listEl.appendChild(buildArticleItem(article)));
    listEl.hidden = false;

    if (data.totalPages > 1) {
      paginationEl.innerHTML = buildPagination(data.currentPage, data.totalPages);
      paginationEl.hidden    = false;
    }

    updateSectionTitle();
  } catch (err) {
    loadingEl.hidden    = true;
    emptyEl.textContent = 'Erreur lors du chargement des articles.';
    emptyEl.hidden      = false;
    console.error('[home.js] loadPage error:', err);
  }
}

// filtres catégories 

function setActiveCategory(slug) {
  currentCategory = slug;
  currentSearch   = '';
  const input = document.getElementById('search-input');
  if (input) input.value = '';

  document.querySelectorAll('.blog-cats__item').forEach(btn => {
    btn.classList.toggle('blog-cats__item--active', btn.dataset.cat === slug);
  });
}

function bindCategoryButtons() {
  document.querySelectorAll('.blog-cats__item').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      setActiveCategory(btn.dataset.cat ?? '');
      loadPage(1, currentCategory, '');
      document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

async function loadCategories() {
  if (!catsInnerEl) return;

  try {
    const data = await getCategories();

    if (!data.success || !data.categories?.length) return;

    // bouton "Tous" fixe 
    catsInnerEl.innerHTML = `
      <a href="#" class="blog-cats__item ${!currentCategory ? 'blog-cats__item--active' : ''}" data-cat="">Tous</a>
      ${data.categories.map(cat => `
        <a href="#" class="blog-cats__item ${currentCategory === cat.slug ? 'blog-cats__item--active' : ''}" data-cat="${escapeHtml(cat.slug)}">
          ${escapeHtml(cat.name)}
        </a>
      `).join('')}
    `;

    bindCategoryButtons();
  } catch (err) {
    console.warn('[home.js] loadCategories error:', err);
    bindCategoryButtons();
  }
}
async function loadTags() {
  if (!tagsInnerEl) return;

  try {
    const data = await getTags();

    if (!data.success || !data.tags?.length) return;

    tagsInnerEl.innerHTML = data.tags.map(tag => `
      <a href="/tag.html?slug=${encodeURIComponent(tag.slug)}" class="sidebar-tags__tag">
        ${escapeHtml(tag.name)}
      </a>
    `).join('');
  } catch (err) {
    console.warn('[home.js] loadTags error:', err);
  }
}

// recherche

document.getElementById('search-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const query = document.getElementById('search-input')?.value.trim();
  if (!query) return;

  currentSearch   = query;
  currentCategory = '';
  setActiveCategory('');

  loadPage(1, '', currentSearch);
  document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' });
});

// Réinitialiser la recherche si le champ est vidé
document.getElementById('search-input')?.addEventListener('input', function () {
  if (!this.value.trim() && currentSearch) {
    currentSearch = '';
    loadPage(1, currentCategory, '');
    updateSectionTitle();
  }
});

// tags sidebar 

document.querySelectorAll('.sidebar-tags__tag').forEach(tag => {
  tag.addEventListener('click', e => {
    e.preventDefault();
    setActiveCategory(tag.dataset.cat ?? '');
    loadPage(1, currentCategory, '');
    document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' });
  });
});

// init

const params   = new URLSearchParams(window.location.search);
const initPage = Math.max(1, parseInt(params.get('page') || '1', 10));
const initCat  = params.get('category') || '';
const initSearch = params.get('search') || '';

// Initialiser les états depuis l'URL
if (initCat)    { currentCategory = initCat;    }
if (initSearch) { currentSearch   = initSearch; }

loadCategories();
loadTags();
loadPage(initPage, initCat, initSearch);
