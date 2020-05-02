const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'profile'
  },
  content: {
    type: String,
    required: true
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
      profile: {
        type: Schema.Types.ObjectId,
        ref: 'profile'
      },
      date: Date
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
      profile: {
        type: Schema.Types.ObjectId,
        ref: 'profile'
      },
      comment: String,
      date: Date
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = Post = mongoose.model('post', PostSchema, 'Posts')
