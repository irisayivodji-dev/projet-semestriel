<?php

namespace App\Controllers\Admin;

use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Controllers\AbstractController;
use App\Lib\Auth\CsrfToken;

class CategoriesController extends AbstractController
{
    public function process(Request $request): Response
    {
        $this->request = $request;
        $this->requireCanManageCategories();

        $csrfToken = CsrfToken::generate();
        return $this->render('admin/categories', ['csrf_token' => $csrfToken]);
    }
}

?>
