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

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', getAllCategories);

// @route   GET /api/categories/counts
// @desc    Get all categories with task counts
// @access  Public
router.get('/counts', getAllCategoriesWithCounts);

// @route   GET /api/categories/:id
// @desc    Get category by ID
// @access  Public
router.get('/:id', getCategoryById);

// @route   POST /api/categories
// @desc    Create new category
// @access  Public
router.post('/', createCategory);

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Public
router.put('/:id', updateCategory);

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Public
router.delete('/:id', deleteCategory);

module.exports = router;
