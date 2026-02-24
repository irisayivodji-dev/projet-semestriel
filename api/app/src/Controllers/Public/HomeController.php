<?php

namespace App\Controllers\Public;

use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Controllers\AbstractController;
use App\Repositories\ArticleRepository;

class HomeController extends AbstractController
{
    public function process(Request $request): Response
    {
        $this->request = $request;

        $params = $request->getUrlParams();
        $page = (int) ($params['page'] ?? 1);
        $page = max(1, $page);
        $perPage = 10;

        $articleRepository = new ArticleRepository();
        $totalCount = $articleRepository->countPublished();
        $totalPages = $perPage > 0 ? (int) ceil($totalCount / $perPage) : 1;
        $page = min($page, max(1, $totalPages));

        $articles = $articleRepository->findPublishedPaginated($page, $perPage);

        return $this->render('public/home', [
            'articles' => $articles,
            'currentPage' => $page,
            'totalPages' => $totalPages,
            'perPage' => $perPage,
            'totalCount' => $totalCount,
        ]);
    }
}