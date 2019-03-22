const express = require("express");

const postDb = require("../helpers/postDb");
const userDb = require("../helpers/userDb");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await postDb.get();
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error occurred while retrieving posts: ${error}` });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postDb.get(id);
    console.log(post);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post doesn't exist" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error occurred while retrieving post: ${error}` });
  }
});

router.post("/", async (req, res) => {
  const { text, userId } = req.body;
  if (!text || !userId) {
    res.status(400).json({
      message: "Bad request, submit text of new post along with the userId"
    });
  } else {
    try {
      const user = await userDb.get(userId);
      if (!user) {
        res.status(404).json({ message: "User does not exists" });
      } else {
        const { id } = await postDb.insert(req.body);
        const newPost = await postDb.get(id);
        res.status(201).json(newPost);
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: `Error occurred while creating post: ${error}` });
    }
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const postToDelete = await postDb.get(id);
    if (!postToDelete) {
      res.status(404).json({ message: "Post doesn't exist" });
    } else {
      const count = await postDb.remove(id);
      if (count) {
        res.status(200).json(postToDelete);
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error occurred while deleting post: ${error}` });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  const { text, userId } = changes;

  if (!text || !userId) {
    res.status(400).json({ message: "Needs text or userId" });
  }
  try {
    const user = await userDb.get(userId);
    if (!user) {
      res.status(404).json({ message: "User does not exist" });
    }
    const count = await postDb.update(id, changes);
    if (!count) {
      res.status(404).json({ message: "Post doesn't exist" });
    } else {
      const changedPost = await postDb.get(id);
      res.status(200).json(changedPost);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error occurred while updating post: ${error}` });
  }
});

module.exports = router;
