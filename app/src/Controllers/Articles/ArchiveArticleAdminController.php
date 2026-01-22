<?php

namespace App\Controllers\Articles;

use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Controllers\AbstractController;
use App\Lib\Auth\Session;
use App\Repositories\ArticleRepository;
use App\Repositories\UserRepository;

class ArchiveArticleAdminController extends AbstractController {
    public function process(Request $request): Response
    {
        if (!Session::isAuthenticated()) {
            return new Response(json_encode(['error' => 'Unauthorized']), 401, ['Content-Type' => 'application/json']);
        }

        $articleId = (int) $request->getSlug('id');
        $articleRepository = new ArticleRepository();
        $article = $articleRepository->find($articleId);

        if (!$article) {
            return new Response(json_encode(['error' => 'Article not found']), 404, ['Content-Type' => 'application/json']);
        }

        $userRepository = new UserRepository();
        $currentUser = $userRepository->find(Session::get('user_id'));

        if (!$currentUser) {
            return new Response(json_encode(['error' => 'User not found']), 404, ['Content-Type' => 'application/json']);
        }

        // Vérifier les permissions
        if ($currentUser->role === 'author' && $article->author_id !== $currentUser->id) {
            return new Response(json_encode(['error' => 'Forbidden']), 403, ['Content-Type' => 'application/json']);
        }

        // Archiver l'article
        $article->status = 'archived';
        $article->updated_at = date('Y-m-d H:i:s');

        $articleRepository->update($article);

        return new Response(json_encode(['success' => true, 'article' => $article]), 200, ['Content-Type' => 'application/json']);
    }
}
