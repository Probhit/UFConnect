const express = require('express') //initialise express
const path = require('path')
const app = express() //initialise app
const PORT = process.env.PORT || 4000 //setup PORT number
const server = app.listen(PORT, () => console.log(`💬 server on port ${PORT}`)) // callback function to listen 

const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))

let socketsConected = new Set()

io.on('connection', onConnected)

function onConnected(socket) {
  console.log('Socket connected', socket.id)
  socketsConected.add(socket.id)
  io.emit('clients-total', socketsConected.size)

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id)
    socketsConected.delete(socket.id)
    io.emit('clients-total', socketsConected.size)
  })

  socket.on('message', (data) => {
    // console.log(data)
    socket.broadcast.emit('chat-message', data)
  })

  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data)
  })
}