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

    //les catégories associées à un article

    public function getCategories(int $articleId): array
    {
        $sql = "SELECT c.* FROM category c INNER JOIN article_category ac ON c.id = ac.category_id WHERE ac.article_id = :article_id";
        $stmt = $this->db->getConnexion()->prepare($sql);
        $stmt->execute(['article_id' => $articleId]);
        return $stmt->fetchAll(\PDO::FETCH_CLASS, \App\Entities\Category::class);
    }

    //les tags associées à un article

    public function getTags(int $articleId): array
    {
        $sql = "SELECT t.* FROM tags t INNER JOIN article_tag at ON t.id = at.tag_id WHERE at.article_id = :article_id";
        $stmt = $this->db->getConnexion()->prepare($sql);
        $stmt->execute(['article_id' => $articleId]);
        return $stmt->fetchAll(\PDO::FETCH_CLASS, \App\Entities\Tag::class);
    }
}
?>
