<?php

namespace App\Controllers\Articles;

use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Controllers\AbstractController;
use App\Repositories\ArticleRepository;

class GetArticlesController extends AbstractController {
    public function process(Request $request): Response
    {
        $articleRepository = new ArticleRepository();
        // Par défaut, on ne retourne que les articles publiés
        $articles = $articleRepository->findByStatus('published');
        return new Response(json_encode($articles), 200, ['Content-Type' => 'application/json']);
    }
}

?>
