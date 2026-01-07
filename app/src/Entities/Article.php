<?php

namespace App\Entities;

use App\Lib\Database\Annotations\ORM;
use App\Lib\Database\Annotations\Column;
use App\Lib\Database\Annotations\Id;
use App\Lib\Database\Annotations\AutoIncrement;
use App\Lib\Database\AbstractEntity;

#[ORM]
class Article extends AbstractEntity {
    #[Id]
    #[AutoIncrement]
    #[Column(type: 'int')]
    public int $id;
    
    #[Column(type: 'varchar', size: 255)]
    public string $title;
    
    #[Column(type: 'varchar', size: 255)]
    public string $slug;
    
    #[Column(type: 'text')]
    public ?string $content = null;
    
    #[Column(type: 'text')]
    public ?string $excerpt = null;
    
    #[Column(type: 'varchar', size: 50)]
    public string $status = 'draft';
    
    #[Column(type: 'int')]
    public int $author_id;
    
    #[Column(type: 'varchar', size: 255)]
    public string $created_at;
    
    #[Column(type: 'varchar', size: 255)]
    public string $updated_at;
    
    #[Column(type: 'varchar', size: 255)]
    public ?string $published_at = null;
    
    public function generateSlug(): void
    {
        $slug = strtolower($this->title);
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
        $slug = trim($slug, '-');
        $this->slug = $slug;
    }
}
