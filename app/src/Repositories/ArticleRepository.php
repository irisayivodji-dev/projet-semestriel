<?php

namespace App\Repositories;

use App\Lib\Repositories\AbstractRepository;
use App\Entities\Article;

class ArticleRepository extends AbstractRepository {
    
    public function getTable(): string {
        return 'articles';
    }
    
    public function getOneResult() {
        $this->query->setFetchMode(\PDO::FETCH_CLASS, Article::class);
        return $this->query->fetch();
    }

    public function getAllResults(): array {
        $this->query->setFetchMode(\PDO::FETCH_CLASS, Article::class);
        return $this->query->fetchAll();
    }
    
    public function findBySlug(string $slug): ?Article
    {
        return $this->findOneBy(['slug' => $slug]);
    }
    
    public function findByAuthor(int $authorId): array
    {
        return $this->findBy(['author_id' => $authorId]);
    }
    
    public function findByStatus(string $status): array
    {
        return $this->findBy(['status' => $status]);
    }
}
?>
