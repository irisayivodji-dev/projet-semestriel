// couche d'accès à l'API backend — toutes les pages passent par ici
export const API_BASE = 'http://localhost:8079';

// envoie une requête GET et retourne le JSON 
async function request(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// liste paginée des articles avec filtres optionnels
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

// toutes les catégories
export function getCategories() {
  return request('/api/v1/categories');
}

// tous les tags
export function getTags() {
  return request('/api/v1/tags');
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
