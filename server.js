const express = require('express')
const cors = require('cors')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const cookieParser = require('cookie-parser')

const connectDB = require('./config/database')
const authRouter = require('./routes/api/auth')
const userRouter = require('./routes/api/user')
const profileRouter = require('./routes/api/profile')
const postRouter = require('./routes/api/post')
const uploadRouter = require('./routes/api/upload')
const chatRouter = require('./routes/api/chat')
const activityRouter = require('./routes/api/activity')
const socketMethods = require('./utils/socket')

require('dotenv').config()

const PORT = process.env.PORT || 5000
const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(cookieParser())
app.use(cors())

connectDB()

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/profile', profileRouter)
app.use('/api/post', postRouter)
app.use('/api/uploads', uploadRouter)
app.use('/api/chat', chatRouter)
app.use('/api/activity', activityRouter)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

server.listen(PORT, () => {
  console.log(`App running on PORT ${PORT}...`)
})

const io = socketio(server)

io.on('connection', (socket) => {
  socket.on('login', async (id) => {
    await socketMethods.connectUser(id, socket.id)
    socket.join(id)
  })

  socket.on('send-message', (payload, id) => {
    const isOnline = socketMethods.isOnline(id)
    if (isOnline) io.to(id).emit('receive-message', payload)
  })

  socket.on('new-notification', (payload, id) => {
    const isOnline = socketMethods.isOnline(id)
    if (isOnline) io.to(id).emit('receive-notification', payload)
  })

  socket.on('disconnect', async () => {
    await socketMethods.disconnectUser(socket.id)
  })
})
