<?php

namespace App\Controllers\Articles;

use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Controllers\AbstractController;
use App\Repositories\ArticleRepository;
use App\Lib\Auth\AuthService; // Ajout pour la gestion des droits

class DeleteArticleController extends AbstractController {
    public function process(Request $request): Response
    {
        $authService = new AuthService();
        $currentUser = $authService->getCurrentUser();
        $articleRepository = new ArticleRepository();

        // 1. Vérification de l'authentification (Critère : Permissions respectées)
        if (!$currentUser) {
            return new Response(json_encode([
                'success' => false,
                'error' => 'Authentification requise'
            ]), 401, ['Content-Type' => 'application/json']);
        }
        
        $article = $articleRepository->find($request->getSlug('id'));
        
        // 2. Vérification de l'existence de l'article (Critère : Page claire si non trouvé)
        if(empty($article)) {
            // Si c'est une requête API, on répond en JSON, sinon on pourrait rediriger vers la 404 HTML
            return new Response(json_encode([
                'success' => false,
                'error' => 'Article non trouvé'
            ]), 404, ['Content-Type' => 'application/json']);
        }

        // 3. Gestion des droits d'accès (Objectif : Lier article et utilisateur)
        // L'utilisateur peut supprimer s'il est l'auteur OU s'il est administrateur
        if ($currentUser->role !== 'admin' && $article->author_id !== $currentUser->id) {
            return new Response(json_encode([
                'success' => false,
                'error' => 'Vous n\'avez pas les droits pour supprimer cet article'
            ]), 403, ['Content-Type' => 'application/json']);
        }
        
        // 4. Suppression effective
        $articleRepository->remove($article);
        
        return new Response(json_encode([
            'success' => true,
            'message' => 'Article supprimé',
            'article_id' => $article->id
        ]), 200, ['Content-Type' => 'application/json']);
    }
}

?>
