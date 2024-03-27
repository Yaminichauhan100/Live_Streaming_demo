import {io} from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

const socket = io('', {
  transports: ['websocket'],
});

const myPeer = new Peer();

const videoPlayer = document.getElementById('videoplayer');
const soundToggle = document.getElementById('sound');
const viewerCountDisplay = document.getElementById('viewerCount');

/**
 * Socket Event Handlers
 */

socket.on('connect', () => {
  console.log('Connected as viewer');
});

myPeer.on('open', (viewerId) => {
  socket.emit('join-as-viewer', viewerId);
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

soundToggle.addEventListener('click', () => {
  videoPlayer.muted = !videoPlayer.muted;
  soundToggle.innerText = videoPlayer.muted ? 'Unmute' : 'Mute';
});

/**
 * Helper Functions
 */
const reload = window.location.reload.bind(window.location);

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
};


