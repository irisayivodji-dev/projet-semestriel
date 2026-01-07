<?php

namespace App\Controllers\Articles;

use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Controllers\AbstractController;
use App\Repositories\ArticleRepository;

class DeleteArticleController extends AbstractController {
    public function process(Request $request): Response
    {
        $articleRepository = new ArticleRepository();
        
        $article = $articleRepository->find($request->getSlug('id'));
        
        if(empty($article)) {
            return new Response(json_encode(['error' => 'not found']), 404, ['Content-Type' => 'application/json']);
        }
        
        $articleRepository->remove($article);
        
        return new Response('', 204, ['Content-Type' => 'application/json']);
    }
}

?>
