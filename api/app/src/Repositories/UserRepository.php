<?php

namespace App\Repositories;

use App\Lib\Repositories\AbstractRepository;
use App\Entities\User;

class UserRepository extends AbstractRepository {
    
    public function getTable(): string {
        return 'users'; // Override pour correspondre au nom de la table
    }
    
    public function getOneResult() {
        $this->query->setFetchMode(\PDO::FETCH_CLASS, User::class);
        return $this->query->fetch();
    }

    public function getAllResults(): array {
        $this->query->setFetchMode(\PDO::FETCH_CLASS, User::class);
        return $this->query->fetchAll();
    }
    
    public function findByEmail(string $email): ?User 
    {
        return $this->findOneBy(['email' => $email]);
    }

    // Récupère plusieurs utilisateurs par leurs ids en une seule requête
    public function findByIds(array $ids): array
    {
        if (empty($ids)) return [];
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $sql = "SELECT * FROM {$this->getTable()} WHERE id IN ({$placeholders})";
        $stmt = $this->db->getConnexion()->prepare($sql);
        $stmt->execute(array_values($ids));
        $stmt->setFetchMode(\PDO::FETCH_CLASS, User::class);
        $map = [];
        foreach ($stmt->fetchAll() as $user) {
            $map[$user->id] = $user;
        }
        return $map;
    }
}
?>