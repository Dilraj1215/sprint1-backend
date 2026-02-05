const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTaskStatistics,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

// @route   GET /api/tasks/stats
// @desc    Get task statistics
// @access  Public
router.get('/stats', getTaskStatistics);

// @route   GET /api/tasks
// @desc    Get all tasks (with optional query filters)
// @access  Public
router.get('/', getAllTasks);

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Public
router.get('/:id', getTaskById);

// @route   POST /api/tasks
// @desc    Create new task
// @access  Public
router.post('/', createTask);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Public
router.put('/:id', updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Public
router.delete('/:id', deleteTask);

module.exports = router;
