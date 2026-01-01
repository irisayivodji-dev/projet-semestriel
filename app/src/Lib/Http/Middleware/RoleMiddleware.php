<?php

namespace App\Lib\Http\Middleware;

use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Auth\Session;

class RoleMiddleware
{
    public static function handle(Request $request, string $requiredRole): ?Response
    {
        if (!Session::isAuthenticated()) {
            return new Response(
                json_encode(['error' => 'Authentication required']),
                401,
                ['Content-Type' => 'application/json']
            );
        }
        
        $userRole = Session::get('user_role');
        
        if ($userRole !== $requiredRole) {
            return new Response(
                json_encode(['error' => 'Insufficient permissions']),
                403,
                ['Content-Type' => 'application/json']
            );
        }
        
        return null;
    }
    
    public static function isAdmin(Request $request): ?Response
    {
        return self::handle($request, 'admin');
    }
    
    public static function isEditor(Request $request): ?Response
    {
        return self::handle($request, 'editor');
    }
    
    public static function isAuthor(Request $request): ?Response
    {
        return self::handle($request, 'author');
    }
}
