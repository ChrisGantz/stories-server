"use strict";

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  post: { type: String, required: true },
  likes: Number,
  total: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

// Add `createdAt` and `updatedAt` fields
postSchema.set("timestamps", true);

postSchema.set("toObject", {
  virtuals: true, //include built-in virtual id
  versionKey: false, //remove __v version key
  transform: (doc, ret) => {
    delete ret._id; // delete _id
  }
});
// adds to schema virtually
postSchema
  .virtual("percUpvoted")
  .get(() => Math.round((this.likes / this.total) * 100));

module.exports = mongoose.model("Post", postSchema);
