# TaskFlow AI - Collaborative Project Management Platform

TaskFlow AI is a modern collaborative project management platform inspired by Trello, Jira, and Notion. It incorporates real-time notification synchronization, dynamic Kanban state transitions, comment threads, and AI-powered task helpers (OpenAI API key configuration).

The project is structured as an academic, production-ready MERN Stack application featuring a Clean Architecture backend and a React (Vite + Tailwind CSS + React Hook Form) frontend.

---

## 1. Project Architecture

The backend is structured according to **Clean Architecture** principles, enforcing a strict separation of concerns where business rules remain independent of external frameworks or databases:

```
src/
├── domain/                  # Enterprise business rules (Entities & Contracts)
│   ├── entities/            # Plain JS classes containing validation rules
│   └── repositories/        # Core repository abstract interfaces/contracts
├── application/             # Application business rules (Interactors/Use Cases)
│   ├── use-cases/           # Interactor classes containing use-case specific rules
│   └── services/            # Cryptography, token and AI interface contracts
├── infrastructure/          # External framework adapters & drivers
│   ├── database/            # Mongoose connections, models and schemas
│   ├── repositories/        # Concrete Mongo Repository adapters
│   ├── security/            # Bcrypt hashing and JWT token concrete services
│   ├── email/               # Nodemailer SMTP email verified triggers
│   └── ai/                  # OpenAI integration & Mock simulation client
└── presentation/            # User Interface/HTTP Web driver
    ├── controllers/         # Handles Express routing parameters mapping
    ├── routes/              # Mapped endpoint routing definitions
    ├── middlewares/         # Auth verification, roles, validation checks
    └── socket/              # WebSockets (Socket.io) real-time connections
```

---

## 2. Database Models & UML

The database is built on MongoDB using Mongoose schemas. Relationships are mapped as associative collections:

- **Users:** Authentication details, credentials verification, roles (`Admin`, `User`).
- **Workspaces:** Teams grouping projects and members.
- **WorkspaceMembers:** Maps user memberships inside workspaces with specific access privileges.
- **Projects:** Hosts target Kanban board sprints.
- **Tasks:** Kanban tickets featuring status (`Backlog`, `Todo`, `In Progress`, `Review`, `Done`), priority badges, labels, and assignees.
- **Comments:** Collaborative message logs referencing specific tasks.
- **Notifications:** Informative notifications dispatched to users in real-time.
- **Activities:** Team history audit trails logging workspace changes.

---

## 3. Development Roadmap & Roles (Team of 3)

The project has been planned over a 4-week Sprint sequence to facilitate collaborative development:

| Developer Role | Module Assignments | Primary Files & Assets |
| :--- | :--- | :--- |
| **Developer 1 (Auth & User)** | Auth credentials registration, login validation, JWT tokens verify, profile views, forgot pass recovery, role checks. | `RegisterUser.js`, `VerifyEmail.js`, `authRoutes.js`, `Login.jsx`, `Register.jsx`, `Profile.jsx` |
| **Developer 2 (Tasks Board)** | Workspace creation, project setups, Kanban column list CRUD, assignment maps, priorities, labels, and dashboard stats. | `WorkspaceDetail.jsx`, `TaskRepository.js`, `taskRoutes.js`, `ProjectModel.js`, `Dashboard.jsx` |
| **Developer 3 (Collab & AI)** | Real-time streams via WebSockets, comments logs, toast feeds, OpenAI priority estimations, summaries and report cards. | `socketHandler.js`, `OpenAIService.js`, `CommentModel.js`, `NotificationContext.jsx` |

### 4-Week Sprint Schedule
1. **Week 1 (Setup & Auth Foundations):** Scaffolding core folder skeletons, MongoDB connections, JWT auth, nodemailer triggers, and UI auth screen layouts.
2. **Week 2 (Workspaces & Kanban Board CRUD):** Workspace controllers, member addition logic, Project scopes, and Kanban column interfaces.
3. **Week 3 (Collaboration & Socket Streams):** Socket.io events binding, comment thread posts, activity log lists, and custom toast contexts.
4. **Week 4 (AI Integration & Analytics):** OpenAI API connection (or mock prompts logic), Admin Dashboard metrics, unit test configs, and deployment guides.

---

## 4. Git Branching Strategy

The team adopts GitFlow branch naming conventions to manage parallel coding:

- **Protected Branches:**
  - `main`: Release-ready codebase.
  - `develop`: Shared integration branch for Sprints.
- **Feature Branches (Feature-driven naming):**
  - Developer 1: `feat/user-auth-dev1`
  - Developer 2: `feat/project-tasks-dev2`
  - Developer 3: `feat/collab-ai-dev3`
- **Workflow:** Developers write code on feature branches, push changes, and submit Pull Requests (PRs) targeting `develop`. Sprints are integrated into `develop` and tag-released into `main` after checks.

---

## 5. API Documentation

### Authentication API
- `POST /api/auth/register` - payload: `{ name, email, password }`
- `GET /api/auth/verify-email/:token` - activates verified status
- `POST /api/auth/login` - payload: `{ email, password }` -> returns token
- `POST /api/auth/forgot-password` - payload: `{ email }`
- `PUT /api/auth/reset-password/:token` - payload: `{ password }`
- `GET /api/auth/me` - retrieves current verified user profile

### Workspaces & Projects API
- `POST /api/workspaces` - payload: `{ name, description }`
- `GET /api/workspaces` - lists workspaces user belongs to
- `POST /api/workspaces/:workspaceId/members` - payload: `{ email, role }`
- `GET /api/workspaces/:workspaceId/members` - list workspace team members
- `POST /api/projects` - payload: `{ name, description, workspaceId }`
- `GET /api/projects?workspaceId=ID` - lists workspace projects

### Tasks API & AI Copilot
- `GET /api/tasks?projectId=ID` - list project tasks (supports `search`, `priority`, `assigneeId` parameters)
- `POST /api/tasks` - payload: `{ projectId, title, description, priority, status, assigneeId, dueDate, label }`
- `PUT /api/tasks/:id` - update task status, priority, or assignee
- `DELETE /api/tasks/:id` - delete task
- `POST /api/tasks/:id/comments` - add comment
- `GET /api/tasks/:id/comments` - retrieve task comment threads
- `POST /api/tasks/suggest-priority` - AI evaluate task priority suggestions
- `POST /api/tasks/suggest-description` - AI suggest task list descriptions
- `POST /api/tasks/estimate-complexity` - AI estimate task Fibonacci story points
- `GET /api/tasks/weekly-report/:workspaceId` - AI workspace productivity reports
- `GET /api/projects/:projectId/ai-summary` - AI project summaries overview

---

## 6. Installation & Execution Guide

### Prerequisites
- [Node.js](https://nodejs.org) (v20+ recommended)
- [MongoDB](https://www.mongodb.com) (local server or Atlas) or [Docker Desktop](https://www.docker.com/)

### Step 1: Run Database via Docker Compose
To run a local MongoDB instance in the background, execute from the project root:
```bash
docker compose up -d
```
*Note: This spins up MongoDB on `mongodb://localhost:27017`.*

### Step 2: Configure & Start Backend
1. Go to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the environment variables:
   ```bash
   cp .env.example .env
   ```
   *(By default, `.env` points to local MongoDB and Mock OpenAI modes).*
4. Seed the test database:
   ```bash
   npm run seed
   ```
5. Boot up the server in dev mode:
   ```bash
   npm run dev
   ```
   *Note: Backend server boots on `http://localhost:5000`.*

### Step 3: Configure & Start Frontend
1. In a separate terminal tab, go to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the Vite server:
   ```bash
   npm run dev
   ```
   *Note: Frontend app will open on `http://localhost:5173`.*

---

## 7. Seeding & Test Credentials

The database seed script generates four pre-configured accounts (password: `password123`):

1. **Developer 1 (Auth):** `dev1@taskflowai.com`
2. **Developer 2 (Tasks):** `dev2@taskflowai.com`
3. **Developer 3 (AI/Collab):** `dev3@taskflowai.com`
4. **Admin User (Metrics):** `admin@taskflowai.com`
