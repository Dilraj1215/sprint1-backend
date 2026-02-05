const Task = require('../models/Task');

// Get all tasks
const getAllTasks = async (req, res, next) => {
  try {
    const { status, priority, user_id, category_id } = req.query;
    
    let tasks;
    
    if (status) {
      tasks = await Task.findByStatus(status);
    } else if (user_id) {
      tasks = await Task.findByUserId(user_id);
    } else if (category_id) {
      tasks = await Task.findByCategoryId(category_id);
    } else {
      tasks = await Task.findAll();
    }
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// Get task statistics
const getTaskStatistics = async (req, res, next) => {
  try {
    const stats = await Task.getStatistics();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// Get single task
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id: ${id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// Create new task
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, user_id, category_id, due_date } = req.body;
    
    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a task title'
      });
    }
    
    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: pending, in_progress, completed'
      });
    }
    
    // Validate priority
    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Priority must be one of: low, medium, high'
      });
    }
    
    const task = await Task.create({
      title,
      description,
      status: status || 'pending',
      priority: priority || 'medium',
      user_id,
      category_id,
      due_date
    });
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// Update task
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, user_id, category_id, due_date } = req.body;
    
    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a task title'
      });
    }
    
    // Check if task exists
    const existingTask = await Task.findById(id);
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id: ${id}`
      });
    }
    
    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: pending, in_progress, completed'
      });
    }
    
    // Validate priority
    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Priority must be one of: low, medium, high'
      });
    }
    
    const task = await Task.update(id, {
      title,
      description,
      status,
      priority,
      user_id,
      category_id,
      due_date
    });
    
    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// Delete task
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id: ${id}`
      });
    }
    
    await Task.delete(id);
    
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTasks,
  getTaskStatistics,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
