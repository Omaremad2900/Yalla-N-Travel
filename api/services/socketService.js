import { Server } from "socket.io";

let io;

/**
 * Initialize the Socket.IO server
 * @param {Object} httpServer - The HTTP server instance
 */
export const initSocketService = (httpServer) => {
  io = new Server(4000, {
    cors: {
      origin: "http://localhost:5176", // Replace with your frontend's URL
      methods: ["GET", "POST"],
    },
  });

  console.log("Socket.IO initialized!");

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle notifications
    socket.on("joinRoom", (room) => {
      console.log(`Client ${socket.id} joined room: ${room}`);
      socket.join(room);
    });

    // Clean up on disconnect
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
  return io;
};

/**
 * Send notifications to a specific room
 * @param {string} room - Room name (e.g., event ID or user ID)
 * @param {Object} data - Notification data
 */
export const sendNotification = (room, data) => {
  if (!io) {
    console.error("Socket.IO is not initialized!");
    return;
  }

  io.to(room).emit("notification", data);
  console.log(`Notification sent to room: ${room}`);
};
