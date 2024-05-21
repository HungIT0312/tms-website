const socketIo = require("socket.io");

let io;
const userConnections = {};

const initializeSocket = (server, corsOptions) => {
  io = socketIo(server, { cors: corsOptions });

  io.on("connection", (socket) => {
    socket.on("join", ({ userId }) => {
      userConnections[userId] = socket.id;
      //   console.log(`User ${userId} connected with socket ID ${socket.id}`);
      console.log("A user connected");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
      for (const [userId, socketId] of Object.entries(userConnections)) {
        if (socketId === socket.id) {
          delete userConnections[userId];
          break;
        }
      }
    });
  });
};

const emitToUser = (userId, event, data) => {
  const socketId = userConnections[userId];
  if (socketId && io) {
    io.to(socketId).emit(event, data);
  }
};

module.exports = { initializeSocket, emitToUser };
