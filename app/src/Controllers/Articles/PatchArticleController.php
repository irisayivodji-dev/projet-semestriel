<?php

namespace App\Controllers\Articles;

use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Controllers\AbstractController;
use App\Repositories\ArticleRepository;

class PatchArticleController extends AbstractController {
    public function process(Request $request): Response
    {
        $payload = $request->getPayload();
        $contentType = $request->getHeaders()['Content-Type'] ?? null;
        $data = json_decode($payload, true);
        
        $articleRepository = new ArticleRepository();
        $article = $articleRepository->find($request->getSlug('id'));
        if(empty($article)) {
            return new Response(json_encode(['error' => 'not found']), 404, ['Content-Type' => 'application/json']);
        }

        if(isset($data['title'])) {
            $article->title = $data['title'];
            $article->generateSlug();
        }

        if(isset($data['content'])) {
            $article->content = $data['content'];
        }

        if(isset($data['excerpt'])) {
            $article->excerpt = $data['excerpt'];
        }

        $article->updated_at = date('Y-m-d H:i:s');
        $articleRepository->update($article);
        return new Response(json_encode($article), 200, ['Content-Type' => 'application/json']);
    }
}

?>
