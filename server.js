const express = require('express')
const { get } = require('http')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

const port  = process.env.PORT || 3000
let rooms = new Map()
let users = new Set()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.static('views'));

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/users', (req, res) => {
  res.send("Users: "+ Array.from(users))
})
app.get('/rooms', (req, res) => {
  reply = "<br>"
  rooms.forEach((value, key) => {
    reply+="<br>"
    reply +="<b>"+ key +" :</b> "
    reply += Array.from(value)
  });
  res.send("Rooms: "+  reply)
  //console.log(rooms)
})
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    MapUser(roomId, userId)
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId)
      users.delete(userId);
    })
  })
})

function MapUser(roomId, userId)
{
  if(!rooms.has(roomId))
  {
    let room = new Set();
    room.add(userId);
    rooms.set(roomId,room);
  }
  else
  {
    let room = rooms.get(roomId)
    room.add(userId)
  }
  users.add(userId);
}
server.listen(port)