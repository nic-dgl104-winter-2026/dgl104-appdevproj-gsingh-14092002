// TASK ROUTES
// This file handles everything related to tasks
// Create, Read, Update, Delete (CRUD)

const express = require('express');
const router = express.Router();
const getDatabase = require('../db/database');
const taskObserver = require('../patterns/observer');
const { TaskSorter, priorityStrategy, dueDateStrategy, statusStrategy } = require('../patterns/strategy');

// MIDDLEWARE — checks if user is logged in
// This runs before any task route
// It checks the token (ID card) sent from the frontend
function authenticate(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Please login first' });
  }
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token, please login again' });
  }
}

// GET ALL TASKS — GET /api/tasks
// Returns all tasks, sorted by strategy chosen
router.get('/', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    const sortBy = req.query.sortBy || 'priority';

    // Get all tasks from database
    let tasks = db.prepare('SELECT * FROM tasks').all();

    // STRATEGY PATTERN — sort tasks based on query parameter
    const sorter = new TaskSorter(priorityStrategy);

    if (sortBy === 'duedate') {
      sorter.setStrategy(dueDateStrategy);
    } else if (sortBy === 'status') {
      sorter.setStrategy(statusStrategy);
    } else {
      sorter.setStrategy(priorityStrategy);
    }

    tasks = sorter.sort(tasks);

    res.json(tasks);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not get tasks' });
  }
});

// GET ONE TASK — GET /api/tasks/:id
router.get('/:id', authenticate, (req, res) => {
  try {
    const db = getDatabase();
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not get task' });
  }
});

// CREATE TASK — POST /api/tasks
router.post('/', authenticate, (req, res) => {
  try {
    const { title, description, status, priority, due_date, assigned_to } = req.body;

    // Title is required
    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const db = getDatabase();

    const result = db.prepare(`
      INSERT INTO tasks (title, description, status, priority, due_date, assigned_to, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      title,
      description || '',
      status || 'todo',
      priority || 'medium',
      due_date || null,
      assigned_to || null,
      req.user.id
    );

    // OBSERVER PATTERN — notify subscribers that a task was created
    taskObserver.notify({
      title,
      status: status || 'todo',
      action: 'created',
    });

    res.status(201).json({
      message: 'Task created successfully!',
      taskId: result.lastInsertRowid,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not create task' });
  }
});

// UPDATE TASK — PUT /api/tasks/:id
router.put('/:id', authenticate, (req, res) => {
  try {
    const { title, description, status, priority, due_date, assigned_to } = req.body;
    const db = getDatabase();

    // Check task exists
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update the task
    db.prepare(`
      UPDATE tasks
      SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, assigned_to = ?
      WHERE id = ?
    `).run(
      title || task.title,
      description || task.description,
      status || task.status,
      priority || task.priority,
      due_date || task.due_date,
      assigned_to || task.assigned_to,
      req.params.id
    );

    // OBSERVER PATTERN — notify subscribers that a task was updated
    taskObserver.notify({
      title: title || task.title,
      status: status || task.status,
      action: 'updated',
    });

    res.json({ message: 'Task updated successfully!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not update task' });
  }
});

// DELETE TASK — DELETE /api/tasks/:id
router.delete('/:id', authenticate, (req, res) => {
  try {
    const db = getDatabase();

    // Check task exists
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);

    // OBSERVER PATTERN — notify subscribers that a task was deleted
    taskObserver.notify({
      title: task.title,
      status: task.status,
      action: 'deleted',
    });

    res.json({ message: 'Task deleted successfully!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not delete task' });
  }
});

module.exports = router;