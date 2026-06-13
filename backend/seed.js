const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./src/config/environment');

// Schema imports
const UserModel = require('./src/infrastructure/database/models/UserModel');
const { Workspace: WorkspaceModel, WorkspaceMember: WorkspaceMemberModel } = require('./src/infrastructure/database/models/WorkspaceModel');
const ProjectModel = require('./src/infrastructure/database/models/ProjectModel');
const TaskModel = require('./src/infrastructure/database/models/TaskModel');
const CommentModel = require('./src/infrastructure/database/models/CommentModel');
const NotificationModel = require('./src/infrastructure/database/models/NotificationModel');
const ActivityModel = require('./src/infrastructure/database/models/ActivityModel');

const seed = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(config.mongodbUri);
    console.log('Connected. Cleaning collections...');

    // Clean existing data
    await UserModel.deleteMany({});
    await WorkspaceModel.deleteMany({});
    await WorkspaceMemberModel.deleteMany({});
    await ProjectModel.deleteMany({});
    await TaskModel.deleteMany({});
    await CommentModel.deleteMany({});
    await NotificationModel.deleteMany({});
    await ActivityModel.deleteMany({});

    console.log('Collections cleared. Generating mock users...');

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    // Create developers and admin
    const dev1 = new UserModel({
      name: 'Developer One',
      email: 'dev1@taskflowai.com',
      password: defaultPassword,
      role: 'User',
      isVerified: true
    });

    const dev2 = new UserModel({
      name: 'Developer Two',
      email: 'dev2@taskflowai.com',
      password: defaultPassword,
      role: 'User',
      isVerified: true
    });

    const dev3 = new UserModel({
      name: 'Developer Three',
      email: 'dev3@taskflowai.com',
      password: defaultPassword,
      role: 'User',
      isVerified: true
    });

    const admin = new UserModel({
      name: 'Admin Manager',
      email: 'admin@taskflowai.com',
      password: defaultPassword,
      role: 'Admin',
      isVerified: true
    });

    await dev1.save();
    await dev2.save();
    await dev3.save();
    await admin.save();

    console.log('Users created. Generating Workspace...');

    // Workspace
    const workspace = new WorkspaceModel({
      name: 'Academic Team Alpha',
      description: 'Main workspace for software engineering final TP project.',
      owner: dev1._id
    });
    await workspace.save();

    // Add members to workspace
    await new WorkspaceMemberModel({ workspaceId: workspace._id, userId: dev1._id, role: 'Admin' }).save();
    await new WorkspaceMemberModel({ workspaceId: workspace._id, userId: dev2._id, role: 'Member' }).save();
    await new WorkspaceMemberModel({ workspaceId: workspace._id, userId: dev3._id, role: 'Member' }).save();
    await new WorkspaceMemberModel({ workspaceId: workspace._id, userId: admin._id, role: 'Member' }).save();

    console.log('Workspace members initialized. Creating Project...');

    // Project
    const project = new ProjectModel({
      name: 'TaskFlow AI Platform',
      description: 'MERN stack application inspired by Jira, Trello and Notion with AI modules.',
      workspaceId: workspace._id
    });
    await project.save();

    console.log('Project created. Adding tasks to Kanban board...');

    // Tasks
    const tasksData = [
      {
        title: 'Design database schema and Mongoose models',
        description: 'Establish collections for Users, Workspaces, Projects, Tasks, Comments, and Activities.',
        status: 'Done',
        priority: 'High',
        assigneeId: dev1._id,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        label: 'Database'
      },
      {
        title: 'Implement JWT authentication & validation rules',
        description: 'Setup registration, email verification triggers, logins, and protect secure endpoints.',
        status: 'In Progress',
        priority: 'High',
        assigneeId: dev1._id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // in 3 days
        label: 'Security'
      },
      {
        title: 'Develop frontend scaffold & routing layouts',
        description: 'Initialize React + Vite structure, Tailwind styles, and establish ProtectedRoutes elements.',
        status: 'Review',
        priority: 'Medium',
        assigneeId: dev2._id,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // in 1 day
        label: 'Frontend'
      },
      {
        title: 'Construct drag-and-drop Kanban Board component',
        description: 'Style board columns for Backlog, Todo, In Progress, Review, and Done. Wire state management.',
        status: 'Todo',
        priority: 'High',
        assigneeId: dev2._id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        label: 'Frontend'
      },
      {
        title: 'Integrate real-time notification streams via Socket.io',
        description: 'Emitters on backend for comments, project joins, or assignments. Listener contexts in front.',
        status: 'Backlog',
        priority: 'High',
        assigneeId: dev3._id,
        dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        label: 'Real-time'
      },
      {
        title: 'Configure OpenAI API abstractions & priority prompts',
        description: 'Hook up AI service class to query suggested priorities, estimates, or descriptions suggestions.',
        status: 'In Progress',
        priority: 'Medium',
        assigneeId: dev3._id,
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        label: 'AI-Engine'
      },
      {
        title: 'Write Docker compose configurations and run guide documentation',
        description: 'Provide docker-compose.yml wrapping Mongo and Node servers alongside setup walkthrough files.',
        status: 'Todo',
        priority: 'Low',
        assigneeId: null,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        label: 'DevOps'
      }
    ];

    const seededTasks = [];
    for (const taskData of tasksData) {
      const task = new TaskModel({
        projectId: project._id,
        ...taskData
      });
      await task.save();
      seededTasks.push(task);
    }

    console.log('Seeded tasks. Adding sample comment threads and activity feeds...');

    // Comments
    await new CommentModel({
      taskId: seededTasks[0]._id,
      userId: dev2._id,
      content: 'Excellent modeling! We should add indexes on foreign keys to optimize lookup speeds.'
    }).save();

    await new CommentModel({
      taskId: seededTasks[0]._id,
      userId: dev1._id,
      content: 'Good point. Added index: true on workspaceId and projectId in the Mongoose schemas.'
    }).save();

    // Activities
    const activities = [
      {
        workspaceId: workspace._id,
        userId: dev1._id,
        action: 'create_workspace',
        details: 'Created workspace: "Academic Team Alpha"'
      },
      {
        workspaceId: workspace._id,
        userId: dev1._id,
        action: 'create_project',
        details: 'Created project: "TaskFlow AI Platform"'
      },
      {
        workspaceId: workspace._id,
        userId: dev1._id,
        action: 'create_task',
        details: 'Created task: "Design database schema and Mongoose models"'
      },
      {
        workspaceId: workspace._id,
        userId: dev2._id,
        action: 'comment_task',
        details: 'Commented on task: "Design database schema and Mongoose models"'
      }
    ];

    for (const act of activities) {
      await new ActivityModel(act).save();
    }

    // Notification
    await new NotificationModel({
      userId: dev2._id,
      message: 'You have been assigned to task: "Develop frontend scaffold & routing layouts"',
      type: 'task',
      isRead: false
    }).save();

    console.log('\n==================================================');
    console.log('SEEDING SUCCESSFUL!');
    console.log('Test User Login Credentials:');
    console.log('  1. Developer 1 (Auth): dev1@taskflowai.com / password123');
    console.log('  2. Developer 2 (Tasks): dev2@taskflowai.com / password123');
    console.log('  3. Developer 3 (AI/Collab): dev3@taskflowai.com / password123');
    console.log('  4. System Admin: admin@taskflowai.com / password123');
    console.log('==================================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
