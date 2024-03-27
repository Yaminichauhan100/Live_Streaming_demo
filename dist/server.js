"use strict";
/* eslint-disable max-len */
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const socket_io_1 = require("socket.io");
const constant_1 = require("./constant/constant");
const app_1 = require("./app");
Object.defineProperty(exports, "app", { enumerable: true, get: function () { return app_1.app; } });
if (!constant_1.APP_CONFIG.user_name) {
    throw new Error('USERNAME ENV IS NOT DEFINED');
}
if (!constant_1.APP_CONFIG.password) {
    throw new Error('PASSWORD ENV IS NOT DEFINED');
}
app_1.app.get('/', (req, res) => {
    res.render('viewer');
});
const port = constant_1.APP_CONFIG.port;
// Create an server using Express's app.listen() method
const server = app_1.app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
exports.server = server;
// Create a Socket.IO server using the server
const socketServer = new socket_io_1.Server(server);
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
