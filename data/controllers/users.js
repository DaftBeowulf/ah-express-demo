const express = require("express");

const userDb = require("../helpers/userDb");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await userDb.get();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error occurred while retrieving users: ${error}` });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userDb.get(id);
    user
      ? res.status(200).json(user)
      : res.status(404).json({ message: "User doesn't exist" });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error occurred while retrieving user: ${error}` });
  }
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ message: "Bad request, submit name of new user" });
  } else {
    try {
      const { id } = await userDb.insert(req.body);
      const newUser = await userDb.get(id);
      console.log(newUser);
      res.status(201).json(newUser);
    } catch (error) {
      res
        .status(500)
        .json({ error: `Error occurred while creating user: ${error}` });
    }
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const userToDelete = await userDb.get(id);
    if (!userToDelete) {
      res.status(404).json({ message: "User doesn't exist" });
    }
    const count = await userDb.remove(id);

    if (count) {
      res.status(200).json(userToDelete);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error occurred while deleting user: ${error}` });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  if (!changes.name) {
    res.status(400).json({ message: "Need a name, bro" });
  }
  try {
    const count = await userDb.update(id, changes);
    if (!count) {
      res.status(404).json({ message: "User doesn't exist" });
    } else {
      const changedUser = await userDb.get(id);
      res.status(200).json(changedUser);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error occurred while updating user: ${error}` });
  }
});

module.exports = router;
