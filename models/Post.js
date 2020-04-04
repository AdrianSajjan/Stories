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
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      comment_user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      comment: String,
      date: Date,
    },
  ],
});

module.exports = Post = mongoose.model("post", PostSchema, "Posts");
