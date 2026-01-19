<?php

namespace App\Controllers\Admin;

use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Controllers\AbstractController;
use App\Lib\Auth\CsrfToken;

class UsersController extends AbstractController
{
    public function process(Request $request): Response
    {
        $this->request = $request;
        $this->requireCanManageUsers();

        $csrfToken = CsrfToken::generate();
        return $this->render('admin/users', ['csrf_token' => $csrfToken]);
    }
}

?>
