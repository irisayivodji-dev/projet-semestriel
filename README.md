# CMS Headless - Documentation Complète

## 📋 Présentation du projet

**Projet Semestriel 3A WD - S1 - Bloc 2 (2025-2026)**

CMS headless modulaire développé from scratch en PHP avec un framework maison. Le projet vise à démontrer la maîtrise du processus complet de développement d'un projet digital : cadrage, planification, gestion des risques, communication et pilotage d'équipe.

### Objectifs pédagogiques

1. Planifier un projet digital en découpant les étapes de production
2. Identifier et anticiper les risques techniques, humains et organisationnels
3. Coordonner le travail d'équipe via des outils collaboratifs (Git, Trello, Notion)
4. Suivre la production en mode agile (sprints, réunions de suivi, livrables intermédiaires)
5. Présenter et défendre ses choix devant un jury professionnel

### Cas d'usage

**CMS Blog multi-auteurs** avec :
- Gestion éditoriale complète
- Système de rôles et permissions
- API headless pour frontend séparé
- Workflow de publication (brouillon → publié → archivé)

## 🛠️ Technologies

- **Backend :** PHP 8.4 avec Apache
- **Base de données :** PostgreSQL 16
- **Conteneurisation :** Docker & Docker Compose
- **Autoload :** Composer (PSR-4)
- **Styles :** Framework SASS maison
- **Versionning :** Git / GitHub

## 📦 Installation

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
cd api
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

**Accéder à l'application :**

- **Page de connexion :** http://localhost:8079/login
- **Back-office :** http://localhost:8079/admin (nécessite authentification)
- **API :** http://localhost:8079/api/v1/

## ⚙️ Configuration

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

## 🔐 Authentification

### Connexion

**Page web :** http://localhost:8079/login

**API JSON :**

```bash
curl -X POST http://localhost:8079/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@cms.local", "password": "admin123"}'
```

**PowerShell :**

```powershell
Invoke-RestMethod -Uri "http://localhost:8079/api/v1/auth/login" -Method POST -ContentType "application/json" -Body '{"email": "admin@cms.local", "password": "admin123"}'
```

### Déconnexion

```bash
# GET ou POST
curl -X POST http://localhost:8079/api/v1/auth/logout
```

### Profil utilisateur

```bash
curl http://localhost:8079/api/v1/auth/profile
```

## 👥 Système de rôles et permissions

### Rôles disponibles

1. **Admin** : Accès complet à toutes les fonctionnalités
2. **Editor** : Peut gérer le contenu (articles, catégories, tags) et publier
3. **Author** : Peut créer et gérer uniquement ses propres articles (en brouillon)

### Matrice des permissions

| Fonctionnalité | Admin | Editor | Author |
|----------------|-------|--------|--------|
| Gestion utilisateurs | ✅ | ❌ | ❌ |
| Gestion catégories | ✅ | ✅ | ❌ |
| Gestion tags | ✅ | ✅ | ❌ |
| Voir tous les articles | ✅ | ✅ | ❌ |
| Voir ses articles | ✅ | ✅ | ✅ |
| Créer un article | ✅ | ✅ | ✅ |
| Modifier tous les articles | ✅ | ✅ | ❌ |
| Modifier ses articles | ✅ | ✅ | ✅ |
| Supprimer tous les articles | ✅ | ✅ | ❌ |
| Supprimer ses articles | ✅ | ✅ | ✅ |
| Publier un article | ✅ | ✅ | ❌ |

## 🎨 Back-Office

### Accès

**URL :** http://localhost:8079/admin

### Navigation

La sidebar est responsive et s'adapte automatiquement selon le rôle :

- **Dashboard** : Accessible à tous
- **Utilisateurs** : Uniquement pour les admins
- **Catégories** : Admin et Editor
- **Tags** : Admin et Editor
- **Articles** : Tous les utilisateurs authentifiés
- **Médiathèque** : Tous les utilisateurs authentifiés (médiathèque personnelle)
- **Déconnexion** : Tous les utilisateurs

### Routes du back-office

| Route | Méthode | Description | Accès |
|-------|---------|-------------|-------|
| `/admin` | GET | Dashboard | Tous |
| `/admin/users` | GET | Liste des utilisateurs | Admin |
| `/admin/users/create` | GET, POST | Créer un utilisateur | Admin |
| `/admin/users/edit/:id` | GET, PATCH | Modifier un utilisateur | Admin |
| `/admin/users/delete/:id` | GET, POST | Supprimer un utilisateur | Admin |
| `/admin/categories` | GET | Liste des catégories | Admin, Editor |
| `/admin/categories/create` | GET, POST | Créer une catégorie | Admin, Editor |
| `/admin/categories/edit/:id` | GET, PATCH | Modifier une catégorie | Admin, Editor |
| `/admin/categories/delete/:id` | GET, POST | Supprimer une catégorie | Admin, Editor |
| `/admin/tags` | GET | Liste des tags | Admin, Editor |
| `/admin/tags/create` | GET, POST | Créer un tag | Admin, Editor |
| `/admin/tags/edit/:id` | GET, PATCH | Modifier un tag | Admin, Editor |
| `/admin/tags/delete/:id` | GET, POST | Supprimer un tag | Admin, Editor |
| `/admin/articles` | GET | Liste des articles | Tous* |
| `/admin/articles/create` | GET, POST | Créer un article | Tous |
| `/admin/articles/edit/:id` | GET, PATCH | Modifier un article | Tous* |
| `/admin/articles/delete/:id` | GET, POST | Supprimer un article | Tous* |
| `/admin/articles/publish/:id` | POST | Publier un article | Admin, Editor |
| `/admin/media` | GET | Médiathèque personnelle | Tous |
| `/admin/media/upload` | GET, POST | Uploader un média | Tous |
| `/admin/media/delete/:id` | GET, POST | Supprimer un média | Tous* |
| `/403` | GET | Page d'erreur 403 | Tous |

*Selon les permissions (voir section Articles et Médias)

### Fonctionnalités principales

#### Gestion des utilisateurs

- **Liste** : Tableau avec nom, email, rôle, nombre d'articles, date de création
- **Création** : Formulaire avec validation (email unique, mot de passe min 8 caractères)
- **Modification** : Formulaire pré-rempli, mot de passe optionnel
- **Suppression** : Protection contre l'auto-suppression, confirmation requise

#### Gestion des articles

- **Liste** : Filtrage automatique selon le rôle (tous les articles pour admin/editor, uniquement les siens pour author)
- **Création** : Formulaire avec titre, contenu, excerpt, statut, catégories, tags
- **Modification** : Même formulaire pré-rempli avec catégories/tags sélectionnés
- **Publication** : Bouton dédié pour publier un article (admin/editor uniquement)
- **Validation** : Contenu requis uniquement si l'article est publié

#### Gestion des catégories et tags

- CRUD complet avec validation
- Génération automatique de slug unique
- Protection CSRF sur tous les formulaires

#### Gestion des médias

**Structure implémentée :**
- Table `media` avec métadonnées complètes (filename, file_path, file_type, mime_type, file_size, alt_text, title, description)
- Table `article_media` pour relation N:N avec articles
- Support de l'image à la une (`is_featured`)
- Ordre d'affichage des médias (`display_order`)
- Entité `Media` avec méthodes utilitaires
- Repository `MediaRepository` avec méthodes de gestion complètes

**Fonctionnalités disponibles :**
- **Médiathèque personnelle** : Chaque utilisateur authentifié peut gérer sa propre médiathèque
- **Upload de fichiers** : Interface d'upload avec validation (types de fichiers, taille)
- **Gestion des métadonnées** : Titre, description, alt_text pour l'accessibilité
- **Affichage en grille** : Visualisation des médias avec aperçu (images) ou icônes (autres types)
- **Suppression sécurisée** : Chaque utilisateur ne peut supprimer que ses propres médias
- **Association aux articles** : Liaison N:N avec support de l'image à la une et ordre d'affichage
- **Recherche par type** : Filtrage par type de fichier (image, video, document, audio)
- **Sécurité** : Protection CSRF, validation des fichiers, stockage sécurisé dans `/uploads/`

## 🔌 API REST

### Base URL

```
http://localhost:8079/api/v1
```

### Authentification

L'API utilise des sessions PHP. Pour les requêtes authentifiées, vous devez d'abord vous connecter via `/api/v1/auth/login`.

### Endpoints d'authentification

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/api/v1/auth/login` | Connexion | ❌ |
| GET/POST | `/api/v1/auth/logout` | Déconnexion | ✅ |
| GET | `/api/v1/auth/profile` | Profil utilisateur | ✅ |

**Exemple de connexion :**

```bash
curl -X POST http://localhost:8079/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@cms.local", "password": "admin123", "csrf_token": "token"}'
```

### Endpoints utilisateurs

| Méthode | Route | Description | Auth | Permissions |
|---------|-------|-------------|------|-------------|
| GET | `/api/v1/users` | Liste des utilisateurs | ✅ | Admin |
| GET | `/api/v1/users/:id` | Détail d'un utilisateur | ✅ | Admin |
| POST | `/api/v1/users` | Créer un utilisateur | ✅ | Admin |
| PATCH | `/api/v1/users/:id` | Modifier un utilisateur | ✅ | Admin |
| DELETE | `/api/v1/users/:id` | Supprimer un utilisateur | ✅ | Admin |

**Exemple :**

```bash
# Liste des utilisateurs
curl http://localhost:8079/api/v1/users

# Créer un utilisateur
curl -X POST http://localhost:8079/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nouveau@cms.local",
    "password": "motdepasse123",
    "firstname": "Prénom",
    "lastname": "Nom",
    "role": "author"
  }'
```

### Endpoints articles

| Méthode | Route | Description | Auth | Permissions |
|---------|-------|-------------|------|-------------|
| GET | `/api/v1/articles` | Liste des articles | ❌ | Public |
| GET | `/api/v1/articles/:id` | Détail d'un article | ❌ | Public |
| GET | `/api/v1/articles/slug/:slug` | Article par slug | ❌ | Public |
| POST | `/api/v1/articles` | Créer un article | ✅ | Tous |
| PATCH | `/api/v1/articles/:id` | Modifier un article | ✅ | Tous* |
| DELETE | `/api/v1/articles/:id` | Supprimer un article | ✅ | Tous* |
| PATCH | `/api/v1/articles/:id/publish` | Publier un article | ✅ | Admin, Editor |
| PATCH | `/api/v1/articles/:id/archive` | Archiver un article | ✅ | Admin, Editor |
| GET | `/api/v1/articles/:id/categories` | Catégories d'un article | ❌ | Public |
| GET | `/api/v1/articles/:id/tags` | Tags d'un article | ❌ | Public |
| GET | `/api/v1/articles/:id/versions` | Versions d'un article | ✅ | Tous* |
| GET | `/api/v1/articles/:id/versions/:versionId` | Détail d'une version | ✅ | Tous* |

*Selon les permissions (voir section Articles)

**Exemple :**

```bash
# Liste des articles (public)
curl http://localhost:8079/api/v1/articles

# Créer un article
curl -X POST http://localhost:8079/api/v1/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mon article",
    "content": "Contenu de l'\''article",
    "excerpt": "Résumé",
    "author_id": 1,
    "status": "draft",
    "categories": [1, 2],
    "tags": [1, 3]
  }'

# Publier un article
curl -X PATCH http://localhost:8079/api/v1/articles/1/publish \
  -H "Content-Type: application/json"
```

### Endpoints catégories

| Méthode | Route | Description | Auth | Permissions |
|---------|-------|-------------|------|-------------|
| GET | `/api/v1/categories` | Liste des catégories | ❌ | Public |
| GET | `/api/v1/categories/:id` | Détail d'une catégorie | ❌ | Public |
| POST | `/api/v1/categories` | Créer une catégorie | ✅ | Admin, Editor |
| PATCH | `/api/v1/categories/:id` | Modifier une catégorie | ✅ | Admin, Editor |
| DELETE | `/api/v1/categories/:id` | Supprimer une catégorie | ✅ | Admin, Editor |
| GET | `/api/v1/categories/:id/articles` | Articles d'une catégorie | ❌ | Public |

**Exemple :**

```bash
# Liste des catégories (public)
curl http://localhost:8079/api/v1/categories

# Créer une catégorie
curl -X POST http://localhost:8079/api/v1/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Technologie",
    "description": "Articles sur la technologie"
  }'
```

### Endpoints tags

| Méthode | Route | Description | Auth | Permissions |
|---------|-------|-------------|------|-------------|
| GET | `/api/v1/tags` | Liste des tags | ❌ | Public |
| GET | `/api/v1/tags/:id` | Détail d'un tag | ❌ | Public |
| POST | `/api/v1/tags` | Créer un tag | ✅ | Admin, Editor |
| PATCH | `/api/v1/tags/:id` | Modifier un tag | ✅ | Admin, Editor |
| DELETE | `/api/v1/tags/:id` | Supprimer un tag | ✅ | Admin, Editor |
| GET | `/api/v1/tags/:id/articles` | Articles d'un tag | ❌ | Public |

**Exemple :**

```bash
# Liste des tags (public)
curl http://localhost:8079/api/v1/tags

# Créer un tag
curl -X POST http://localhost:8079/api/v1/tags \
  -H "Content-Type: application/json" \
  -d '{
    "name": "PHP",
    "description": "Articles sur PHP"
  }'
```

## 📊 Structure du projet

```
projet-semestriel/
├── api/                          # Backend (API + Back-office)
│   ├── app/
│   │   ├── src/
│   │   │   ├── Controllers/      # Contrôleurs (Admin + API)
│   │   │   ├── Entities/         # Entités métier
│   │   │   ├── Repositories/     # Accès BDD
│   │   │   └── Lib/              # Framework maison
│   │   ├── config/
│   │   │   ├── routes.json       # Configuration des routes
│   │   │   └── database.json     # Configuration BDD
│   │   ├── views/                # Vues HTML (Back-office)
│   │   └── uploads/              # Fichiers médias uploadés
│   ├── assets/
│   │   ├── css/                  # Framework SASS
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── partials/
│   │   └── main.scss
│   ├── database/
│   │   └── init/                 # Scripts SQL d'initialisation
│   │       ├── 01-users.sql
│   │       ├── 02-categories.sql
│   │       ├── 03-articles.sql
│   │       ├── 04-article_category.sql
│   │       ├── 05-tags.sql
│   │       ├── 06-article_tag.sql
│   │       ├── 07-article_versions.sql
│   │       └── 08-media.sql      # Table médias et relations
│   ├── dist/                     # Fichiers compilés
│   └── docker-compose.yml
├── frontend/                     # Frontend séparé (optionnel)
└── README.md
```

## 🏗️ Framework maison

### Composants du framework

#### 1. Routing dynamique

- Gestion des routes GET/POST/PATCH/DELETE
- Support des paramètres dynamiques (`/articles/:id`)
- Fallback 404 automatique
- Configuration centralisée dans `routes.json`
- Support des méthodes HTTP simulées (`_method` dans POST)

**Exemple de route :**

```json
{
  "path": "/api/v1/articles/:id",
  "method": "GET",
  "controller": "Api\\v1\\Articles\\GetArticleController"
}
```

#### 2. Controller / View Renderer

- Système de contrôleurs instanciés selon les routes
- Gestion des vues avec templating simple (inclusion, variables)
- Support des layouts et composants réutilisables
- Gestion d'erreurs HTTP (404, 403)

**Exemple :**

```php
return $this->render('admin/articles', [
    'articles' => $articles,
    'csrf_token' => $token
]);
```

#### 3. ORM léger / DAL

- Mapping objet-relationnel minimal
- CRUD automatique (find, save, update, delete)
- Sécurisation avec PDO + prepared statements
- Support des relations (catégories, tags, médias)
- Génération automatique de slugs uniques

**Exemple :**

```php
$articleRepository = new ArticleRepository();
$article = $articleRepository->find(1);
$article->title = "Nouveau titre";
$articleRepository->update($article);
```

#### 4. Middleware

- Gestion de la session / authentification
- Vérification des rôles / permissions
- Protection CSRF
- Redirection automatique (login, 403)

**Exemple :**

```php
$this->requireCanManageUsers(); // Redirige vers /403 si non autorisé
```

#### 5. Autoload / Namespaces / PSR

- Respect des conventions PSR-4
- Organisation modulaire (App/, Controllers/, Entities/, Repositories/)
- Autoloading via Composer

## 🔒 Sécurité

### Protections implémentées

1. **CSRF** : Tous les formulaires protégés par tokens
2. **XSS** : Échappement HTML avec `htmlspecialchars()`
3. **SQL Injection** : PDO avec prepared statements
4. **Authentification** : Sessions PHP sécurisées
5. **Permissions** : Vérification à chaque requête
6. **Mots de passe** : Hachage avec `password_hash()` (bcrypt)

### Validation

- Validation côté serveur dans tous les contrôleurs
- Messages d'erreur clairs pour l'utilisateur
- Protection contre les données invalides
- Validation conditionnelle (ex: contenu requis uniquement si publié)

## 📝 Workflow de publication

### États des articles

1. **Draft (Brouillon)** : Article en cours de rédaction
   - Contenu optionnel
   - Visible uniquement par l'auteur (ou admin/editor)

2. **Published (Publié)** : Article publié
   - Contenu requis
   - Visible publiquement via l'API
   - Date de publication enregistrée

3. **Archived (Archivé)** : Article archivé
   - Peut être restauré
   - Non visible publiquement

### Processus de publication

```
Création → Draft → (Validation) → Published → Archived
```

- **Author** : Crée en draft, ne peut pas publier seul
- **Editor/Admin** : Peut créer directement en published ou publier un draft

## 🎨 Framework SASS

### Structure

```
assets/css/
├── components/      # Composants réutilisables
├── pages/           # Styles spécifiques aux pages
└── partials/        # Variables, mixins, fonctions
```

### Système de couleurs

- Variables centralisées dans `_variables.scss`
- Génération automatique de shades (50, 100, ..., 950)
- Classes utilitaires générées automatiquement
- Support du dark mode (via `prefers-color-scheme`)

**Couleurs disponibles :**

- `blue`, `gray`, `red`, `green`, `yellow`
- `black`, `white`, `slate`, `indigo`, `purple`

**Utilisation :**

```html
<div class="bg-indigo-500 text-white">...</div>
```

## 🐳 Commandes Docker utiles

### Voir les logs

```bash
docker logs php-CMS
docker logs php-postgres-CMS
docker logs -f php-CMS  # Suivre en temps réel
```

### Accéder aux conteneurs

```bash
# Shell PHP
docker exec -it php-CMS bash

# PostgreSQL
docker exec -it php-postgres-CMS psql -U user -d db
```

### Gérer les conteneurs

```bash
# Arrêter
docker-compose down

# Arrêter et supprimer volumes (⚠️ supprime les données)
docker-compose down -v

# Redémarrer
docker-compose restart

# Reconstruire
docker-compose up -d --build
```

### Compilation SCSS

```bash
# Compilation unique
docker exec -it php-CMS bash -c "cd /var/www/html && sass assets/main.scss dist/css/main.css"

# Watch mode
docker exec -it php-CMS bash -c "cd /var/www/html && sass -w assets/main.scss dist/css/main.css"
```

## 🧪 Commandes de test

### Créer des utilisateurs de test

```bash
# Admin
curl -X POST http://localhost:8079/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.local", "password": "admin123", "firstname": "Admin", "lastname": "Test", "role": "admin"}'

# Editor
curl -X POST http://localhost:8079/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"email": "editor@test.local", "password": "editor123", "firstname": "Editor", "lastname": "Test", "role": "editor"}'

# Author
curl -X POST http://localhost:8079/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"email": "author@test.local", "password": "author123", "firstname": "Author", "lastname": "Test", "role": "author"}'
```

### Tester l'API

```bash
# Articles publics
curl http://localhost:8079/api/v1/articles

# Catégories publiques
curl http://localhost:8079/api/v1/categories

# Tags publics
curl http://localhost:8079/api/v1/tags
```

## 📚 Fonctionnalités implémentées

### ✅ Fonctionnalités principales

- [x] Framework maison (routing, controllers, ORM, middleware)
- [x] CMS headless avec API REST
- [x] Back-office complet
- [x] Gestion des utilisateurs avec rôles (Admin, Editor, Author)
- [x] Système de permissions (RBAC)
- [x] CRUD articles avec workflow (draft → published → archived)
- [x] Gestion des catégories et tags
- [x] Relations N:N (articles ↔ catégories, articles ↔ tags, articles ↔ médias)
- [x] Gestion complète des médias (upload, médiathèque personnelle, association aux articles)
- [x] Versioning des articles
- [x] Authentification sécurisée (sessions, CSRF)
- [x] Framework SASS avec variables et utilitaires
- [x] Interface responsive
- [x] Messages flash (succès/erreur)
- [x] Validation des formulaires
- [x] Protection CSRF sur tous les formulaires

### 🔄 Fonctionnalités bonus (en cours)

- [x] Gestion complète des médias (upload, médiathèque, association aux articles)
- [ ] SEO avancé (meta tags, sitemap.xml, robots.txt)
- [ ] Recherche avancée
- [ ] Cache et performances
- [ ] Internationalisation (i18n)

## 📖 Documentation technique

### Architecture

Le projet suit une architecture MVC simplifiée :

- **Models** : Entities (User, Article, Category, Tag, Media)
- **Views** : Templates HTML dans `app/views/`
- **Controllers** : Logique métier dans `app/src/Controllers/`
- **Repositories** : Accès aux données dans `app/src/Repositories/`

### Conventions de code

- **PSR-4** : Autoloading des classes
- **Namespaces** : Organisation par modules
- **Naming** : CamelCase pour les classes, snake_case pour les méthodes
- **Comments** : Documentation en français

## 🤝 Contribution

### Branches

Format : `type/description-courte`

Types :
- `feature/` : nouvelle fonctionnalité
- `fix/` : correction de bug
- `chore/` : config/maintenance
- `docs/` : documentation

### Commits

Format : `type: description courte`

Types :
- `feat` : nouvelle fonctionnalité
- `fix` : correction de bug
- `chore` : configuration / maintenance
- `docs` : documentation

### Validation

Toute issue doit être testée et validée par au moins un autre membre de l'équipe avant d'être marquée comme terminée.

## 📞 Support

Pour toute question ou problème, ouvrir une issue sur GitHub.

## 📄 Licence

Ce projet est développé dans le cadre d'un projet académique.
