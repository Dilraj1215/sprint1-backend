const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  getUserWithTasks,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get('/', protect, getAllUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', protect, getUserById);

// @route   GET /api/users/:id/tasks
// @desc    Get user with their tasks
// @access  Private
router.get('/:id/tasks', protect, getUserWithTasks);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', protect, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private
router.delete('/:id', protect, deleteUser);

module.exports = router;
