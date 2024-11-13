const mongoose = require("mongoose");

const tagSchema = mongoose.Schema({
  name: { type: String, required: true },
  picture: [{ type: mongoose.Schema.Types.ObjectId, ref: "Picture" }]
});

const Tag = mongoose.model("tag-collection", tagSchema);

module.exports = Tag;
