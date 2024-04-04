/* eslint-disable guard-for-in */
/* eslint-disable max-len */
// /* eslint-disable max-len */

// import {Server} from 'socket.io';
// import {APP_CONFIG} from './constant/constant';
// import {app} from './app';

// if (!APP_CONFIG.user_name) {
//   throw new Error('USERNAME ENV IS NOT DEFINED');
// }

// if (!APP_CONFIG.password) {
//   throw new Error('PASSWORD ENV IS NOT DEFINED');
// }
// app.get('/', (req, res) => {
//   res.render('viewer');
// });

// const port = APP_CONFIG.port;

// // Create an server using Express's app.listen() method
// const server = app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// // Create a Socket.IO server using the server
// const socketServer = new Server(server);
// let viewerCount = 0;

// socketServer.on('connection', (socket) => {
//   console.log('a user connected');

//   socket.emit('viewer-count', viewerCount); // Send initial viewer count to connected socket

//   socket.on('join-as-streamer', (streamerId) => {
//     console.log('stremer joined');
//     socket.broadcast.emit('streamer-joined', streamerId);
//   });

//   socket.on('disconnect-as-streamer', (streamerId) => {
//     socket.broadcast.emit('streamer-disconnected', streamerId);
//   });

//   socket.on('join-as-viewer', (viewerId) => {
//     viewerCount++;
//     console.log('A viewer joined. Total viewer count:', viewerCount);
//     socket.broadcast.emit('viewer-connected', viewerId);
//     socket.emit('viewer-count', viewerCount);
//   });

//   socket.on('disconnect', () => {
//     console.log('a user disconnected');
//     viewerCount--;
//     socket.broadcast.emit('viewer-disconnected');
//     socket.emit('viewer-count', viewerCount);
//   });
//   socket.on('offer', (offer) => {
//     console.log(offer, 'ooooooooooooooooooofffffffffffffeeeeerrrr');
//     socket.broadcast.emit('offer', offer);
//   });

//   socket.on('answer', (answer: any) => {
//     socket.broadcast.emit('answer', answer);
//   });

//   socket.on('iceCandidate', (iceCandidate: any) => {
//     socket.broadcast.emit('iceCandidate', iceCandidate);
//   });
// });

// export {app, server}; // Export the Express app and HTTP server for use in other modules
// import {Server} from 'socket.io';
// import {app} from './app';
// import {APP_CONFIG} from './constant/constant';
// console.log(APP_CONFIG);
// if (!APP_CONFIG.user_name) {
//   throw new Error('USERNAME ENV IS NOT DEFINED');
// }

// if (!APP_CONFIG.password) {
//   throw new Error('PASSWORD ENV IS NOT DEFINED');
// }
// app.get('/', (req, res) => {
//   res.render('viewer');
// });

// const server = app.listen(APP_CONFIG.port, () => {
//   console.log(`Server running on port ${APP_CONFIG.port}`);
// });

// const socketServer = new Server(server);

// socketServer.on('connection', (socket) => {
//   console.log('A user connected');

//   let viewerCount = socketServer.engine.clientsCount;
//   socket.emit('viewer-count', viewerCount);

//   socket.on('join-as-streamer', (streamerId) => {
//     console.log('Streamer joined:', streamerId);
//     socket.broadcast.emit('streamer-joined', streamerId);
//   });

//   socket.on('disconnect-as-streamer', (streamerId) => {
//     socket.broadcast.emit('streamer-disconnected', streamerId);
//   });

//   socket.on('join-as-viewer', (viewerId) => {
//     viewerCount++;
//     console.log('A viewer joined. Total viewer count:', viewerCount);
//     socket.broadcast.emit('viewer-connected', viewerId);
//     socket.emit('viewer-count', viewerCount);
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//     viewerCount--;
//     socket.broadcast.emit('viewer-disconnected');
//     socket.emit('viewer-count', viewerCount);
//   });

//   socket.on('offer', (offer) => {
//     console.log('Received offer from streamer:', offer);
//     socket.broadcast.emit('offer', offer);
//   });

//   socket.on('answer', (answer) => {
//     console.log('Received answer from viewer:', answer);
//     socket.broadcast.emit('answer', answer);
//   });

//   socket.on('iceCandidate', (iceCandidate) => {
//     console.log('Received ICE candidate:', iceCandidate);
//     socket.broadcast.emit('iceCandidate', iceCandidate);
//   });
// });

// export {app, server};

import {Server} from 'socket.io';
import {app} from './app';
import {APP_CONFIG} from './constant/constant';
import * as mediasoup from 'mediasoup';
// Import mediasoup

console.log(APP_CONFIG);

if (!APP_CONFIG.user_name) {
  throw new Error('USERNAME ENV IS NOT DEFINED');
}

if (!APP_CONFIG.password) {
  throw new Error('PASSWORD ENV IS NOT DEFINED');
}

app.get('/', (req, res) => {
  res.render('viewer');
});

const server = app.listen(APP_CONFIG.port, () => {
  console.log(`Server running on port ${APP_CONFIG.port}`);
});

const socketServer = new Server(server);
let mediasoupWorker;
let mediasoupRouter:any;

(async () => {
  mediasoupWorker = await mediasoup.createWorker({
    rtcMinPort: 40000,
    rtcMaxPort: 49999,
  });

  mediasoupRouter = await mediasoupWorker.createRouter({
    mediaCodecs: [
      {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2,
      },
      {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
        parameters: {
          'x-google-start-bitrate': 1000,
        },
      },
    ],
  });

  socketServer.on('connection', (socket) => {
    console.log('A user connected');
    let viewerCount = 0;

    // let viewerCount = socketServer.engine.clientsCount;
    console.log(viewerCount,"-------------")
    socket.emit('viewer-count', viewerCount);

    socket.on('join-as-streamer', async (streamerId) => {
      console.log('Streamer joined:', streamerId);
      const webRtcTransport = await mediasoupRouter.createWebRtcTransport({
        listenIps: [{ip: '127.0.0.1', announcedIp: null}],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
      });
      // You can send webRtcTransport parameters to the client for ICE configuration

      socket.emit('webRtcTransportParameters', webRtcTransport);
      socket.broadcast.emit('streamer-joined', streamerId);
    });

    socket.on('disconnect-as-streamer', async (streamerId) => {
      // Clean up mediasoup resources if needed
      socket.broadcast.emit('streamer-disconnected', streamerId);
    });

    socket.on('join-as-viewer', (viewerId) => {
      viewerCount++;
      console.log('A viewer joined. Total viewer count:', viewerCount);
      socket.broadcast.emit('viewer-connected', viewerId);
      socket.emit('viewer-count', viewerCount);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
      viewerCount--;
      socket.broadcast.emit('viewer-disconnected');
      socket.emit('viewer-count', viewerCount);
    });

    socket.on('offer', async (offer) => {
      console.log('Received offer from streamer:', offer);
      const transport = mediasoupRouter.transports.get(offer.transportId);
      if (transport) {
        const {type, sdp} = await transport.consume({sdpOffer: offer.sdp});
        socket.emit('answer', {type, sdp});
      } else {
        console.error('Transport not found for offer.');
      }
    });

    socket.on('answer', async (answer) => {
      console.log('Received answer from viewer:', answer);
      const transport = mediasoupRouter.transports.get(answer.transportId);
      if (transport) {
        await transport.connect({dtlsParameters: answer.dtlsParameters});
      } else {
        console.error('Transport not found for answer.');
      }
    });

    socket.on('iceCandidate', async (iceCandidate) => {
      console.log('Received ICE candidate:', iceCandidate);
      const transport = mediasoupRouter.transports.get(iceCandidate.transportId);
      if (transport) {
        await transport.addIceCandidate(iceCandidate);
      } else {
        console.error('Transport not found for ICE candidate.');
      }
    });
  });

  console.log('Mediasoup server initialized');
})();

