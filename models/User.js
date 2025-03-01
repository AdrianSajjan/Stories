const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  validated: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: false
  }
})

module.exports = User = mongoose.model('user', UserSchema, 'Users')
