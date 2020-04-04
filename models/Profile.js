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
  dob: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
  },
  bio: {
    type: String,
  },
});

module.exports = Profile = mongoose.model("profile", ProfileSchema, "Profiles");
