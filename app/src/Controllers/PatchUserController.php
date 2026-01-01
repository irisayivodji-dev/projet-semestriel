<?php

namespace App\Controllers;

use App\Lib\Http\Request;
use App\Lib\Http\Response;
use App\Lib\Controllers\AbstractController;
use App\Repositories\UserRepository;

class PatchUserController extends AbstractController {
    public function process(Request $request): Response
    {
        $userRepository = new UserRepository();

        $user = $userRepository->find($request->getSlug('id'));

        if(empty($user)) {
            return new Response(json_encode(['error' => 'not found']), 404, ['Content-Type' => 'application/json']);
        }
        
        $user->email = 'updated@cms.local';
        $user->updated_at = date('Y-m-d H:i:s');

        $userRepository->update($user);

        return new Response(json_encode($user), 200, ['Content-Type' => 'application/json']);
    }
    
}

?>
