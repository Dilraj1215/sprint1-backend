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
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/tasks/stats
// @desc    Get task statistics
// @access  Private
router.get('/stats', protect, getTaskStatistics);

// @route   GET /api/tasks
// @desc    Get all tasks (with optional query filters)
// @access  Private
router.get('/', protect, getAllTasks);

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Private
router.get('/:id', protect, getTaskById);

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post('/', protect, createTask);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', protect, updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', protect, deleteTask);

module.exports = router;
