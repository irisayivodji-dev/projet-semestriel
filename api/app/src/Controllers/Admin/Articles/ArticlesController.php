<?php

namespace App\Controllers\Admin\Articles;

use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Controllers\AbstractController;
use App\Lib\Auth\CsrfToken;

class ArticlesController extends AbstractController
{
    public function process(Request $request): Response
    {
        $this->request = $request;
        $this->requireCanManageAllArticles();

        $csrfToken = CsrfToken::generate();
        return $this->render('admin/articles', ['csrf_token' => $csrfToken]);
    }
}

?>
