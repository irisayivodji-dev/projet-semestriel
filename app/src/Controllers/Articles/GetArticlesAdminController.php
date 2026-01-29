<?php

namespace App\Controllers\Articles;

use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Controllers\AbstractController;
use App\Lib\Auth\Session;
use App\Repositories\ArticleRepository;
use App\Repositories\UserRepository;

class GetArticlesAdminController extends AbstractController {
    public function process(Request $request): Response
    {
        if (!Session::isAuthenticated()) {
            return new Response(json_encode(['error' => 'Unauthorized']), 401, ['Content-Type' => 'application/json']);
        }

        $userRepository = new UserRepository();
        $currentUser = $userRepository->find(Session::get('user_id'));

        if (!$currentUser) {
            return new Response(json_encode(['error' => 'User not found']), 404, ['Content-Type' => 'application/json']);
        }

        $articleRepository = new ArticleRepository();
        $articles = [];

        // Admin voir tous les articles
        if ($currentUser->role === 'admin') {
            $articles = $articleRepository->findAll();
        } else if ($currentUser->role === 'editor' || $currentUser->role === 'author') {
            // Autres rôles voient seulement leurs articles
            $articles = $articleRepository->findByAuthor($currentUser->id);
        }

        return new Response(json_encode($articles), 200, ['Content-Type' => 'application/json']);
    }
}
