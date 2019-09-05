const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e.message);
  }
  //   task
  //     .save()
  //     .then(() => res.status(201).send(task))
  //     .catch(
  //       console.log(error => {
  //         // res.status(400);
  //         // res.send(error.message);
  //         res.status(400).send(error.message);
  //       })
  //     );
});

// Get tasks with completed=true
// Get tasks with sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res) => {
  try {
    // const result = await Task.find({ owner: req.user._id });
    // return res.send(result);
    const match = {};
    const sort = {};
    if (req.query.completed) {
      match.completed = req.query.completed === "true";
    }
    if (req.query.sortBy) {
      const splitData = req.query.sortBy.split(":");
      console.log(splitData);
      sort[splitData[0]] = splitData[1] === "desc" ? -1 : 1;
    }
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      })
      .execPopulate();
    // await req.user.populate("tasks").execPopulate();
    return res.send(req.user.tasks);
  } catch (e) {
    res.status(400).send(e.message);
  }
  //   Task.find()
  //     .then(result => res.send(result))
  //     .catch(error => res.status(400).send(error.message));
});

router.get("/tasks/:desc", auth, async (req, res) => {
  try {
    const result = await Task.find({
      description: req.params.desc,
      owner: req.user._id
    });
    if (result && result.length !== 0) return res.send(result);
    return res.status(404).send("Task doesn't Exist");
  } catch (e) {
    res.status(400).send(e.message);
  }
  //   Task.find({ description: req.params.desc })
  //     .then(result => {
  //       if (result && result.length !== 0) return res.send(result);
  //       return res.status(404).send("Task doesn't Exist");
  //     })
  //     .catch(error => res.status(400).send(error.message));
});

router.patch("/tasks/:desc", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isvalidOperation = updates.every(item => allowedUpdates.includes(item));
  if (isvalidOperation) {
    try {
      const task = await Task.findOne({
        description: req.params.desc,
        owner: req.user._id
      });

      // const task = await Task.findOneAndUpdate(
      //   { description: req.params.desc },
      //   req.body,
      //   { new: true, useValidators: true }
      // );
      if (task) {
        updates.forEach(update => (task[update] = req.body[update]));
        task.save();
        return res.send(task);
      }
      return res.status(400).send("Unable to find task");
    } catch (e) {
      res.status(500).send(e.message);
    }
  } else res.status(400).send("Invalid Updates");
});

router.delete("/tasks/:desc", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      description: req.params.desc,
      owner: req.user._id
    });
    if (!task) return res.status(400).send("Task doesn't Exist");
    return res.send(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
