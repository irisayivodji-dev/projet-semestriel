<?php
   namespace App\Entities;

    use App\Lib\Annotations\ORM\ORM;
    use App\Lib\Annotations\ORM\Column;
    use App\Lib\Annotations\ORM\Id;
    use App\Lib\Annotations\ORM\AutoIncrement;
    use App\Lib\Entities\AbstractEntity;

    #[ORM]
    class Category extends AbstractEntity {
        #[Id]
        #[AutoIncrement]
        #[Column(type: 'int')]
        public int $id;

        #[Column(type: 'varchar', size: 255)]
        public string $name;

        #[Column(type: 'varchar', size: 255)]
        public string $slug;

        #[Column(type: 'text')]
        public ?string $description = null;

        #[Column(type: 'varchar', size: 255)]
        public string $created_at;

        #[Column(type: 'varchar', size: 255)]
        public string $updated_at;

        public function getId(): int
        {
            return $this->id;
        }
        public function generateSlug(): void
        {
            $slug = strtolower($this->name);
            $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
            $slug = trim($slug, '-');
            $this->slug = $slug;
        }
    }
?>