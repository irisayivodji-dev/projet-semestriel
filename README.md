# CMS Blog multi-auteurs

Projet semestriel – Bloc 2 RNCP39235

## Description
CMS éditorial multi-auteurs en PHP orienté objet. On utilise un framework développé spécialement pour ce projet.

## Technologies
- PHP 8.4 avec Apache
- PostgreSQL 16
- Docker & Docker Compose
- Composer pour l'autoload
- Git / GitHub

## Organisation
Méthodologie SCRUM avec des sprints de 2 semaines.

## Installation

### Prérequis
- Docker Desktop
- Git

### Démarrage

Cloner le repo :
```bash
git clone https://github.com/yascodev/projet-semestriel.git
cd projet-semestriel
```

Lancer Docker :
```bash
docker-compose up -d --build
```

Installer Composer :
```bash
docker exec -it php-CMS bash -c "cd /var/www/html && composer install"
```

Vérifier la BDD :
```bash
docker exec -it php-postgres-CMS psql -U user -d db -c "\dt"
```

Tester l'API : http://localhost:8079/users

## Configuration

### Conteneurs
- `php-CMS` : port 8079
- `php-postgres-CMS` : port 5433

### Base de données
```
Host: php-framework-postgres
Port: 5432
Database: db
User: user
Password: password
```

Compte admin auto-créé :
- Email : admin@cms.local
- Mot de passe : admin123

### Commandes Docker

Voir les logs :
```bash
docker logs php-CMS
docker logs php-postgres-CMS
```

Accéder aux conteneurs :
```bash
docker exec -it php-CMS bash
docker exec -it php-postgres-CMS psql -U user -d db
```

Arrêter :
```bash
docker-compose down
```

## API

### Endpoints

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | /users | Liste des users |
| GET | /users/:id | Détail user |
| POST | /users | Créer user |
| PATCH | /users/:id | Modifier user |
| DELETE | /users/:id | Supprimer user |

Exemples :
```bash
curl http://localhost:8079/users
curl http://localhost:8079/users/1
```

## Structure du code

```
app/
├── src/
│   ├── Controllers/      # Un controller par action
│   ├── Entities/         # Classes métier (User, Article...)
│   ├── Repositories/     # Accès BDD
│   ├── Lib/              # Framework (Http, Database, ORM...)
│   └── index.php
├── config/
│   ├── routes.json
│   └── database.json
└── composer.json

database/init/            # Scripts SQL (lancés au premier démarrage)
```


## Règles de contribution

### Branches
Format : `type/description-courte`

Types :
- `feature/` : nouvelle fonctionnalité
- `fix/` : correction de bug
- `chore/` : config/maintenance
- `docs/` : documentation

Exemples :
- `feature/add-blog-posts`
- `fix/database-connection`

### Commits
Format : `type: description courte`

Types :
- `feat` : nouvelle fonctionnalité
- `fix` : correction de bug
- `chore` : configuration / maintenance
- `docs` : documentation

### Validation
Toute issue doit être testée et validée par au moins un autre membre de l'équipe avant d'être marquée comme terminée.


# CMS Blog Multi-Auteurs

**Projet semestriel – Bloc 2 RNCP39235**

## Description
CMS éditorial multi-auteurs développé en **PHP orienté objet**, utilisant un framework personnalisé créé spécialement pour ce projet.  

Ce projet permet la gestion complète des articles, utilisateurs et rôles via une API REST.

---

## Technologies utilisées
- **PHP 8.4** avec Apache  
- **PostgreSQL 16**  
- **Docker & Docker Compose**  
- **Composer** pour l’autoload  
- **Git / GitHub** pour le versioning  

---

## Organisation du projet
- Méthodologie **SCRUM**  
- Sprints de 2 semaines  
- Gestion des tâches et suivi via **issues GitHub**  

---

## Installation

### Prérequis
- Docker Desktop  
- Git  

### Cloner le projet
```bash
git clone https://github.com/yascodev/projet-semestriel.git
cd projet-semestriel
