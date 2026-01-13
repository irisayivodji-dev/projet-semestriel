<?php

namespace App\Controllers\Auth;

use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Controllers\AbstractController;

class LoginPageController extends AbstractController {
    public function process(Request $request): Response
    {
        // Affiche simplement la vue login.html
        return new Response(
            file_get_contents(__DIR__ . '/../../../views/login.html'),
            200,
            ['Content-Type' => 'text/html']
        );
    }
}
