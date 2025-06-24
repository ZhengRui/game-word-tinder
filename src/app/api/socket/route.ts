import { NextRequest } from 'next/server';
import { Server as IOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: IOServer;

export async function GET(req: NextRequest) {
  if (!io) {
    const httpServer = new HttpServer();
    io = new IOServer(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('register-player', (data) => {
        console.log('Player registered:', data);
        socket.join(data.team);
        io.emit('player-registered', data);
      });

      socket.on('claim-word', (data) => {
        console.log('Word claimed:', data);
        io.emit('word-claimed', data);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });

    httpServer.listen(3001);
  }

  return new Response('Socket.IO server initialized');
}