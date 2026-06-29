const express = require("express");
const router = express.Router();
const Task = require("../models/Task.js");

// GET All Tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD Task
router.post("/", async (req, res) => {
  console.log("POST BODY:", req.body);
  try {
    const newTask = new Task({
      title: req.body.title,
      completed: true,
    });

    const savedTask = await newTask.save();
    console.log("Saved Task:", savedTask);

    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE Task
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
      },
      {
        new: true,
      }
    );

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE Task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "Task Deleted Successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;