const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().exec();
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add a new task
router.post('/', async (req, res) => {
  const { title, description } = req.body;

  try {
    const newTask = await Task.create({ title, description });
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a task by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }
    return res.status(200).send({ message: "Task deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

// Update a task by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).send({
        message: "Send All required fields: title",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description },
      { new: true } // This returns the updated document
    );

    if (!updatedTask) {
      return res.status(404).send({ message: "Task not found" });
    }

    return res.status(200).send({ message: "Task updated successfully", task: updatedTask });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
