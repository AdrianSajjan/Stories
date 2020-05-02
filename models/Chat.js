const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ChatSchema = new Schema({
  messages: [
    {
      message: {
        type: Schema.Types.String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      sender: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
    }
  ],
  participants: [
    {
      user: {
        type: Schema.Types.ObjectId
      }
    }
  ]
})

module.exports = Chat = mongoose.model('chats', ChatSchema, 'Chats')
