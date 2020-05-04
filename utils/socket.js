const User = require('./../models/User')

let onlineUsers = []

const connectUser = async (userID, socketID) => {
  onlineUsers.push({ user: userID, socket: socketID })
  const user = await User.findById(userID)
  user.active = true
  await user.save()
  console.log(`User with ID ${userID} added.`)
}

const disconnectUser = async (socketID) => {
  const userIndex = onlineUsers.findIndex((user) => user.socket === socketID)
  if (userIndex !== -1) {
    const userID = onlineUsers[userIndex].user
    onlineUsers.splice(userIndex, 1)
    const user = await User.findById(userID)
    user.active = false
    await user.save()
    console.log(`User with ID ${userID} removed.`)
  }
}

const isOnline = (userID) => {
  const user = onlineUsers.find((user) => user.user === userID)
  return user ? true : false
}

module.exports = { connectUser, disconnectUser, isOnline }
