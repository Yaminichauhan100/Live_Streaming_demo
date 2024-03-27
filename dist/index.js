"use strict";
// import {APP_CONFIG} from './constant/constant';
// import {httpServer} from './live-streaming/streamingApp';
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
// console.log(APP_CONFIG);
// if (!APP_CONFIG.user_name) {
//   throw new Error('USERNAME ENV IS NOT DEFINED');
// }
// if (!APP_CONFIG.password) {
//   throw new Error('PASSWORD ENV IS NOT DEFINED');
// }
// const PORT = 3000;
// httpServer.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
/* eslint-disable max-len */
// import express from 'express';
const socket_io_1 = require("socket.io");
const constant_1 = require("./constant/constant");
const app_1 = require("./app");
Object.defineProperty(exports, "app", { enumerable: true, get: function () { return app_1.app; } });
// const app = express();
if (!constant_1.APP_CONFIG.user_name) {
    throw new Error('USERNAME ENV IS NOT DEFINED');
}
if (!constant_1.APP_CONFIG.password) {
    throw new Error('PASSWORD ENV IS NOT DEFINED');
}
app_1.app.get('/', (req, res) => {
    res.render('index');
});
// app.set('trust proxy', true);
// app.use(json());
// app.use(urlencoded({extended: true}));
// app.use(cors());
// app.set('views', 'src/views');
// app.set('view engine', 'ejs');
// app.use('/public', express.static('src/public'));
// app.use(
//     cookieSession({
//       signed: false,
//       secure: false,
//     }),
// );
// app.use('/', router);
// app.get('/health', (req, res) => {
//   res.sendStatus(200);
// });
const port = process.env.PORT || 3000; // Use the specified PORT or default to 3000
// Create an server using Express's app.listen() method
const server = app_1.app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
exports.server = server;
// Create a Socket.IO server using the HTTP server
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
