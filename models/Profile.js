const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    src: String,
    name: String,
  },
  dob: {
    type: Date,
    required: true,
  },
  locality: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  bio: {
    type: String,
  },
  following: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      profile: {
        type: Schema.Types.ObjectId,
        ref: "profile",
      },
      date: Date,
    },
  ],
  followers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      profile: {
        type: Schema.Types.ObjectId,
        ref: "profile",
      },
      date: Date,
    },
  ],
  notifications: [
    {
      msg: String,
      date: Date,
    },
  ],
  blacklist: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      date: Date,
    },
  ],
});

module.exports = Profile = mongoose.model("profile", ProfileSchema, "Profiles");
