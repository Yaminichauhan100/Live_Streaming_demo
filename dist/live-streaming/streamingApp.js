"use strict";
// /* eslint-disable max-len */
// import {Server} from 'socket.io';
// import {app} from '../app';
// // import * as http from 'http';
// // const httpServer = new http.Server(app);
// const port = process.env.PORT || 3000;
// const httpServer = app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
// app.get('/', (req, res) => {
//   res.render('index');
// });
// const socketServer = new Server(httpServer);
// let viewerCount = 0;
// socketServer.on('connection', (socket) => {
//   console.log('a user connected');
//   // eslint-disable-next-line max-len
//   socket.emit('viewer-count', viewerCount); // Send initial viewer count to connected socket
//   socket.on('join-as-streamer', (streamerId) => {
//     socket.broadcast.emit('streamer-joined', streamerId);
//   });
//   socket.on('disconnect-as-streamer', (streamerId) => {
//     socket.broadcast.emit('streamer-disconnected', streamerId);
//   });
//   socket.on('join-as-viewer', (viewerId) => {
//     viewerCount++; // Increment viewer count only for viewers, not for streamer
//     console.log('A viewer joined. Total viewer count:', viewerCount);
//     socket.broadcast.emit('viewer-connected', viewerId);
//     // eslint-disable-next-line max-len
//     socket.emit('viewer-count', viewerCount); // Emit updated viewer count to connected socket
//   });
//   socket.on('disconnect', () => {
//     console.log('a user disconnected');
//     viewerCount--; // Decrement viewer count only for viewers, not for streamer
//     socket.broadcast.emit('viewer-disconnected');
//     // eslint-disable-next-line max-len
//     socket.emit('viewer-count', viewerCount); // Emit updated viewer count to connected socket
//   });
// });
// export {httpServer};
