"use strict";

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  post: { type: String, required: true },
  likes: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  comments: [{ type: String }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  votedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
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
postSchema.virtual("percUpvoted").get(() => {
  return Math.round((this.likes / this.total) * 100);
});

module.exports = mongoose.model("Post", postSchema);
