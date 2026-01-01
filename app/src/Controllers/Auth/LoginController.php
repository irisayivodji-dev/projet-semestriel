<?php

namespace App\Controllers\Auth;

use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Controllers\AbstractController;
use App\Lib\Auth\AuthService;

class LoginController extends AbstractController {
    public function process(Request $request): Response
    {
        $data = json_decode($request->getPayload(), true);
        
        if (!isset($data['email']) || !isset($data['password'])) {
            return new Response(
                json_encode(['error' => 'Email and password required']),
                400,
                ['Content-Type' => 'application/json']
            );
        }

        $authService = new AuthService();
        $user = $authService->login($data['email'], $data['password']);

        if (!$user) {
            return new Response(
                json_encode(['error' => 'Invalid credentials']),
                401,
                ['Content-Type' => 'application/json']
            );
        }

        return new Response(
            json_encode([
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'role' => $user->role
                ]
            ]),
            200,
            ['Content-Type' => 'application/json']
        );
    }
}
