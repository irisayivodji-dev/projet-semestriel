<?php



namespace App\Controllers;

use App\Entities\User;
use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Controllers\AbstractController;
use App\Repositories\UserRepository;

class PostUserController extends AbstractController {
    public function process(Request $request): Response
    {
        $userRepository = new UserRepository();

        $user = new User();
        $user->email = 'newuser@cms.local';
        $user->role = 'author';
        $user->created_at = date('Y-m-d H:i:s');
        $user->updated_at = date('Y-m-d H:i:s');
        
        // Hash du mot de passe
        $user->hashPassword('password123');

        $user->id = $userRepository->save($user);

        return new Response(json_encode($user), 201, ['Content-Type' => 'application/json']);
    }
    
}

?>
