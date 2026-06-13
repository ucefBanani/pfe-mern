Create a complete MERN Stack project for a university-level practical assignment (TP).

Project Name: Todo Flow

Objective:
Build a task management application where users can create, update, delete, organize, and track their daily tasks.

Technical Requirements:

Frontend:
- React.js (latest stable version)
- Vite as build tool
- React Router
- Axios for API communication
- Responsive UI
- Modern and clean design
- Form validation
- Loading states and error handling

Backend:
- Node.js
- Express.js
- MongoDB with Mongoose
- REST API
- Environment variables configuration
- Global error handling middleware
- Input validation
- JWT Authentication

Architecture:
Backend and frontend must be completely separated.

Folder Structure:

backend/
├── src/
│   ├── application/
│   │   ├── use-cases/
│   │   └── services/
│   ├── domain/
│   │   ├── entities/
│   │   └── repositories/
│   ├── infrastructure/
│   │   ├── database/
│   │   ├── repositories/
│   │   └── security/
│   ├── presentation/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middlewares/
│   ├── config/
│   └── app.js
├── package.json
└── .env.example

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   ├── context/
│   ├── routes/
│   ├── utils/
│   └── App.jsx
├── package.json
└── .env.example

Features:

Authentication:
- Register
- Login
- Logout
- Protected routes

Todo Management:
- Create Todo
- Edit Todo
- Delete Todo
- Mark Todo as completed
- Filter by status
- Search Todo
- Pagination

Todo Fields:
- Title
- Description
- Priority (Low, Medium, High)
- Status (Pending, In Progress, Completed)
- Due Date
- Created At

Database Collections:
- Users
- Todos

API Endpoints:
POST /api/auth/register
POST /api/auth/login
GET /api/todos
GET /api/todos/:id
POST /api/todos
PUT /api/todos/:id
DELETE /api/todos/:id

Development Requirements:
- Clean Architecture principles
- Dependency Injection where appropriate
- Repository Pattern
- Service Layer Pattern
- Reusable React Components
- Custom Hooks
- Proper separation of concerns
- ESLint configuration
- README with installation steps

Deliverables:
1. Complete backend source code.
2. Complete frontend source code.
3. MongoDB schema.
4. API documentation.
5. README explaining project setup.
6. Docker configuration (optional bonus).
7. Seed script for test data.

Generate production-quality code with comments explaining important architectural decisions.