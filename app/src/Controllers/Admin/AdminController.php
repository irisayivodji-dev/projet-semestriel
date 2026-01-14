<?php

namespace App\Controllers\Admin;

use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Controllers\AbstractController;
use App\Lib\Auth\Session;
use App\Lib\Auth\CsrfToken;

class AdminController extends AbstractController
{
    public function process(Request $request): Response
    {
        $this->request = $request;
        
        // tous les utilisateurs authentifiés peuvent accéder au dashboard
        if (!Session::isAuthenticated()) {
            return Response::redirect('/login');
        }

        $csrfToken = CsrfToken::generate();
        return $this->render('admin/dashboard', ['csrf_token' => $csrfToken]);
    }
}
