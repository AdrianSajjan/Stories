const express = require('express')
const cors = require('cors')
const http = require('http')
const socketio = require('socket.io')
const connectDB = require('./config/database')
const authRouter = require('./routes/api/auth')
const userRouter = require('./routes/api/user')
const profileRouter = require('./routes/api/profile')
const postRouter = require('./routes/api/post')
const uploadRouter = require('./routes/api/upload')
const chatRouter = require('./routes/api/chat')
const socketMethods = require('./utils/socket')
require('dotenv').config()

const PORT = process.env.PORT || 5000
const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(cors())

connectDB()

app.get('/', (req, res) => {
  res.send('API is active...')
})

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/profile', profileRouter)
app.use('/api/post', postRouter)
app.use('/api/uploads', uploadRouter)
app.use('/api/chat', chatRouter)

server.listen(PORT, () => {
  console.log(`App running on PORT ${PORT}...`)
})

const io = socketio(server)

io.on('connection', (socket) => {
  console.log('An User connected')
  socket.on('login', async (id) => {
    await socketMethods.connectUser(id, socket.id)
  })

  socket.on('disconnect', async () => {
    await socketMethods.disconnectUser(socket.id)
  })
})
