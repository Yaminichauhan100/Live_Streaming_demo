/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
// import {io} from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

// const socket = io('', {
//   transports: ['websocket'],
// });
// const peerClient = new Peer();

// const videoRecorder = document.getElementById('videoRecording');
// videoRecorder.muted = false;

// navigator.mediaDevices.getUserMedia({
//   video: true,
//   audio: true,
// }).then((stream) => {
//   addVideoStream(videoRecorder, stream);

//   socket.on('viewer-connected', (viewerId) => {
//     connectToNewViewer(viewerId, stream);
//   });
// });

// peerClient.on('open', (streamerId) => {
//   socket.emit('join-as-streamer', streamerId);
// });

// peerClient.on('close', (streamerId) => {
//   socket.emit('disconnect-as-streamer', streamerId);
// });

// socket.on('disconnect', () => {
//   socket.emit('disconnect-as-streamer', streamerId);
// });

// function addVideoStream(video, stream) {
//   video.srcObject = stream;
//   video.addEventListener('loadedmetadata', () => {
//     video.play();
//   });
// }

// function connectToNewViewer(viewerId, stream) {
//   peerClient.call(viewerId, stream);
// };
/* eslint-disable max-len */
/* eslint-disable max-len */
// Streamer.js

// import {io} from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';
// // import Peer from 'peerjs';

// const socket = io('', {transports: ['websocket']});
// const peerClient = new Peer();
// let currentCall;

// navigator.mediaDevices.getUserMedia({
//   video: true,
//   audio: true,
// }).then((stream) => {
//   addVideoStream(document.getElementById('videoRecording'), stream);

//   peerClient.on('call', (call) => {
//     call.answer(stream);
//     call.on('stream', (remoteStream) => {
//       addVideoStream(document.getElementById('remoteVideo'), remoteStream);
//     });

//     // Handle ICE candidates
//     call.on('signal', (data) => {
//       socket.emit('iceCandidate', {candidate: data.candidate, viewerId: call.peer});
//     });
//   });

//   socket.on('viewer-connected', (viewerId) => {
//     currentCall = peerClient.call(viewerId, stream);
//   });

//   socket.on('iceCandidate', (iceCandidate) => {
//     if (currentCall) {
//       currentCall.signal(iceCandidate.candidate);
//     }
//   });
// });

// peerClient.on('open', (streamerId) => {
//   socket.emit('join-as-streamer', streamerId);
// });

// peerClient.on('close', (streamerId) => {
//   socket.emit('disconnect-as-streamer', streamerId);
// });

// function addVideoStream(videoElement, stream) {
//   videoElement.srcObject = stream;
//   videoElement.addEventListener('loadedmetadata', () => {
//     videoElement.play();
//   });
// }


// ////////////////
// import {io} from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';
// import * as mediasoup from 'mediasoup-client';

// const socket = io('', {transports: ['websocket']});
// const peerClient = new Peer();
// const videoRecorder = document.getElementById('videoRecording');
// videoRecorder.muted = false;

// let producerTransport;
// let producer;

// navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => {
//   addVideoStream(videoRecorder, stream);

//   // Join as a streamer
//   socket.emit('join-as-streamer', peerClient.id);

//   // Handle producer transport creation
//   socket.on('producer-transport-created', async (transportId) => {
//     producerTransport = await mediasoup.createTransport({
//       id: transportId,
//       sctpCapabilities: await producerTransport.getSctpCapabilities(),
//       iceServers: [
//         {urls: 'stun:stun.l.google.com:19302'},
//         {urls: 'turn:turn.example.com:3478', username: 'username', credential: 'credential'},
//       ],
//     });

//     // Create media producer
//     producer = await producerTransport.produce({
//       kind: 'video',
//       rtpParameters: {
//         codecs: [
//           {mimeType: 'video/VP8', clockRate: 90000, parameters: {'x-google-start-bitrate': 1000}},
//         ],
//         encodings: [
//           {maxBitrate: 1000000},
//         ],
//       },
//     });
//   });
// });

// peerClient.on('open', () => {
//   // No change here
// });

// peerClient.on('close', (streamerId) => {
//   // Disconnect as a streamer
//   socket.emit('disconnect-as-streamer', streamerId);
// });

// socket.on('disconnect', () => {
//   // Disconnect as a streamer
//   socket.emit('disconnect-as-streamer', peerClient.id);
// });

// function addVideoStream(video, stream) {
//   video.srcObject = stream;
//   video.addEventListener('loadedmetadata', () => {
//     video.play();
//   });
// }

// import io from 'socket.io-client';
import {io} from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';
import * as mediasoupClient from '../../node_modules/mediasoup-client';

const socket = io('', {transports: ['websocket']});
const peerClient = new Peer();
const videoRecorder = document.getElementById('videoRecording');
videoRecorder.muted = false;

let producerTransport;
let producer;

navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => {
  addVideoStream(videoRecorder, stream);

  // Join as a streamer
  socket.emit('join-as-streamer', peerClient.id);

  // Handle producer transport creation
  socket.on('producer-transport-created', async (transportId) => {try {
    
    producerTransport = await mediasoupClient.createTransport({
      id: transportId,
      sctpCapabilities: await producerTransport.getSctpCapabilities(),
      iceServers: [
        {urls: 'stun:stun.l.google.com:19302'},
        {urls: 'turn:turn.example.com:3478', username: 'username', credential: 'credential'},
      ],
    });

    // Create media producer
    producer = await producerTransport.produce({
      track: stream.getTracks().find((track) => track.kind === 'video'),
      encodings: [
        {maxBitrate: 1000000},
      ],
    });
  
  } catch (e) {
    console.error(e);
  }});
});

peerClient.on('open', () => {
  // No change here
});

peerClient.on('close', (streamerId) => {
  // Disconnect as a streamer
  socket.emit('disconnect-as-streamer', streamerId);
});

socket.on('disconnect', () => {
  // Disconnect as a streamer
  socket.emit('disconnect-as-streamer', peerClient.id);
});

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
}
