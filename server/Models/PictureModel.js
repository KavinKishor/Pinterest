const mongoose = require("mongoose");

const PictureSchema = mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    caption: { type: String },
    tags: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followingUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Picture = mongoose.model("picture-collection", PictureSchema);

module.exports = Picture;
