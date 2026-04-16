const Task = require('../models/Task');

// Get all tasks for the logged-in user
const getAllTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, category_id } = req.query;

    let tasks;

    if (status) {
      tasks = await Task.findByUserAndStatus(userId, status);
    } else if (category_id) {
      tasks = await Task.findByUserAndCategory(userId, parseInt(category_id));
    } else {
      tasks = await Task.findByUserId(userId);
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

// Get task statistics for the logged-in user
const getTaskStatistics = async (req, res, next) => {
  try {
    const stats = await Task.getStatisticsByUser(req.user.id);
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// Get single task (must belong to the logged-in user)
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task || task.user_id !== req.user.id) {
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

// Create new task — always belongs to the logged-in user
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, category_id, due_date } = req.body;
    const user_id = req.user.id;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a task title'
      });
    }

    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: pending, in_progress, completed'
      });
    }

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
      category_id: category_id || null,
      due_date: due_date || null
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

// Update task — must belong to the logged-in user
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, category_id, due_date } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a task title'
      });
    }

    const existingTask = await Task.findById(id);
    if (!existingTask || existingTask.user_id !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id: ${id}`
      });
    }

    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: pending, in_progress, completed'
      });
    }

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
      user_id: existingTask.user_id,
      category_id: category_id || null,
      due_date: due_date || null
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

// Delete task — must belong to the logged-in user
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task || task.user_id !== req.user.id) {
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
