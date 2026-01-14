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

- **Docker Desktop** (installé et démarré)
- **Git**
- **Node.js** (optionnel, pour la compilation SCSS en local)

### Démarrage complet

#### 1. Cloner le repository

```bash
git clone https://github.com/yascodev/projet-semestriel.git
cd projet-semestriel
```

#### 2. Lancer les conteneurs Docker

```bash
docker-compose up -d --build
```

Cette commande va :
- Construire l'image PHP avec Apache
- Démarrer le conteneur PostgreSQL
- Initialiser la base de données avec les scripts SQL dans `database/init/`

#### 3. Installer les dépendances PHP (Composer)

```bash
docker exec -it php-CMS bash -c "cd /var/www/html && composer install"
```

#### 4. Compiler les styles SCSS

```bash
# Option 1 : Compilation unique
docker exec -it php-CMS bash -c "cd /var/www/html && sass assets/main.scss dist/css/main.css"

# Option 2 : Watch mode (recompilation automatique)
docker exec -it php-CMS bash -c "cd /var/www/html && sass -w assets/main.scss dist/css/main.css"

# Option 3 : En local (si Node.js est installé)
npm run watch
```

#### 5. Vérifier que tout fonctionne

**Vérifier la base de données :**

```bash
docker exec -it php-postgres-CMS psql -U user -d db -c "\dt"
```

**Tester l'API :**

```bash
# Liste des utilisateurs
curl http://localhost:8079/users

# Détail d'un utilisateur
curl http://localhost:8079/users/1
```

**Accéder à l'application :**

- **Page de connexion :** http://localhost:8079/login
- **Back-office :** http://localhost:8079/admin (nécessite authentification)
- **API :** http://localhost:8079/users

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

### Compte administrateur par défaut

- **Email :** `admin@cms.local`
- **Mot de passe :** `admin123`

## Authentification

### Pages disponibles

- **Page de connexion :** http://localhost:8079/login
- **Back-office :** http://localhost:8079/admin (nécessite une authentification)

### Créer un nouvel utilisateur via l'API

**PowerShell :**

```powershell
Invoke-RestMethod -Uri "http://localhost:8079/users" -Method POST -ContentType "application/json" -Body '{"email": "nouveau@cms.local", "password": "motdepasse", "role": "admin"}'
```

**Bash/Linux :**

```bash
curl -X POST http://localhost:8079/users \
  -H "Content-Type: application/json" \
  -d '{"email": "nouveau@cms.local", "password": "motdepasse", "role": "admin"}'
```

**Rôles disponibles :** `admin`, `editor`, `author` (par défaut si non spécifié)

### Connexion via API (JSON)

**PowerShell :**

```powershell
Invoke-RestMethod -Uri "http://localhost:8079/login" -Method POST -ContentType "application/json" -Body '{"email": "admin@cms.local", "password": "admin123"}'
```

**Bash/Linux :**

```bash
curl -X POST http://localhost:8079/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@cms.local", "password": "admin123"}'
```

## Commandes Docker utiles

### Voir les logs des conteneurs

```bash
# Logs du conteneur PHP
docker logs php-CMS

# Logs du conteneur PostgreSQL
docker logs php-postgres-CMS

# Suivre les logs en temps réel
docker logs -f php-CMS
docker logs -f php-postgres-CMS
```

### Accéder aux conteneurs

```bash
# Accéder au shell du conteneur PHP
docker exec -it php-CMS bash

# Accéder à PostgreSQL en ligne de commande
docker exec -it php-postgres-CMS psql -U user -d db

# Exécuter une commande dans le conteneur PHP
docker exec -it php-CMS bash -c "cd /var/www/html && php -v"
```

### Gérer les conteneurs

```bash
# Arrêter les conteneurs
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v

# Redémarrer les conteneurs
docker-compose restart

# Reconstruire les conteneurs
docker-compose up -d --build
```

### Compilation SCSS

```bash
# Compilation unique
docker exec -it php-CMS bash -c "cd /var/www/html && sass assets/main.scss dist/css/main.css"

# Watch mode (recompilation automatique)
docker exec -it php-CMS bash -c "cd /var/www/html && sass -w assets/main.scss dist/css/main.css"
```

## API

### Endpoints d'authentification

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | /login | Page de connexion |
| POST | /login | Connexion (formulaire HTML ou JSON) |
| POST | /logout | Déconnexion |
| GET | /profile | Profil de l'utilisateur connecté |
| GET | /admin | Back-office (nécessite authentification) |

### Endpoints utilisateurs

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | /users | Liste des users |
| GET | /users/:id | Détail user |
| POST | /users | Créer user |
| PATCH | /users/:id | Modifier user |
| DELETE | /users/:id | Supprimer user |

### Exemples d'utilisation

**Liste des utilisateurs :**

```bash
curl http://localhost:8079/users
```

**Détail d'un utilisateur :**

```bash
curl http://localhost:8079/users/1
```

**Créer un utilisateur :**

```bash
curl -X POST http://localhost:8079/users \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123", "role": "author"}'
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
