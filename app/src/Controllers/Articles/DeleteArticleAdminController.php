<?php

namespace App\Controllers\Articles;

use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Controllers\AbstractController;
use App\Lib\Auth\Session;
use App\Repositories\ArticleRepository;
use App\Repositories\UserRepository;

class DeleteArticleAdminController extends AbstractController {
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

        // Seul admin et editor peuvent supprimer
        // Authors ne peuvent supprimer que leurs articles
        if ($currentUser->role === 'author') {
            if ($article->author_id !== $currentUser->id) {
                return new Response(json_encode(['error' => 'Forbidden']), 403, ['Content-Type' => 'application/json']);
            }
        } elseif ($currentUser->role !== 'editor' && $currentUser->role !== 'admin') {
            return new Response(json_encode(['error' => 'Forbidden']), 403, ['Content-Type' => 'application/json']);
        }

        // Supprimer les associations
        $connection = $articleRepository->getConnexion();
        
        $connection->prepare("DELETE FROM article_category WHERE article_id = :id")->execute(['id' => $articleId]);
        $connection->prepare("DELETE FROM article_tag WHERE article_id = :id")->execute(['id' => $articleId]);
        $connection->prepare("DELETE FROM article_versions WHERE article_id = :id")->execute(['id' => $articleId]);

        // Supprimer l'article
        $articleRepository->delete($article);

        return new Response(json_encode(['success' => true, 'message' => 'Article deleted']), 200, ['Content-Type' => 'application/json']);
    }
}
