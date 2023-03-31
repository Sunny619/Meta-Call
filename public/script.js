const socket = io('/')
const videoGrid = document.getElementById('video-grid')
let templates = document.querySelector('#template')
const chatMessages = document.getElementById('messages')
const inputText = document.getElementById('inputText')
const videoButton = document.getElementById('cam-button')
const muteButton = document.getElementById('mute-button')
const endButton = document.getElementById('end-button')
var chat = document.getElementById("message-container"); 
document.getElementById("inputName").value = NAME
//Class Declarations
class User{
  constructor(id, name,video){
    this.id = id
    this.name = name
    this.video = video
  }
  updateName(name)
  {
    this.name = name
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
let camswitch = 0
if(camswitch == 1)
{
function getConnectedDevices(type, callback) {
  navigator.mediaDevices.enumerateDevices()
      .then(devices => {
          const filtered = devices.filter(device => device.kind === type);
          callback(filtered);
      });
}

getConnectedDevices('videoinput', cameras => navigator.mediaDevices.getUserMedia({
  video: {
    deviceId: {
      exact: cameras[1].deviceId,
    }},
  audio: true
}).then(stream => {
  //socket.emit('selfName', NAME)
  myStream = stream;
  addVideoStream(myVideo, stream,myPeer.id)

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
}))
}
else
{
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {
    //socket.emit('selfName', NAME)
    myStream = stream;
    addVideoStream(myVideo, stream,myPeer.id)
  
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
}

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
  split()
})
socket.on('name-update', (userId,name) => { 
  console.log("Username:",name,"UserId:",userId)
  updateNameArgs(name,userId)
})
socket.on('pass-update', (pass) => { 
  console.log(pass)
  document.getElementById("inputPass").value=pass
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

function addVideoStream(video, stream, userId) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  blitNewUserVideo(video,userId);
  split();
  //videoGrid.append(video)
}

function blitNewUserVideo(video,userId) {
  count++;
  let card = templates.content.cloneNode(true).querySelector('#call-card');
  card.id = userId
  //console.log(card);
  let videoHolder = card.children[0].children[0];
  videoHolder.append(video);
  videoGrid.appendChild(card);
  if(userId == myPeer.id)
    updateName();
  fetch("/name?uid="+ userId)
    .then((response) => response.json())
    .then((json) => updateNameArgs(json.name,userId));
    //
}

function split() {
divider = 1;
 if (count > 4) {
  divider = 3
  }
  else if (count > 1) {
    divider = 2
  }
  else if (count == 1) {
    divider = 1
  }
  videoGrid.className = "grid"+divider.toString();
  resizeCards();
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
      addVideoStream(video, userVideoStream, call.peer)
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
    window.location.href='/home'
});
chat.addEventListener('DOMNodeInserted',()=>{
  chat.scrollTop = chat.scrollHeight;
})
function updateName()
{
  var name = document.getElementById("inputName").value;
  updateNameArgs(name,myPeer.id)
  socket.emit('name', name)
}
function updateNameArgs(name,pid)
{
  if(name==undefined)
    name = "Name"
  console.log(name)
  var cardName = document.getElementById(pid).children[0].children[1].children[0];
  cardName.innerHTML = name
}
function updatePass()
{
  var pass = document.getElementById("inputPass").value;
  socket.emit('pass', pass)
}
function fetchPass()
{
  //var pass = document.getElementById("inputPass").value;
  console.log("Fetch")
  socket.emit('getPass')
}