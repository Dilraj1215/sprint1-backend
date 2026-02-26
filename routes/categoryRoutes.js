const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getAllCategoriesWithCounts,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/categories
// @desc    Get all categories
// @access  Private
router.get('/', protect, getAllCategories);

// @route   GET /api/categories/counts
// @desc    Get all categories with task counts
// @access  Private
router.get('/counts', protect, getAllCategoriesWithCounts);

// @route   GET /api/categories/:id
// @desc    Get category by ID
// @access  Private
router.get('/:id', protect, getCategoryById);

// @route   POST /api/categories
// @desc    Create new category
// @access  Private
router.post('/', protect, createCategory);

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private
router.put('/:id', protect, updateCategory);

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Private
router.delete('/:id', protect, deleteCategory);

module.exports = router;
