const socketIo = require('socket.io');

class SocketHandler {
  constructor(server, tokenService) {
    this.io = socketIo(server, {
      cors: {
        origin: '*', // allows simple testing
        methods: ['GET', 'POST']
      }
    });
    this.tokenService = tokenService;
    this.userSockets = new Map(); // maps userId (string) -> Set of socketIds

    this._initialize();
  }

  _initialize() {
    // Authentication middleware
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) {
        return next(new Error('Authentication error: Token required.'));
      }

      try {
        const decoded = this.tokenService.verify(token);
        socket.user = decoded; // Attach user payload: { id, email, role }
        next();
      } catch (err) {
        next(new Error('Authentication error: Invalid token.'));
      }
    });

    this.io.on('connection', (socket) => {
      const userId = socket.user.id;
      
      // Register socket mapping
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId).add(socket.id);
      
      console.log(`[SOCKET CONNECT] User ${socket.user.name || userId} connected (Socket: ${socket.id})`);

      // Join project room
      socket.on('join_project', (projectId) => {
        socket.join(`project:${projectId}`);
        console.log(`[SOCKET ROOM] Socket ${socket.id} joined project:${projectId}`);
      });

      // Leave project room
      socket.on('leave_project', (projectId) => {
        socket.leave(`project:${projectId}`);
        console.log(`[SOCKET ROOM] Socket ${socket.id} left project:${projectId}`);
      });

      socket.on('disconnect', () => {
        console.log(`[SOCKET DISCONNECT] Socket ${socket.id} disconnected`);
        const userSocks = this.userSockets.get(userId);
        if (userSocks) {
          userSocks.delete(socket.id);
          if (userSocks.size === 0) {
            this.userSockets.delete(userId);
          }
        }
      });
    });
  }

  // Send real-time event to all sockets of a specific user
  sendToUser(userId, event, data) {
    const socketIds = this.userSockets.get(userId.toString());
    if (socketIds) {
      socketIds.forEach(socketId => {
        this.io.to(socketId).emit(event, data);
      });
      return true;
    }
    return false;
  }

  // Send real-time event to a project room
  sendToProject(projectId, event, data) {
    this.io.to(`project:${projectId.toString()}`).emit(event, data);
  }
}

module.exports = SocketHandler;
