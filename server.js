const express = require('express')
const { get } = require('http')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

const port = process.env.PORT || 3000
let rooms = new Map()
let users = new Set()
let names = new Map()
let passwords = new Map()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.static('views'));

app.get('/', (req, res) => {
  //res.redirect(`/${uuidV4()}`)
  res.redirect(`/home`)
})
app.get('/name/', (req, res) => {
  //console.log(names.get(req.query.uid));
  //res.send(names.get(req.query.uid))
  res.json({ name: names.get(req.query.uid) })
})
app.get('/home', (req, res) => {
  res.render('home')
})
app.get('/users', (req, res) => {
  res.send("Users: " + Array.from(users))
})
app.get('/rooms', (req, res) => {
  reply = "<br>"
  rooms.forEach((value, key) => {
    reply += "<br>"
    reply += "<b>" + key + " :</b> "
    reply += Array.from(value)
  });
  res.send("Rooms: " + reply)
  //console.log(rooms)
})

app.get('/:room', (req, res) => {
  //&&req.query.pass == "0000"
  if (!passwords.has(req.params.room)) {
    passwords.set(req.params.room, req.query.pass)
    //console.log("init room")
  }
  console.log(passwords.get(req.params.room))
  if (!rooms.has(req.params.room) || (rooms.get(req.params.room).size <= 5 && (passwords.get(req.params.room) == undefined || req.query.pass == passwords.get(req.params.room))))
    res.render('room', { roomId: req.params.room, nameId: req.query.username, passId: req.query.pass, camId:  req.query.cam})
  else
    res.send("Access Denied")
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId, name) => {
    names.set(userId, name)

    MapUser(roomId, userId)
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId)
      RemoveUser(roomId, userId);
    })
  })
})

function MapUser(roomId, userId) {
  if (!names.has(userId))
    names.set(userId, "Name");
  if (!rooms.has(roomId)) {
    let room = new Set();
    room.add(userId);
    rooms.set(roomId, room);
  }
  else {
    let room = rooms.get(roomId)
    room.add(userId)
  }
  users.add(userId);
}
function RemoveUser(roomId, userId) {
  rooms.get(roomId).delete(userId);
  if (rooms.get(roomId).size == 0) {
    rooms.delete(roomId);
  }
  users.delete(userId);
}
server.listen(port)