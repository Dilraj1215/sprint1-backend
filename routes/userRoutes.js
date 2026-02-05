const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  getUserWithTasks,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// @route   GET /api/users
// @desc    Get all users
// @access  Public
router.get('/', getAllUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', getUserById);

// @route   GET /api/users/:id/tasks
// @desc    Get user with their tasks
// @access  Public
router.get('/:id/tasks', getUserWithTasks);

// @route   POST /api/users
// @desc    Create new user
// @access  Public
router.post('/', createUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Public
router.put('/:id', updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Public
router.delete('/:id', deleteUser);

module.exports = router;
