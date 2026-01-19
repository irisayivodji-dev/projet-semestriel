<?php

namespace App\Lib\Controllers;

use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Http\Middleware\RoleMiddleware;
use App\Lib\Auth\PermissionService;


abstract class AbstractController {
    protected ?Request $request = null;
    
    public abstract function process(Request $request): Response;

    protected function render(string $template, array $data = []): Response
    {
        $response = new Response();
        extract($data);
        ob_start();
        require_once __DIR__ . "/../../../views/{$template}.html";
        $response->setContent(ob_get_clean());
        $response->addHeader('Content-Type', 'text/html');

        return $response;
    }
    
    //Vérifie que l'utilisateur a un des rôles autorisés et Redirige vers /login ou /403 si non autorisé

    protected function requireRoles(array $allowedRoles): void
    {
        if ($this->request === null) {
            throw new \RuntimeException('Request must be set before calling requireRoles');
        }
        
        $response = RoleMiddleware::requireRoles($this->request, $allowedRoles);
        if ($response !== null) {
            foreach ($response->getHeaders() as $name => $value) {
                header("$name: $value");
            }
            http_response_code($response->getStatus());
            exit;
        }
    }
   
    protected function requireCanManageUsers(): void
    {
        $this->requireRoles(['admin']);
    }
    
    
    protected function requireCanManageCategories(): void
    {
        $this->requireRoles(['admin', 'editor']);
    }
    
    
    protected function requireCanManageTags(): void
    {
        $this->requireRoles(['admin', 'editor']);
    }
    
    
    protected function requireCanManageAllArticles(): void
    {
        $this->requireRoles(['admin', 'editor']);
    }
    
    
    protected function requireCanPublishArticles(): void
    {
        $this->requireRoles(['admin', 'editor']);
    }
    
    protected function canManageUsers(): bool
    {
        return PermissionService::canManageUsers();
    }
    
    protected function canManageCategories(): bool
    {
        return PermissionService::canManageCategories();
    }
    
    protected function canManageTags(): bool
    {
        return PermissionService::canManageTags();
    }
    
    protected function canManageAllArticles(): bool
    {
        return PermissionService::canManageAllArticles();
    }
    
    protected function canPublishArticles(): bool
    {
        return PermissionService::canPublishArticles();
    }
    
    protected function isAdmin(): bool
    {
        return PermissionService::isAdmin();
    }
}
