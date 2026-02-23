<?php

namespace App\Controllers\Api\v1\Articles;

use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Controllers\AbstractController;
use App\Repositories\ArticleRepository;

class GetArticlesController extends AbstractController {
    public function process(Request $request): Response
    {
        try {
            $params       = $request->getUrlParams();
            $page         = (int) ($params['page']     ?? 1);
            $perPage      = (int) ($params['per_page'] ?? 10);
            $categorySlug = trim($params['category']   ?? '');
            $search       = trim($params['search']     ?? '');

            $page    = max(1, $page);
            $perPage = max(1, min(50, $perPage));

            $repo = new ArticleRepository();

            if (!empty($search)) {
                // ── Recherche plein-texte ──────────────────────────────────────────
                $totalCount = $repo->countPublishedBySearch($search);
                $totalPages = $perPage > 0 ? (int) ceil($totalCount / $perPage) : 1;
                $page       = min($page, max(1, $totalPages));
                $articles   = $repo->findPublishedPaginatedBySearch($search, $page, $perPage);
            } elseif (!empty($categorySlug)) {
                // ── Filtrage par catégorie (slug) ─────────────────────────────────
                $totalCount = $repo->countPublishedByCategorySlug($categorySlug);
                $totalPages = $perPage > 0 ? (int) ceil($totalCount / $perPage) : 1;
                $page       = min($page, max(1, $totalPages));
                $articles   = $repo->findPublishedPaginatedByCategorySlug($categorySlug, $page, $perPage);
            } else {
                // ── Tous les articles publiés ─────────────────────────────────────
                $totalCount = $repo->countPublished();
                $totalPages = $perPage > 0 ? (int) ceil($totalCount / $perPage) : 1;
                $page       = min($page, max(1, $totalPages));
                $articles   = $repo->findPublishedPaginated($page, $perPage);
            }

            // Récupérer images et auteurs en batch (évite N+1)
            $articleIds       = array_map(fn($a) => $a->id, $articles);
            $mediaRepo        = new \App\Repositories\MediaRepository();
            $featuredMediaMap = $mediaRepo->findFeaturedByArticleIds($articleIds);

            $authorIds = array_values(array_unique(array_filter(array_map(
                fn($a) => $a->author_id ?? null, $articles
            ))));
            $userRepo = new \App\Repositories\UserRepository();
            $usersMap = $userRepo->findByIds($authorIds);

            $articlesData = array_map(function($article) use ($featuredMediaMap, $usersMap) {
                $data  = $article->toArray();
                $media = $featuredMediaMap[$article->id] ?? null;
                $data['cover_image'] = $media ? [
                    'url' => '/uploads/' . $media->file_path,
                    'alt' => $media->alt_text ?: $article->title,
                ] : null;
                $user = $usersMap[$article->author_id] ?? null;
                $data['author'] = $user ? [
                    'id'        => $user->id,
                    'firstname' => $user->firstname,
                    'lastname'  => $user->lastname,
                ] : null;
                return $data;
            }, $articles);

            return new Response(json_encode([
                'success'     => true,
                'articles'    => $articlesData,
                'total'       => $totalCount,
                'totalPages'  => $totalPages,
                'currentPage' => $page,
                'category'    => $categorySlug ?: null,
                'search'      => $search       ?: null,
            ]), 200, ['Content-Type' => 'application/json']);

        } catch (\Throwable $e) {
            return new Response(json_encode([
                'success' => false,
                'error'   => $e->getMessage(),
            ]), 500, ['Content-Type' => 'application/json']);
        }
    }
}

