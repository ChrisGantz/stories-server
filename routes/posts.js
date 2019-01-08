"use strict";

const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const router = express.Router();

const Post = require("../models/post");

// Protects endpoints possibly dont need to protect this one
router.use(
  "/",
  passport.authenticate("jwt", { session: false, failWithError: true })
);

router.get("/", (req, res, next) => {
  const userId = req.user.id;
  Post.find({ userId })
    .sort({ updatedAt: "desc" })
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get("/all", (req, res, next) => {
  Post.find()
    .sort({ updatedAt: "desc" })
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.post("/", (req, res, next) => {
  const { post } = req.body;
  const userId = req.user.id;
  // console.log(req.user);
  if (!post) {
    const err = new Error("Missing Post in request body");
    err.status = 400;
    return next(err);
  }
  const newPost = { post, userId };

  Post.create(newPost)
    .then(results =>
      res
        .location(`${req.originalUrl}/${results.id}`)
        .status(201)
        .json(results)
    )
    .catch(err => next(err));
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  const userId = req.user.id;

  Post.findByIdAndRemove({_id: id, userId})
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});
/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put("/likes/:id", (req, res, next) => {
  const id = req.params.id;
  const userId = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("The `id` is not valid");
    err.status = 400;
    return next(err);
  }

  const updateItem = {
    $inc: { likes: 1, total: 1 }
    // $push: { votedUser: userId }
  };

  Post.findByIdAndUpdate(id, updateItem, { new: true, upsert: true })
    .then(results => {
      if (results) {
        res.status(201).json(results);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});
// dislike

router.put("/dislikes/:id", (req, res, next) => {
  const id = req.params.id;
  const userId = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("The `id` is not valid");
    err.status = 400;
    return next(err);
  }

  const updateItem = { $inc: { likes: -1, total: 1 } };

  Post.findByIdAndUpdate(id, updateItem, { new: true, upsert: true })
    .then(results => {
      if (results) {
        res.status(201).json(results);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});
// COMMENTS
router.get("/all/:id", (req, res, next) => {
  const id = req.params.id;
  // const userId = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("The `id` is not valid");
    err.status = 400;
    return next(err);
  }
  Post.findById(id)
    .then(results => {
      if (results) {
        res.json(results);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

router.put("/comments/:id", (req, res, next) => {
  const id = req.params.id;
  // const userId = req.user.id;
  const { comments } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("The `id` is not valid");
    err.status = 400;
    return next(err);
  }
  // console.log(req.body);
  const updateItem = { $push: { comments: comments } };
  Post.findByIdAndUpdate(id, updateItem, { new: true })
    .then(results => {
      if (results) {
        res.status(201).json(results);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
