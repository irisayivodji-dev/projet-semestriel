export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8079';

async function request(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// liste paginée des articles
export function getArticles({ page = 1, perPage = 10, category = '', search = '' } = {}) {
  return request('/api/v1/articles', {
    page,
    per_page: perPage,
    category,
    search,
  });
}

// article unique par slug
export function getArticleBySlug(slug) {
  return request(`/api/v1/articles/slug/${encodeURIComponent(slug)}`);
}

const cacheLiveTime = 15 * 60 * 1000; 

function cacheGet(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > cacheLiveTime) { sessionStorage.removeItem(key); return null; }
    return data;
  } catch { return null; }
}

function cacheSet(key, data) {
  try { sessionStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

// toutes les catégories
export async function getCategories() {
  const cached = cacheGet('api:categories');
  if (cached) return cached;
  const data = await request('/api/v1/categories');
  cacheSet('api:categories', data);
  return data;
}

// tous les tags
export async function getTags() {
  const cached = cacheGet('api:tags');
  if (cached) return cached;
  const data = await request('/api/v1/tags');
  cacheSet('api:tags', data);
  return data;
}

// catégorie par slug (recherche dans la liste complète)
export async function getCategoryBySlug(slug) {
  const data = await getCategories();
  const cat = (data.categories ?? []).find(c => c.slug === slug);
  if (!cat) throw new Error(`Catégorie "${slug}" introuvable`);
  return cat;
}

// tag par slug (recherche dans la liste complète)
export async function getTagBySlug(slug) {
  const data = await getTags();
  const tag = (data.tags ?? []).find(t => t.slug === slug);
  if (!tag) throw new Error(`Tag "${slug}" introuvable`);
  return tag;
}

// articles d'un tag par son ID
export function getArticlesByTagId(id, page = 1, perPage = 10) {
  return request(`/api/v1/tags/${id}/articles`, { page, per_page: perPage });
}
