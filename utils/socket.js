const User = require('./../models/User')

const onlineUsers = []

const connectUser = async (userID, socketID) => {
  try {
    onlineUsers.push({ user: userID, socket: socketID })
    const user = await User.findById(userID)
    user.active = true
    await user.save()
    console.log(`User with ID ${userID} added.`)
  } catch (err) {
    console.log(err.message)
  }
}

const disconnectUser = async (socketID) => {
  try {
    const userIndex = onlineUsers.findIndex((user) => user.socket === socketID)
    if (userIndex === -1) return

    const userID = onlineUsers[userIndex].user
    onlineUsers.splice(userIndex, 1)
    const user = await User.findById(userID)
    user.active = false
    await user.save()
    console.log(`User with ID ${userID} removed.`)
  } catch (err) {
    console.log(err.message)
  }
}

const isOnline = (userID) => {
  const user = onlineUsers.find((user) => user.user === userID)
  return user ? true : false
}

module.exports = { connectUser, disconnectUser, isOnline }
