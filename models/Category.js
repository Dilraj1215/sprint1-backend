const { query } = require('../config/database');

class Category {
  // Get all categories
  static async findAll() {
    const result = await query('SELECT * FROM categories ORDER BY name');
    return result.rows;
  }

  // Get category by ID
  static async findById(id) {
    const result = await query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0];
  }

  // Create new category
  static async create(categoryData) {
    const { name, description } = categoryData;
    const result = await query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    return result.rows[0];
  }

  // Update category
  static async update(id, categoryData) {
    const { name, description } = categoryData;
    const result = await query(
      'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    return result.rows[0];
  }

  // Delete category
  static async delete(id) {
    const result = await query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  // Get category with tasks count
  static async findWithTasksCount(id) {
    const result = await query(`
      SELECT 
        c.*,
        COUNT(t.id) as tasks_count
      FROM categories c
      LEFT JOIN tasks t ON c.id = t.category_id
      WHERE c.id = $1
      GROUP BY c.id
    `, [id]);
    return result.rows[0];
  }

  // Get all categories with task counts
  static async findAllWithTasksCounts() {
    const result = await query(`
      SELECT 
        c.*,
        COUNT(t.id) as tasks_count
      FROM categories c
      LEFT JOIN tasks t ON c.id = t.category_id
      GROUP BY c.id
      ORDER BY c.name
    `);
    return result.rows;
  }
}

module.exports = Category;
