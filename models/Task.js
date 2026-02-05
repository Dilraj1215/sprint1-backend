const { query } = require('../config/database');

class Task {
  // Get all tasks
  static async findAll() {
    const result = await query(`
      SELECT 
        t.*,
        u.username,
        u.email,
        c.name as category_name
      FROM tasks t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN categories c ON t.category_id = c.id
      ORDER BY t.created_at DESC
    `);
    return result.rows;
  }

  // Get task by ID
  static async findById(id) {
    const result = await query(`
      SELECT 
        t.*,
        u.username,
        u.email,
        c.name as category_name
      FROM tasks t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = $1
    `, [id]);
    return result.rows[0];
  }

  // Get tasks by user ID
  static async findByUserId(userId) {
    const result = await query(`
      SELECT 
        t.*,
        c.name as category_name
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1
      ORDER BY t.created_at DESC
    `, [userId]);
    return result.rows;
  }

  // Get tasks by category ID
  static async findByCategoryId(categoryId) {
    const result = await query(`
      SELECT 
        t.*,
        u.username,
        u.email
      FROM tasks t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.category_id = $1
      ORDER BY t.created_at DESC
    `, [categoryId]);
    return result.rows;
  }

  // Get tasks by status
  static async findByStatus(status) {
    const result = await query(`
      SELECT 
        t.*,
        u.username,
        c.name as category_name
      FROM tasks t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.status = $1
      ORDER BY t.created_at DESC
    `, [status]);
    return result.rows;
  }

  // Create new task
  static async create(taskData) {
    const { title, description, status, priority, user_id, category_id, due_date } = taskData;
    const result = await query(
      `INSERT INTO tasks (title, description, status, priority, user_id, category_id, due_date) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [title, description, status || 'pending', priority || 'medium', user_id, category_id, due_date]
    );
    return result.rows[0];
  }

  // Update task
  static async update(id, taskData) {
    const { title, description, status, priority, user_id, category_id, due_date } = taskData;
    const result = await query(
      `UPDATE tasks 
       SET title = $1, description = $2, status = $3, priority = $4, 
           user_id = $5, category_id = $6, due_date = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 
       RETURNING *`,
      [title, description, status, priority, user_id, category_id, due_date, id]
    );
    return result.rows[0];
  }

  // Delete task
  static async delete(id) {
    const result = await query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  // Get task statistics
  static async getStatistics() {
    const result = await query(`
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_tasks,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
        COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_tasks,
        COUNT(CASE WHEN priority = 'medium' THEN 1 END) as medium_priority_tasks,
        COUNT(CASE WHEN priority = 'low' THEN 1 END) as low_priority_tasks
      FROM tasks
    `);
    return result.rows[0];
  }
}

module.exports = Task;
