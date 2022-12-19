const socket = io('/')
const videoGrid = document.getElementById('video-grid')
let templates = document.querySelector('#template')
const chatMessages = document.getElementById('messages')
const inputText = document.getElementById('inputText')
const videoButton = document.getElementById('cam-button')
const muteButton = document.getElementById('mute-button')
const endButton = document.getElementById('end-button')

//Class Declarations
class User{
  constructor(id, name, video){
    this.id = id
    this.name = name
    this.video = video
  }
}
const users = new Map();
var viewportHeight = window.innerHeight;
let viewportWidth = window.innerWidth;
var count = 0
var divider = 1
window.addEventListener('resize', resizeCards);
//const myPeer = new Peer({ host: 'peerjs-server.herokuapp.com', secure: true, port: 443 })
const myPeer = new Peer()
let myStream;
const myVideo = document.createElement('video')
let flag = 0;
myVideo.muted = true
const peers = {}
connections = []
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myStream = stream;
  addVideoStream(myVideo, stream)

  myPeer.on('connection', conn => {
    handleConnection(conn)
  });

  myPeer.on('call', call => {
    call.answer(stream)
    handleCall(call);
    console.log("Oncall");
  });

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
    console.log("User connected");
  })
})


socket.on('user-disconnected', userId => {
  count--;
  console.log("user left",userId)
  if (peers[userId])
  {
    console.log("user left called",userId)
    users.get(userId).video.parentElement.parentElement.parentElement.remove()
    users.delete(userId)
    peers[userId].close()
    
  } 
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  console.log("Call made");
  const call = myPeer.call(userId, stream)
  conn = myPeer.connect(userId);
  handleConnection(conn)
  handleCall(call)
  //peerIds.push(userId);
  
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  blitNewUserVideo(video);
  split();
  //videoGrid.append(video)
}

function blitNewUserVideo(video) {
  count++;
  let card = templates.content.cloneNode(true).querySelector('#call-card');
  //console.log(card);
  let videoHolder = card.children[0].children[0];
  videoHolder.append(video);
  videoGrid.appendChild(card);
}

function split() {
  divider = 1;
  if (count > 9) {
    divider = 4
    videoGrid.className = "grid4";
  }
  else if (count > 4) {
    divider = 3
    videoGrid.className = "grid3";
  }
  else if (count > 1) {
    divider = 2
    videoGrid.className = "grid2";
  }
  else if (count == 1) {
    divider = 1
    videoGrid.className = "grid1";
  }
  resizeCards()
}

function resizeCards() {
  viewportHeight = window.innerHeight;
  let listofcards = document.getElementsByTagName('video')
  for (let i = 0; i < listofcards.length; i++) {
    listofcards[i].style.height = (viewportHeight / divider) - 2 + "px";
  }
}
function handleConnection(conn) {
  conn.on('open', function () {
    // Receive messages
    conn.on('data', function (data) {
      addMessageInChat(data)
    });
  });
  connections.push(conn)
}
function handleCall(call) {
  console.log("Handle Call Function Called");
  const video = document.createElement('video')
  users.set(call.peer,new User(call.peer,"Name",video))
  peers[call.peer] = call
  call.on('stream', userVideoStream => {
    console.log("Peercall called");
    flag ^= 1;
    if (flag)
      addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    //video.remove()
    //console.log(userId,": left the call")
    video.parentElement.parentElement.parentElement.remove()
  })
}
function sendMsg() {
  const msg = myPeer.id + ": " + inputText.value
  for (let i = 0; i < connections.length; i++) {
    connections[i].send(msg);
  }
  addMessageInChat(msg);
  //Fixes multiple connection issue
}

function addMessageInChat(data) {
  chatMessages.innerHTML += "<br>" + data
}

videoButton.addEventListener('click', () => {
  const videoTrack = myStream.getTracks().find(track => track.kind === 'video');
  if (videoTrack.enabled) {
    videoTrack.enabled = false;
    videoButton.className = "float-button disabled-button"
  } else {
    videoTrack.enabled = true;
    videoButton.className = "float-button enabled-button"
  }
});
muteButton.addEventListener('click', () => {
  const audioTrack = myStream.getTracks().find(track => track.kind === 'audio');
  if (audioTrack.enabled) {
    audioTrack.enabled = false;
    muteButton.className = "float-button disabled-button"
  } else {
    audioTrack.enabled = true;
    muteButton.className = "float-button enabled-button"
  }
});
endButton.addEventListener('click', () => {
    endButton.className = "float-button disabled-button"
});