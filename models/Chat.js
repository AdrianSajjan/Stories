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
        user: { type: Schema.Types.ObjectId, ref: 'user' },
        profile: { type: Schema.Types.ObjectId, ref: 'profile' }
      }
    }
  ],
  participants: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
      profile: {
        type: Schema.Types.ObjectId,
        ref: 'profile'
      }
    }
  ]
})

module.exports = Chat = mongoose.model('chats', ChatSchema, 'Chats')
