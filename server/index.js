const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io setup with detailed logging
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // React client URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Basic route
app.get('/', (req, res) => {
  res.send('Google Meet Clone Server is running!');
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`[SOCKET] User connected: ${socket.id}`);
  console.log(`[SOCKET] Total connected users: ${io.engine.clientsCount}`);

  // Handle user joining a meeting room
  socket.on('join-room', (roomId, userId) => {
    console.log(`[ROOM] User ${socket.id} joining room: ${roomId}`);
    
    // Join the socket room
    socket.join(roomId);
    
    // Notify other users in the room that a new user has connected
    socket.to(roomId).emit('user-connected', socket.id);
    
    // Send confirmation to the joining user
    socket.emit('room-joined', roomId);
    
    console.log(`[ROOM] Active rooms: ${[...io.sockets.adapter.rooms.keys()].filter(r => !r.includes('|'))}`);
  });

  // Handle WebRTC signaling data exchange
  socket.on('signal-data', ({ signal, targetUserId }) => {
    console.log(`[SIGNAL] Forwarding signal from ${socket.id} to ${targetUserId}`);
    
    // Forward the signal to the target user
    io.to(targetUserId).emit('receiving-signal', { 
      signal, 
      userId: socket.id 
    });
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log(`[SOCKET] User disconnected: ${socket.id}`);
    console.log(`[SOCKET] Total connected users: ${io.engine.clientsCount}`);
    
    // Note: Socket.io automatically removes the user from all rooms on disconnect
    // Other users will need to handle the disconnection on their end
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error(`[ERROR] Socket error for ${socket.id}:`, error);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`===========================================`);
  console.log(`Google Meet Clone Server`);
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`===========================================`);
});
