const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  content: {
    type: String,
    required: true,
  },
  likes: [
    {
      liked_user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      date: Date,
    },
  ],
  comments: [
    {
      commented_user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      comment: String,
      date: Date,
    },
  ],
});

module.exports = Post = mongoose.model("post", PostSchema, "Posts");
