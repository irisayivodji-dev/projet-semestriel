<?php

namespace App\Lib\Http;

use App\Lib\Controllers\AbstractController;

class Router {

    const string CONTROLLER_NAMESPACE_PREFIX = "App\\Controllers\\";
    const string ROUTE_CONFIG_PATH = __DIR__ . '/../../../config/routes.json';
    
    public static function route(Request $request): Response {
        try {
            $config = self::getConfig();

            foreach($config as $route) {
                if(self::checkMethod($request, $route) === false || self::checkUri($request, $route) === false) {
                    continue;
                }

                $controller = self::getControllerInstance($route['controller']);
                return $controller->process($request);
            }

            // Si on sort de la boucle sans avoir trouvé de route
            throw new \Exception('Page non trouvée', 404);

        } catch (\Exception $e) {
            // Gestion conviviale des erreurs (Critère : Pages claires et retour accueil)
            return self::renderErrorPage($e->getCode() ?: 500);
        }
    }

    /**
     * Méthode pour charger le HTML des pages d'erreurs
     */
    private static function renderErrorPage(int $code): Response {
        // Chemin vers tes vues d'erreurs
        $filePath = __DIR__ . "/../../../views/errors/{$code}.html";
        
        // Si le fichier spécifique (404.html, etc.) n'existe pas, on cherche la 500 ou un message par défaut
        if (!file_exists($filePath)) {
            $filePath = __DIR__ . "/../../../views/errors/500.html";
        }

        $content = file_exists($filePath) 
            ? file_get_contents($filePath) 
            : "<h1>Erreur {$code}</h1><p>Une erreur est survenue.</p><a href='/'>Retour à l'accueil</a>";

        return new Response($content, $code, ['Content-Type' => 'text/html']);
    }
    
    private static function getConfig(): array {
        $routesConfigContent = file_get_contents(self::ROUTE_CONFIG_PATH);
        $routesConfig = json_decode($routesConfigContent, true);
        return $routesConfig;
    }

    private static function checkMethod(Request $request, array $route): bool {
        return $request->getMethod() === $route['method'];
    }

    private static function checkUri(Request $request, array $route): bool {
        $requestUriParts = self::getUrlParts($request->getPath());
        $routePathParts = self::getUrlParts($route['path']);

        if(self::checkUrlPartsNumberMatches($requestUriParts, $routePathParts) === false) {
            return false;
        }

        foreach($routePathParts as $key => $part) {
            if(self::isUrlPartSlug($part) === false) {
                if($part !== $requestUriParts[$key]) {
                    return false;
                }
            }else{
                $request->addSlug(substr($part, 1), $requestUriParts[$key]);
            }
        }

        return true;
    }
    
    private static function getControllerInstance(string $controller): AbstractController {
        // On nettoie le nom du controller car il peut contenir des sous-dossiers (ex: Articles\GetArticleController)
        $controllerClass = self::CONTROLLER_NAMESPACE_PREFIX . $controller;

        if(class_exists($controllerClass) === false) {
            throw new \Exception('Controller introuvable', 404);
        }

        $controllerInstance = new $controllerClass();

        if(is_subclass_of($controllerInstance, AbstractController::class)=== false){
            throw new \Exception('Invalid Controller', 500);
        }
        
        return $controllerInstance;
    }

    private static function getUrlParts(string $url): array {
        return explode('/', trim($url, '/'));
    }

    private static function checkUrlPartsNumberMatches(array $requestUriParts, array $routePathParts): bool {
        return count($requestUriParts) === count($routePathParts);
    }

    private static function isUrlPartSlug(string $part): bool {
        return strpos($part, ':') === 0;
    }
}
