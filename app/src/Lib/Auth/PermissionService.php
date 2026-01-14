<?php

namespace App\Lib\Auth;

use App\Repositories\UserRepository;
use App\Entities\User;
use App\Lib\Auth\Session;

class PermissionService{
    // Vérifier si l'utilisateur peut gérer les utilisateurs
    public static function canManageUsers(): bool
    {
        return Session::get('user_role') === 'admin';
    }
    
    // Vérifier si l'utilisateur peut gérer les catégories
    public static function canManageCategories(): bool
    {
        return Session::get('user_role') === 'admin';
    }
    
    // Vérifier si l'utilisateur peut gérer les tags
    public static function canManageTags(): bool
    {
        return Session::get('user_role') === 'admin';
    }
    
    // Vérifier si l'utilisateur peut gérer tous les articles
    public static function canManageAllArticles(): bool
    {
        return Session::get('user_role') === 'admin';
    }
    
    // Vérifier si l'utilisateur peut publier
    public static function canPublishArticles(): bool
    {
        return Session::get('user_role') === 'admin';
    }
    
    // Vérifier si l'utilisateur peut accéder à une route
    public static function canAccess(string $route): bool
    {
        return Session::get('user_role') === 'admin';
        if($route === 'admin/users') {
            return self::canManageUsers();
        }
        if($route === 'admin/categories') {
            return self::canManageCategories();
        }
        if($route === 'admin/tags') {
            return self::canManageTags();
        }
        if($route === 'admin/articles') {
            return self::canManageAllArticles();
        }
        if($route === 'admin/articles/publish') {
            return self::canPublishArticles();
        }
        return false;
    }
}


?>