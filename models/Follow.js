const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FollowSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: "profile",
  },
  following: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
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

module.exports = Follow = mongoose.model("follow", FollowSchema, "Follow");
