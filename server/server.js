import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import connectDB from './Database/dbConnect.js';
import authAdminRoutes from './routes/admin.routes.js';
import authUserRoutes from './routes/user.routes.js';
import classRoomRoutes from './routes/classroom.routes.js';
import path from 'path';


import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);

const _dirname = path.resolve();

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    "http://localhost:5173",          // local frontend (Vite default)
    "https://smartboard-with-smart-attendance-system-2.onrender.com" // deployed frontend
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

// ✅ Setup socket.io with same CORS
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://smartboard-with-smart-attendance-system-2.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO logic
const roomAdmins = new Map();
const userSocket=new Map();


// API routes
io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join', ({ roomid ,username }) => {
        if (!username) return;

        socket.join(roomid);
        socket.username = username; // Attach username to socket
        userSocket.set(username, socket.id);
        console.log(userSocket);
        console.log(`${socket.id} joined ${roomid}`);
       if(!username)return;
       let id=socket.id
        socket.to(roomid).emit('student',{id,username});
 console.log(username,"has id ",id)
    });

    socket.on('drawing', ({ roomid, data }) => {
        socket.to(roomid).emit('r-drawing', data);
    });

    socket.on('send-attendance', ({ message, roomid }) => {
        console.log(message + " to " + roomid);
        socket.to(roomid).emit('r-attendance', { message });
    });

    socket.on('sendreq', ({ message, roomid, socketid }) => {
        console.log('message name is ', message, roomid);
        socket.to(roomid).emit('r-sendreq', { message, socketid });
    });

    socket.on('mark', ({ rollnumber, roomid }) => {
        console.log("message", rollnumber);
        socket.to(roomid).emit("r-mark", { rollnumber });
    });

    socket.on('leave', ({ roomid }) => {
        // socket.leave(roomid);
        socket.disconnect(true);
        console.log(`${socket.id} left ${roomid}`);
    });

    socket.on("access", ({ target, roomid, value }) => {
        if (target) {
            const socketsInRoom = io.sockets.adapter.rooms.get(roomid);
            if (socketsInRoom?.has(target)) {
                console.log("Granted access to", target);
                io.to(target).emit("access-g", { value });
            } else {
                console.log("Target is not in room");
            }
        } else {
            console.log("Target not found");
        }
    });

    socket.on('disconnect', () => {
        const username = socket.username;
        if (username && userSocket.has(username)) {
            userSocket.delete(username);
            let id=socket.id;
            console.log(id,"id is");
            socket.broadcast.emit('disconnect-del',{username,id})
            console.log(`Socket ${socket.id} disconnected. User ${username} removed from map.`);
        } else {
            console.log(`Socket ${socket.id} disconnected (no username).`);
        }
    });
});

app.use('/auth/admin', authAdminRoutes);
app.use('/auth/user', authUserRoutes);
app.use('/classroom', classRoomRoutes);

app.use(express.static(path.join(_dirname, "client/dist")));


// Fallback to index.html for SPA routes (Express v5 compatible)
app.use((req, res) => {
    res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
});

// Start server
connectDB().then(() => {
    server.listen(5000, () => {
        console.log('Server running on port 5000');
    });
}).catch(err => {
    console.error("DB connection failed", err);
});
