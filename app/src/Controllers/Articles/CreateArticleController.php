<?php

namespace App\Controllers\Articles;

use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Controllers\AbstractController;
use App\Repositories\ArticleRepository;
use App\Entities\Article;

class CreateArticleController extends AbstractController {
    public function process(Request $request): Response
    {
        $data = json_decode($request->getPayload(), true);
        
        $articleRepository = new ArticleRepository();
        
        $article = new Article();
        $article->title = $data['title'] ?? 'Sans titre';
        $article->content = $data['content'] ?? '';
        $article->excerpt = $data['excerpt'] ?? '';
        $article->author_id = $data['author_id'] ?? 1;
        $article->status = 'draft';
        $article->created_at = date('Y-m-d H:i:s');
        $article->updated_at = date('Y-m-d H:i:s');
        
        $article->generateSlug();
        
        $article->id = $articleRepository->save($article);
        
        return new Response(json_encode($article), 201, ['Content-Type' => 'application/json']);
    }
}

?>
