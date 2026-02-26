require('dotenv').config();
const bcrypt = require('bcrypt');
const { pool } = require('../config/database');

const initDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');

    // Drop existing tables (be careful in production!)
    await pool.query(`
      DROP TABLE IF EXISTS tasks CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    console.log('✅ Dropped existing tables');

    // Create users table
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created users table');

    // Create categories table
    await pool.query(`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created categories table');

    // Create tasks table
    await pool.query(`
      CREATE TABLE tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
        priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created tasks table');

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX idx_tasks_user_id ON tasks(user_id);
      CREATE INDEX idx_tasks_category_id ON tasks(category_id);
      CREATE INDEX idx_tasks_status ON tasks(status);
      CREATE INDEX idx_tasks_priority ON tasks(priority);
    `);
    console.log('✅ Created indexes');

    // Insert sample data
    console.log('🔄 Inserting sample data...');

    // Insert sample users with hashed passwords
    const saltRounds = 10;
    const hash1 = await bcrypt.hash('Password123!', saltRounds);
    const hash2 = await bcrypt.hash('Password123!', saltRounds);
    const hash3 = await bcrypt.hash('Password123!', saltRounds);

    await pool.query(
      `INSERT INTO users (username, email, password_hash) VALUES
      ($1, $2, $3),
      ($4, $5, $6),
      ($7, $8, $9)`,
      [
        'john_doe',   'john@example.com',  hash1,
        'jane_smith', 'jane@example.com',  hash2,
        'bob_wilson', 'bob@example.com',   hash3
      ]
    );
    console.log('✅ Inserted sample users (passwords hashed with bcrypt)');

    // Insert sample categories
    await pool.query(`
      INSERT INTO categories (name, description) VALUES
      ('Work', 'Work-related tasks'),
      ('Personal', 'Personal tasks and errands'),
      ('Study', 'Educational and learning tasks'),
      ('Health', 'Health and fitness related tasks'),
      ('Shopping', 'Shopping and purchasing tasks');
    `);
    console.log('✅ Inserted sample categories');

    // Insert sample tasks
    await pool.query(`
      INSERT INTO tasks (title, description, status, priority, user_id, category_id, due_date) VALUES
      ('Complete project proposal', 'Write and submit the Q1 project proposal', 'in_progress', 'high', 1, 1, '2026-02-10'),
      ('Team meeting', 'Weekly team sync-up meeting', 'pending', 'medium', 1, 1, '2026-02-08'),
      ('Grocery shopping', 'Buy groceries for the week', 'pending', 'medium', 2, 5, '2026-02-06'),
      ('Gym workout', 'Evening cardio session', 'completed', 'low', 2, 4, '2026-02-05'),
      ('Study Node.js', 'Complete Node.js tutorial on Express', 'in_progress', 'high', 3, 3, '2026-02-12'),
      ('Code review', 'Review pull requests from team members', 'pending', 'high', 1, 1, '2026-02-07'),
      ('Doctor appointment', 'Annual health checkup', 'pending', 'high', 2, 4, '2026-02-15'),
      ('Read documentation', 'Read PostgreSQL documentation', 'completed', 'medium', 3, 3, '2026-02-04'),
      ('Buy birthday gift', 'Get a gift for Sarah birthday', 'pending', 'medium', 1, 5, '2026-02-20'),
      ('Database backup', 'Backup production database', 'completed', 'high', 1, 1, '2026-02-03');
    `);
    console.log('✅ Inserted sample tasks');

    console.log('🎉 Database initialization completed successfully!');
    console.log('📊 Summary:');
    console.log('   - 3 users created');
    console.log('   - 5 categories created');
    console.log('   - 10 tasks created');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
};

initDatabase();
