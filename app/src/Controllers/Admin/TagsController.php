<?php

namespace App\Controllers\Admin;

use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Controllers\AbstractController;
use App\Lib\Auth\CsrfToken;

class TagsController extends AbstractController
{
    public function process(Request $request): Response
    {
        $this->request = $request;
        $this->requireCanManageTags();

        $csrfToken = CsrfToken::generate();
        return $this->render('admin/tags', ['csrf_token' => $csrfToken]);
    }
}

?>
