const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
// const { ExpressPeerServer } = require('peer');


const applisten = server.listen(process.env.PORT || 3000)
// const peerServer = ExpressPeerServer(applisten, {
//   path: '/'
// });
// app.use('/peerjs', peerServer);


app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:index', (req, res) => {
  res.render('index', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected', userId)
    
  
    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId)
    })
  })
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
  socket.on("chat" , function(chatObj){
    socket.broadcast.emit("chatLeft" , chatObj);
})
socket.on("editor" , function(editObj){
  socket.broadcast.emit("code" , editObj);
})
})

