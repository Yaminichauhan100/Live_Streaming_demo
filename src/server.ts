/* eslint-disable max-len */

import {Server} from 'socket.io';
import {APP_CONFIG} from './constant/constant';
import {app} from './app';

if (!APP_CONFIG.user_name) {
  throw new Error('USERNAME ENV IS NOT DEFINED');
}

if (!APP_CONFIG.password) {
  throw new Error('PASSWORD ENV IS NOT DEFINED');
}
app.get('/', (req, res) => {
  res.render('viewer');
});
const port = APP_CONFIG.port;

// Create an server using Express's app.listen() method
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Create a Socket.IO server using the server
const socketServer = new Server(server);
let viewerCount = 0;

socketServer.on('connection', (socket) => {
  console.log('a user connected');

  socket.emit('viewer-count', viewerCount); // Send initial viewer count to connected socket

  socket.on('join-as-streamer', (streamerId) => {
    socket.broadcast.emit('streamer-joined', streamerId);
  });

  socket.on('disconnect-as-streamer', (streamerId) => {
    socket.broadcast.emit('streamer-disconnected', streamerId);
  });

  socket.on('join-as-viewer', (viewerId) => {
    viewerCount++;
    console.log('A viewer joined. Total viewer count:', viewerCount);
    socket.broadcast.emit('viewer-connected', viewerId);
    socket.emit('viewer-count', viewerCount);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected');
    viewerCount--;
    socket.broadcast.emit('viewer-disconnected');
    socket.emit('viewer-count', viewerCount);
  });
});

export {app, server}; // Export the Express app and HTTP server for use in other modules
