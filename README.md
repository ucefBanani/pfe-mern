# TaskFlow AI - Plateforme collaborative de gestion de projet

TaskFlow AI est une plateforme collaborative moderne de gestion de projet inspirée de Trello, Jira et Notion. Elle intègre la synchronisation des notifications en temps réel, des transitions d'état Kanban dynamiques, des fils de discussion pour les commentaires et des assistants de tâches alimentés par l'IA (configuration de la clé API OpenAI).

Le projet est structuré comme une application MERN Stack académique et prête pour la production, comprenant un backend en Clean Architecture et un frontend en React (Vite + Tailwind CSS + React Hook Form).

---

## 1. Architecture du Projet

Le backend est structuré selon les principes de la **Clean Architecture**, imposant une séparation stricte des préoccupations où les règles métier restent indépendantes des frameworks externes ou des bases de données :

```
src/
├── domain/                  # Règles métier de l'entreprise (Entités & Contrats)
│   ├── entities/            # Classes JS simples contenant les règles de validation
│   └── repositories/        # Interfaces abstraites/contrats des repositories principaux
├── application/             # Règles métier de l'application (Interacteurs/Cas d'utilisation)
│   ├── use-cases/           # Classes d'interacteurs contenant les règles spécifiques aux cas d'utilisation
│   └── services/            # Contrats d'interfaces pour la cryptographie, les jetons et l'IA
├── infrastructure/          # Adaptateurs & drivers de frameworks externes
│   ├── database/            # Connexions Mongoose, modèles et schémas
│   ├── repositories/        # Adaptateurs concrets des repositories MongoDB
│   ├── security/            # Services concrets de hachage Bcrypt et de jetons JWT
│   ├── email/               # Déclencheurs d'e-mails de vérification SMTP Nodemailer
│   └── ai/                  # Intégration OpenAI & client de simulation mocké
└── presentation/            # Interface utilisateur / Driver Web HTTP
    ├── controllers/         # Gère le mapping des paramètres de routage Express
    ├── routes/              # Définitions des routes de endpoints mappées
    ├── middlewares/         # Vérifications d'authentification, de rôles et validations
    └── socket/              # Connexions en temps réel via WebSockets (Socket.io)
```

---

## 2. Modèles de Base de Données & UML

La base de données est construite sur MongoDB en utilisant les schémas Mongoose. Les relations sont mappées sous forme de collections associatives :

- **Users (Utilisateurs) :** Détails d'authentification, vérification des identifiants, rôles (`Admin`, `User`).
- **Workspaces (Espaces de travail) :** Équipes regroupant des projets et des membres.
- **WorkspaceMembers (Membres de l'espace de travail) :** Mappe l'appartenance des utilisateurs au sein des espaces de travail avec des privilèges d'accès spécifiques.
- **Projects (Projets) :** Héberge les sprints cibles du tableau Kanban.
- **Tasks (Tâches) :** Tickets Kanban comprenant un statut (`Backlog`, `Todo`, `In Progress`, `Review`, `Done`), des badges de priorité, des étiquettes et des assignés.
- **Comments (Commentaires) :** Journaux de messages collaboratifs faisant référence à des tâches spécifiques.
- **Notifications :** Notifications informatives envoyées aux utilisateurs en temps réel.
- **Activities (Activités) :** Pistes d'audit de l'historique de l'équipe enregistrant les modifications de l'espace de travail.

---

## 3. Feuille de Route du Développement & Rôles (Équipe de 3)

Le projet a été planifié sur une séquence de Sprints de 4 semaines pour faciliter le développement collaboratif :

| Rôle Développeur | Affectation des Modules | Fichiers Principaux & Ressources |
| :--- | :--- | :--- |
| **Youssef (Auth & Utilisateur)** | Enregistrement des identifiants d'authentification, validation de connexion, vérification des jetons JWT, vues de profil, récupération de mot de passe oublié, vérifications de rôle. | `RegisterUser.js`, `VerifyEmail.js`, `authRoutes.js`, `Login.jsx`, `Register.jsx`, `Profile.jsx` |
| **Abdelkarim (Tableau de Tâches)** | Création d'espaces de travail, configurations de projets, CRUD des colonnes Kanban, mappages des affectations, priorités, étiquettes et statistiques du tableau de bord. | `WorkspaceDetail.jsx`, `TaskRepository.js`, `taskRoutes.js`, `ProjectModel.js`, `Dashboard.jsx` |
| **Tarik (Collab & IA)** | Flux en temps réel via WebSockets, journaux de commentaires, flux de notifications toast, estimations de priorité par OpenAI, résumés et fiches de rapport. | `socketHandler.js`, `OpenAIService.js`, `CommentModel.js`, `NotificationContext.jsx` |

### Calendrier des Sprints (4 Semaines)
1. **Semaine 1 (Configuration & Bases Auth) :** Structuration des dossiers principaux, connexions MongoDB, authentification JWT, déclencheurs nodemailer et maquettage des écrans d'authentification de l'interface utilisateur.
2. **Semaine 2 (Espaces de travail & CRUD du Tableau Kanban) :** Contrôleurs d'espaces de travail, logique d'ajout de membres, portées des projets et interfaces des colonnes Kanban.
3. **Semaine 3 (Collaboration & Flux de Sockets) :** Liaison d'événements Socket.io, publications dans les fils de commentaires, listes des journaux d'activité et contextes personnalisés des toasts.
4. **Semaine 4 (Intégration de l'IA & Analyses) :** Connexion à l'API OpenAI (ou logique de prompts mockés), indicateurs du tableau de bord d'administration, configurations de tests unitaires et guides de déploiement.

---

## 4. Stratégie de Branches Git

L'équipe adopte les conventions de nommage de branches GitFlow pour gérer le codage parallèle :

- **Branches Protégées :**
  - `main` : Base de code prête pour la production.
  - `develop` : Branche d'intégration partagée pour les Sprints.
- **Branches de Fonctionnalités (Nommage basé sur les fonctionnalités) :**
  - Youssef : `feat/user-auth-youssef`
  - Abdelkarim : `feat/project-tasks-abdelkarim`
  - Tarik : `feat/collab-ai-tarik`
- **Flux de travail :** Les développeurs écrivent du code sur les branches de fonctionnalités, poussent leurs modifications et soumettent des Pull Requests (PR) ciblant `develop`. Les Sprints sont intégrés dans `develop` puis publiés sous forme de version étiquetée (tag) dans `main` après validation.

---

## 5. Documentation de l'API

### API d'Authentification
- `POST /api/auth/register` - payload : `{ name, email, password }`
- `GET /api/auth/verify-email/:token` - active le statut vérifié
- `POST /api/auth/login` - payload : `{ email, password }` -> retourne un jeton (token)
- `POST /api/auth/forgot-password` - payload : `{ email }`
- `PUT /api/auth/reset-password/:token` - payload : `{ password }`
- `GET /api/auth/me` - récupère le profil de l'utilisateur connecté vérifié

### API des Espaces de Travail & Projets
- `POST /api/workspaces` - payload : `{ name, description }`
- `GET /api/workspaces` - liste les espaces de travail auxquels l'utilisateur appartient
- `POST /api/workspaces/:workspaceId/members` - payload : `{ email, role }`
- `GET /api/workspaces/:workspaceId/members` - liste les membres de l'équipe de l'espace de travail
- `POST /api/projects` - payload : `{ name, description, workspaceId }`
- `GET /api/projects?workspaceId=ID` - liste les projets de l'espace de travail

### API des Tâches & Assistant IA
- `GET /api/tasks?projectId=ID` - liste les tâches du projet (prend en charge les paramètres `search`, `priority`, `assigneeId`)
- `POST /api/tasks` - payload : `{ projectId, title, description, priority, status, assigneeId, dueDate, label }`
- `PUT /api/tasks/:id` - met à jour le statut, la priorité ou la personne assignée d'une tâche
- `DELETE /api/tasks/:id` - supprime une tâche
- `POST /api/tasks/:id/comments` - ajoute un commentaire
- `GET /api/tasks/:id/comments` - récupère les fils de discussion des commentaires d'une tâche
- `POST /api/tasks/suggest-priority` - évaluation par l'IA des suggestions de priorité des tâches
- `POST /api/tasks/suggest-description` - suggestions de descriptions de tâches par l'IA
- `POST /api/tasks/estimate-complexity` - estimation par l'IA des points d'effort (Fibonacci) d'une tâche
- `GET /api/tasks/weekly-report/:workspaceId` - rapports de productivité de l'espace de travail générés par l'IA
- `GET /api/projects/:projectId/ai-summary` - aperçu des résumés de projets générés par l'IA

---

## 6. Guide d'Installation & d'Exécution

### Prérequis
- [Node.js](https://nodejs.org) (v20+ recommandé)
- [MongoDB](https://www.mongodb.com) (serveur local ou Atlas) ou [Docker Desktop](https://www.docker.com/)

### Étape 1 : Lancer la Base de Données via Docker Compose
Pour exécuter une instance MongoDB locale en arrière-plan, lancez depuis la racine du projet :
```bash
docker compose up -d
```
*Note : Cela démarre MongoDB sur `mongodb://localhost:27017`.*

### Étape 2 : Configurer & Démarrer le Backend
1. Allez dans le dossier backend :
   ```bash
   cd backend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Initialisez les variables d'environnement :
   ```bash
   cp .env.example .env
   ```
   *(Par défaut, `.env` pointe vers MongoDB en local et active le mode de simulation mockée d'OpenAI).*
4. Remplissez la base de données de test (seeding) :
   ```bash
   npm run seed
   ```
5. Lancez le serveur en mode développement :
   ```bash
   npm run dev
   ```
   *Note : Le serveur backend démarre sur `http://localhost:5000`.*

### Étape 3 : Configurer & Démarrer le Frontend
1. Dans un autre onglet de terminal, allez dans le dossier frontend :
   ```bash
   cd frontend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Initialisez les variables d'environnement :
   ```bash
   cp .env.example .env
   ```
4. Démarrez le serveur Vite :
   ```bash
   npm run dev
   ```
   *Note : L'application frontend s'ouvrira sur `http://localhost:5173`.*

---

## 7. Données de Test & Identifiants

Le script de seeding génère quatre comptes préconfigurés (mot de passe : `password123`) :

1. **Youssef (Auth) :** `dev1@taskflowai.com`
2. **Abdelkarim (Tasks) :** `dev2@taskflowai.com`
3. **Tarik (AI/Collab) :** `dev3@taskflowai.com`
4. **Admin User (Metrics) :** `admin@taskflowai.com`
