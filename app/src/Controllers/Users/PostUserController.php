<?php



namespace App\Controllers\Users;

use App\Entities\User;
use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Controllers\AbstractController;
use App\Repositories\UserRepository;

class PostUserController extends AbstractController {
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
        
        $userRepository = new UserRepository();

        $user = new User();
        $user->email = $data['email'];
        $user->role = $data['role'] ?? 'author';
        $user->created_at = date('Y-m-d H:i:s');
        $user->updated_at = date('Y-m-d H:i:s');
        
        $user->hashPassword($data['password']);

        $user->id = $userRepository->save($user);

        return new Response(json_encode($user), 201, ['Content-Type' => 'application/json']);
    }
    
}

?>
