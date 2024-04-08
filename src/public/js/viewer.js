/* eslint-disable max-len */
// import {io} from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

// const socket = io('', {
//   transports: ['websocket'],
// });

// const myPeer = new Peer();

// const videoPlayer = document.getElementById('videoplayer');
// const soundToggle = document.getElementById('sound');
// const viewerCountDisplay = document.getElementById('viewerCount');

// /**
//  * Socket Event Handlers
//  */

// socket.on('connect', () => {
//   console.log('Connected as viewer');
// });

// myPeer.on('open', (viewerId) => {
//   socket.emit('join-as-viewer', viewerId);
// });

// myPeer.on('call', (call) => {
//   call.answer();
//   call.on('stream', (stream) => {
//     addVideoStream(videoPlayer, stream);
//   });
// });

// myPeer.on('connection', (conn) => {
//   conn.on('close', () => {
//     setTimeout(reload, 1000);
//   });
// });

// socket.on('disconnect', () => {
//   // we dont really care about emitting this to the streamer tbh
//   console.log('disconnected viewer');
// });

// socket.on('streamer-disconnected', (streamerId) => {
//   console.log(streamerId, ' Streamer has ended stream');
//   setTimeout(reload, 2000);
// });

// socket.on('streamer-joined', (streamerId) => {
//   console.log('A streamer just joined!', streamerId);
//   setTimeout(reload, 2000);
// });

// socket.on('viewer-count', (viewerCount) => {
//   viewerCountDisplay.innerHTML = viewerCount;
// });

// soundToggle.addEventListener('click', () => {
//   videoPlayer.muted = !videoPlayer.muted;
//   soundToggle.innerText = videoPlayer.muted ? 'Unmute' : 'Mute';
// });

/**
 * Helper Functions
 */
// const reload = window.location.reload.bind(window.location);

// function addVideoStream(video, stream) {
//   video.srcObject = stream;
//   video.addEventListener('loadedmetadata', () => {
//     video.play();
//   });
// };


// Viewer.js
// import {io} from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';
// // import Peer from 'peerjs';

// const socket = io('', {transports: ['websocket']});
// const myPeer = new Peer();
// const videoPlayer = document.getElementById('videoplayer');
// const soundToggle = document.getElementById('sound');
// const viewerCountDisplay = document.getElementById('viewerCount');
// let currentCall;

// socket.on('connect', () => {
//   console.log('Connected as viewer');
// });

// myPeer.on('open', (viewerId) => {
//   socket.emit('join-as-viewer', viewerId);
// });

// socket.on('offer', async (offer) => {
//   console.log('Received offer from streamer');
//   const call = myPeer.call(offer.streamerId, offer.offer);
//   call.on('stream', (remoteStream) => {
//     addVideoStream(videoPlayer, remoteStream);
//   });

//   const answer = await myPeer.answer(call.peer, offer.offer);
//   socket.emit('answer', {answer, viewerId: offer.viewerId});

//   // Handle ICE candidates
//   call.on('signal', (data) => {
//     if (data.candidate) {
//       socket.emit('iceCandidate', {candidate: data.candidate, viewerId: offer.viewerId});
//     }
//   });

//   currentCall = call;
// });

// socket.on('iceCandidate', (iceCandidate) => {
//   if (currentCall) {
//     currentCall.signal(iceCandidate.candidate);
//   }
// });

// myPeer.on('call', (call) => {
//   call.answer();
//   call.on('stream', (stream) => {
//     addVideoStream(videoPlayer, stream);
//   });
// });

// myPeer.on('connection', (conn) => {
//   conn.on('close', () => {
//     setTimeout(reload, 1000);
//   });
// });
// socket.on('disconnect', () => {
//   console.log('Disconnected viewer');
// });

// socket.on('streamer-disconnected', (streamerId) => {
//   console.log(streamerId, ' Streamer has ended stream');
//   setTimeout(reload, 2000);
// });

// socket.on('streamer-joined', (streamerId) => {
//   console.log('A streamer just joined!', streamerId);
//   setTimeout(reload, 2000);
// });
// socket.on('viewer-count', (viewerCount) => {
//   viewerCountDisplay.innerHTML = viewerCount;
// });

// soundToggle.addEventListener('click', () => {
//   videoPlayer.muted = !videoPlayer.muted;
//   soundToggle.innerText = videoPlayer.muted ? 'Unmute' : 'Mute';
// });

// /**
//  * Helper Functions
//  */
// const reload = window.location.reload.bind(window.location);

// function addVideoStream(video, stream) {
//   video.srcObject = stream;
//   video.addEventListener('loadedmetadata', () => {
//     video.play();
//   });
// };


// //////////////////////
import {io} from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';
import * as mediasoup from 'mediasoup-client';

const socket = io('', {transports: ['websocket']});
const myPeer = new Peer();
const videoPlayer = document.getElementById('videoplayer');
const soundToggle = document.getElementById('sound');
const viewerCountDisplay = document.getElementById('viewerCount');

let consumerTransport;
let consumer;

/** * * Socket Event Handlers **/
socket.on('connect', () => {
  console.log('Connected as viewer');

  // Join as a viewer
  myPeer.on('open', (viewerId) => {
    socket.emit('join-as-viewer', viewerId);
  });
});

myPeer.on('call', (call) => {
  call.answer();
  call.on('stream', (stream) => {
    addVideoStream(videoPlayer, stream);
  });
});

myPeer.on('connection', (conn) => {
  conn.on('close', () => {
    setTimeout(reload, 1000);
  });
});

socket.on('disconnect', () => {
  // we dont really care about emitting this to the streamer tbh
  console.log('disconnected viewer');
});

socket.on('streamer-disconnected', (streamerId) => {
  console.log(streamerId, ' Streamer has ended stream');
  setTimeout(reload, 2000);
});

socket.on('streamer-joined', (streamerId) => {
  console.log('A streamer just joined!', streamerId);
  setTimeout(reload, 2000);
});

socket.on('viewer-count', (viewerCount) => {
  viewerCountDisplay.innerHTML = viewerCount;
});

socket.on('consumer-transport-created', async (transportId) => {
  consumerTransport = await mediasoup.createTransport({
    id: transportId,
    sctpCapabilities: await consumerTransport.getSctpCapabilities(),
    iceServers: [
      {urls: 'stun:stun.l.google.com:19302'},
      {urls: 'turn:turn.example.com:3478', username: 'username', credential: 'credential'},
    ],
  });

  // Create media consumer
  consumer = await consumerTransport.consume({
    producerId: producer.id,
    kind: 'video',
    rtpParameters: producer.rtpParameters,
  });

  // Render the video stream
  const videoElement = document.getElementById('videoplayer');
  videoElement.srcObject = new MediaStream([consumer.track]);
  videoElement.play();
});

soundToggle.addEventListener('click', () => {
  videoPlayer.muted = !videoPlayer.muted;
  soundToggle.innerText = videoPlayer.muted ? 'Unmute' : 'Mute';
});

/** * * Helper Functions **/
const reload = window.location.reload.bind(window.location);

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
}
