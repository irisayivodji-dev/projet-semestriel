<?php

namespace App\Controllers\Auth;

use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Controllers\AbstractController;
use App\Lib\Auth\AuthService;

class LogoutController extends AbstractController {
    public function process(Request $request): Response
    {
        $authService = new AuthService();
        $authService->logout();

        return new Response(
            json_encode(['message' => 'Logout successful']),
            200,
            ['Content-Type' => 'application/json']
        );
    }
}
