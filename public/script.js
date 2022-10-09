const socket = io('/')
const videoGrid = document.getElementById('video-grid')
let templates = document.querySelector('#template')
const chatMessages = document.getElementById('messages')
const inputText = document.getElementById('inputText')
var viewportHeight = window.innerHeight;
let viewportWidth = window.innerWidth;
var count = 0
var divider = 1
window.addEventListener('resize', resizeCards);
const myPeer = new Peer({ host: 'peerjs-server.herokuapp.com', secure: true, port: 443 })
const myVideo = document.createElement('video')
let flag = 0;
myVideo.muted = true
const peers = {}
connections = []
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('connection', conn => {
    handleConnection(conn)
  });
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      console.log("Peercall called");
      flag ^= 1;
      if (flag)
        addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  count--;
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  conn = myPeer.connect(userId);
  handleConnection(conn)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    //console.log("New user stream called");
    flag ^= 1;
    if (flag)
      addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    //video.remove()
    video.parentElement.parentElement.parentElement.remove()
  })
  //peerIds.push(userId);
  peers[userId] = call
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
function sendMsg() {
  const msg = myPeer.id + ": " + inputText.value
  for (let i = 0; i < connections.length; i++) 
  {
    connections[i].send(msg);
  }
  addMessageInChat(msg);

}

function addMessageInChat(data) {
  chatMessages.innerHTML += "<br>" + data
}