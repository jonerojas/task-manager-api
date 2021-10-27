const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');

//Fetching all tasks
//task?completed=true
//task?sortBy=createdAt_desc or asc
router.get('/tasks', auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split('_');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  const pageLimit = req.query.limit;
  const pageSkip = req.query.skip;

  try {
    // const getAllTasks = await Task.find({ owner: req.user._id });
    //await req.user.populate('tasks')

    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: pageLimit,
        skip: pageSkip,
        sort
      }
    });

    //My method. Using the find method and using the req.user object to find the task owner
    // const tasks = await Task.find({ owner: req.user._id, completed: false });

    res.status(200).send(req.user.tasks);
    // res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }

  // Task.find({})
  //   .then((tasks) => {
  //     res.send(tasks);
  //   })
  //   .catch((error) => {
  //     res.status(500).send(error);
  //   });
});

//Fetching a specific task based on id
router.get('/tasks/:task_id', auth, async (req, res) => {
  const taskId = req.params.task_id;
  try {
    const task = await Task.findOne({ taskId, owner: req.user._id });

    if (!task) {
      return res.status(404).send('No task found');
    }
    res.status(200).send(task);
  } catch (error) {
    console.log(error);
    res.status(500).send('No task found. Please try again');
  }
  // const taskId = req.params.task_id;
  // Task.findById(taskId)
  //   .then((task) => {
  //     if (!task) {
  //       return res.status(404).send('No task found.');
  //     }
  //     res.send(task);
  //   })
  //   .catch((error) => {
  //     res.status(500).send(error);
  //   });
});

//Create a task
router.post('/tasks', auth, async (req, res) => {
  const { description, completed } = req.body;
  const task = new Task({
    description,
    completed,
    owner: req.user._id
  });
  // const newTask = new Task({
  //   description,
  //   completed
  // });

  try {
    console.log(task);
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
  // const { description, completed } = req.body;
  // const task = new Task({
  //   description,
  //   completed
  // });

  // task
  //   .save()
  //   .then((result) => {
  //     console.log(result);
  //     res.status(201).send(result);
  //   })
  //   .catch((error) => {
  //     res.status(400).send(error);
  //   });
});

//Updating a task using the id
router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdateFields = ['description', 'completed'];
  const isValidOperation = updates.every((task) =>
    allowedUpdateFields.includes(task)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update fields.' });
  }

  try {
    const taskId = req.params.id;

    const updatedTasks = await Task.findOne({
      _id: taskId,
      owner: req.user._id
    });

    if (!updatedTasks) {
      return res.status(404).send('No task found. Please try again');
    }

    //Were basically fetching the doc, then updating the fields like any object, then saving the new object to the db
    updates.forEach((task) => (updatedTasks[task] = req.body[task]));

    await updatedTasks.save();

    console.log(updatedTasks);
    res.status(200).send(updatedTasks);
  } catch (error) {
    console.log('There was an error updating your task.');
    res.status(400).send(error);
  }
});

//Deleting a task based on an ID
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const taskId = req.params.id;
    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      owner: req.user._id
    });

    if (!deletedTask) {
      res.status(404).send('Task to be deleted not found');
    }
    console.log('Task deleted');
    res.send(deletedTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
