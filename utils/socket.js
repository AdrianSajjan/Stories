const User = require('./../models/User')

let onlineUsers = []

const connectUser = async (userId, socketID) => {
  onlineUsers.push({ user: userId, socket: socketID })
  const user = await User.findById(userId)
  user.active = true
  await user.save()
  console.log('User added')
  console.log(onlineUsers)
}

const disconnectUser = async (socketID) => {
  const userIndex = onlineUsers.findIndex((user) => user.socket === socketID)
  if (userIndex !== -1) {
    const userID = onlineUsers[userIndex].user
    onlineUsers.splice(userIndex, 1)
    const user = await User.findById(userID)
    user.active = false
    await user.save()
    console.log('User removed')
    console.log(onlineUsers)
  }
}

const isOnline = (userID) => {
  const user = onlineUsers.find((user) => user.user === userID)
  return user ? true : false
}

module.exports = { connectUser, disconnectUser }
