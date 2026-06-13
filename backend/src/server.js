const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const config = require('./config/environment');

// Infrastructure Imports
const { connectDatabase } = require('./infrastructure/database/mongoose');
const MongoUserRepository = require('./infrastructure/repositories/MongoUserRepository');
const MongoWorkspaceRepository = require('./infrastructure/repositories/MongoWorkspaceRepository');
const MongoProjectRepository = require('./infrastructure/repositories/MongoProjectRepository');
const MongoTaskRepository = require('./infrastructure/repositories/MongoTaskRepository');
const MongoCommentRepository = require('./infrastructure/repositories/MongoCommentRepository');
const MongoNotificationRepository = require('./infrastructure/repositories/MongoNotificationRepository');

const BcryptHashService = require('./infrastructure/security/BcryptHashService');
const JwtTokenService = require('./infrastructure/security/JwtTokenService');
const NodemailerMailService = require('./infrastructure/email/NodemailerMailService');
const OpenAIService = require('./infrastructure/ai/OpenAIService');

// Use Cases Imports
const RegisterUser = require('./application/use-cases/auth/RegisterUser');
const VerifyEmail = require('./application/use-cases/auth/VerifyEmail');
const LoginUser = require('./application/use-cases/auth/LoginUser');
const ForgotPassword = require('./application/use-cases/auth/ForgotPassword');
const ResetPassword = require('./application/use-cases/auth/ResetPassword');

const CreateWorkspace = require('./application/use-cases/workspaces/CreateWorkspace');
const AddWorkspaceMember = require('./application/use-cases/workspaces/AddWorkspaceMember');
const GetWorkspaces = require('./application/use-cases/workspaces/GetWorkspaces');

const CreateProject = require('./application/use-cases/projects/CreateProject');
const GetProjects = require('./application/use-cases/projects/GetProjects');

const CreateTask = require('./application/use-cases/tasks/CreateTask');
const GetTasks = require('./application/use-cases/tasks/GetTasks');
const UpdateTask = require('./application/use-cases/tasks/UpdateTask');
const DeleteTask = require('./application/use-cases/tasks/DeleteTask');

const AddComment = require('./application/use-cases/comments/AddComment');
const GetComments = require('./application/use-cases/comments/GetComments');

const GetNotifications = require('./application/use-cases/notifications/GetNotifications');
const MarkNotificationRead = require('./application/use-cases/notifications/MarkNotificationRead');

const GetAITaskPriority = require('./application/use-cases/ai/GetAITaskPriority');
const GetAITaskDescription = require('./application/use-cases/ai/GetAITaskDescription');
const GetAITaskComplexity = require('./application/use-cases/ai/GetAITaskComplexity');
const GetAIProjectSummary = require('./application/use-cases/ai/GetAIProjectSummary');
const GetAIProductivityReport = require('./application/use-cases/ai/GetAIProductivityReport');

// Presentation Imports
const AuthController = require('./presentation/controllers/AuthController');
const WorkspaceController = require('./presentation/controllers/WorkspaceController');
const ProjectController = require('./presentation/controllers/ProjectController');
const TaskController = require('./presentation/controllers/TaskController');
const CommentController = require('./presentation/controllers/CommentController');
const AdminController = require('./presentation/controllers/AdminController');

const authMiddlewareFactory = require('./presentation/middlewares/authMiddleware');
const errorMiddleware = require('./presentation/middlewares/errorMiddleware');
const SocketHandler = require('./presentation/socket/socketHandler');

// Routes Factories
const authRoutesFactory = require('./presentation/routes/authRoutes');
const workspaceRoutesFactory = require('./presentation/routes/workspaceRoutes');
const projectRoutesFactory = require('./presentation/routes/projectRoutes');
const taskRoutesFactory = require('./presentation/routes/taskRoutes');
const commentRoutesFactory = require('./presentation/routes/commentRoutes');
const adminRoutesFactory = require('./presentation/routes/adminRoutes');

const bootApp = async () => {
  const app = express();
  const server = http.createServer(app);

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Connect Database
  await connectDatabase(config.mongodbUri);

  // Instantiating Infrastructure services
  const userRepository = new MongoUserRepository();
  const workspaceRepository = new MongoWorkspaceRepository();
  const projectRepository = new MongoProjectRepository();
  const taskRepository = new MongoTaskRepository();
  const commentRepository = new MongoCommentRepository();
  const notificationRepository = new MongoNotificationRepository();

  const hashService = new BcryptHashService();
  const tokenService = new JwtTokenService(config.jwtSecret);
  const mailService = new NodemailerMailService(config.smtp);
  const aiService = new OpenAIService(config.openaiApiKey);

  // Initialize Socket.io handler
  const socketHandler = new SocketHandler(server, tokenService);

  // Instantiating Interactors (Use Cases)
  const registerUser = new RegisterUser({ userRepository, hashService, mailService });
  const verifyEmail = new VerifyEmail({ userRepository });
  const loginUser = new LoginUser({ userRepository, hashService, tokenService });
  const forgotPassword = new ForgotPassword({ userRepository, mailService });
  const resetPassword = new ResetPassword({ userRepository, hashService });

  const createWorkspace = new CreateWorkspace({ workspaceRepository });
  const addWorkspaceMember = new AddWorkspaceMember({ workspaceRepository, userRepository });
  const getWorkspaces = new GetWorkspaces({ workspaceRepository });

  const createProject = new CreateProject({ projectRepository, workspaceRepository });
  const getProjects = new GetProjects({ projectRepository, workspaceRepository });

  const createTask = new CreateTask({ taskRepository, projectRepository, workspaceRepository, notificationRepository, socketHandler });
  const getTasks = new GetTasks({ taskRepository, projectRepository, workspaceRepository });
  const updateTask = new UpdateTask({ taskRepository, projectRepository, workspaceRepository, notificationRepository, socketHandler });
  const deleteTask = new DeleteTask({ taskRepository, projectRepository, workspaceRepository, socketHandler });

  const addComment = new AddComment({ commentRepository, taskRepository, projectRepository, workspaceRepository, notificationRepository, socketHandler });
  const getComments = new GetComments({ commentRepository, taskRepository, projectRepository, workspaceRepository });

  const getNotifications = new GetNotifications({ notificationRepository });
  const markNotificationRead = new MarkNotificationRead({ notificationRepository });

  const getAITaskPriority = new GetAITaskPriority({ aiService });
  const getAITaskDescription = new GetAITaskDescription({ aiService });
  const getAITaskComplexity = new GetAITaskComplexity({ aiService });
  const getAIProjectSummary = new GetAIProjectSummary({ aiService, projectRepository, taskRepository });
  const getAIProductivityReport = new GetAIProductivityReport({ aiService, taskRepository, projectRepository });

  // Instantiating Controllers
  const authController = new AuthController({ registerUser, verifyEmail, loginUser, forgotPassword, resetPassword, userRepository });
  const workspaceController = new WorkspaceController({ createWorkspace, addWorkspaceMember, getWorkspaces, workspaceRepository });
  const projectController = new ProjectController({ createProject, getProjects, getAIProjectSummary });
  const taskController = new TaskController({
    createTask, getTasks, updateTask, deleteTask,
    getAITaskPriority, getAITaskDescription, getAITaskComplexity, getAIProductivityReport,
    taskRepository
  });
  const commentController = new CommentController({ addComment, getComments });
  const adminController = new AdminController({ userRepository, projectRepository, taskRepository });

  // Security Express Middleware
  const authMiddleware = authMiddlewareFactory(tokenService);

  // Mapping Routers
  app.use('/api/auth', authRoutesFactory(authController, authMiddleware));
  app.use('/api/workspaces', workspaceRoutesFactory(workspaceController, authMiddleware));
  app.use('/api/projects', projectRoutesFactory(projectController, authMiddleware));
  app.use('/api/tasks', taskRoutesFactory(taskController, authMiddleware));
  app.use('/api/comments', commentRoutesFactory(commentController, authMiddleware));
  app.use('/api/admin', adminRoutesFactory(adminController, authMiddleware));

  // Base checking route
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'healthy', env: config.nodeEnv });
  });

  // Notifications Route (Direct resolution)
  app.get('/api/notifications', authMiddleware, async (req, res, next) => {
    try {
      const notifs = await getNotifications.execute({ userId: req.user.id });
      res.status(200).json(notifs);
    } catch (err) {
      next(err);
    }
  });

  app.put('/api/notifications/:id/read', authMiddleware, async (req, res, next) => {
    try {
      const notif = await markNotificationRead.execute({ notificationId: req.params.id, userId: req.user.id });
      res.status(200).json(notif);
    } catch (err) {
      next(err);
    }
  });

  // Global Error Handler Middleware
  app.use(errorMiddleware);

  // Server bootstrap
  server.listen(config.port, () => {
    console.log(`[BOOT] TaskFlow AI Server running in '${config.nodeEnv}' mode on port ${config.port}`);
  });
};

bootApp().catch(err => {
  console.error('[FATAL BOOT ERROR]', err.message);
  process.exit(1);
});
