const socket = io('/')
const videoGrid = document.getElementById('video-grid')
let templates = document.querySelector('#template')
let viewportHeight = window.innerHeight;
let viewportWidth = window.innerWidth
let count = 1;
const myPeer = new Peer({host:'peerjs-server.herokuapp.com', secure:true, port:443})
const myVideo = document.createElement('video')
let flag = 0;
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      console.log("Peercall called");
      flag^=1;
      if(flag)
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
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    console.log("New user stream called");
    flag^=1;
    if(flag)
      addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    //video.remove()
    video.parentElement.parentElement.parentElement.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    
    video.play()
  })
  blitNewUserVideo(video);
  //videoGrid.append(video)
}

function blitNewUserVideo(video)
{
  count++;
  let card = templates.content.cloneNode(true).querySelector('#call-card');
  console.log(card);
  let videoHolder = card.children[0].children[0];
  videoHolder.append(video);
  videoGrid.appendChild(card);
}
// window.addEventListener('resize', resize());

// function resize()
// {
//   const videos = document.getElementsByTagName("video");
//   if(videos.length>)
//   else if(videos.length>4)
//   {

//   }
//   else if(videos.length>2)
//   {

//   }
//   else if(videos.length==2)


// }