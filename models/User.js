const { query } = require('../config/database');

class User {
  // Get all users (never return password_hash)
  static async findAll() {
    const result = await query(
      'SELECT id, username, email, created_at FROM users ORDER BY created_at DESC'
    );
    return result.rows;
  }

  // Get user by ID (no password_hash)
  static async findById(id) {
    const result = await query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Get user by email — includes password_hash for auth checks
  static async findByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  // Get user by username — includes password_hash for auth checks
  static async findByUsername(username) {
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  }

  // Create new user with hashed password
  static async create(userData) {
    const { username, email, password_hash } = userData;
    const result = await query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, password_hash]
    );
    return result.rows[0];
  }

  // Update user (username & email only)
  static async update(id, userData) {
    const { username, email } = userData;
    const result = await query(
      'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email, created_at',
      [username, email, id]
    );
    return result.rows[0];
  }

  // Delete user
  static async delete(id) {
    const result = await query(
      'DELETE FROM users WHERE id = $1 RETURNING id, username, email, created_at',
      [id]
    );
    return result.rows[0];
  }

  // Get user with their tasks (no password_hash)
  static async findWithTasks(id) {
    const result = await query(`
      SELECT
        u.id, u.username, u.email, u.created_at,
        json_agg(
          json_build_object(
            'id', t.id,
            'title', t.title,
            'status', t.status,
            'priority', t.priority
          )
        ) FILTER (WHERE t.id IS NOT NULL) as tasks
      FROM users u
      LEFT JOIN tasks t ON u.id = t.user_id
      WHERE u.id = $1
      GROUP BY u.id, u.username, u.email, u.created_at
    `, [id]);
    return result.rows[0];
  }
}

module.exports = User;
