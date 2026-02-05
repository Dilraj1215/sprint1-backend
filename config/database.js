const { Pool } = require('pg');

// Parse the connection string manually to avoid SSL issues
const connectionConfig = {
  user: 'sprint1user',
  password: '8qXspf6SbDgtu2Buz22wHMtnU48sUcvy',
  host: 'dpg-d62bp74r85hc73digqj0-a.oregon-postgres.render.com',
  port: 5432,
  database: 'sprint1db',
  ssl: {
    rejectUnauthorized: false
  }
};

// Create a connection pool
const pool = new Pool(connectionConfig);

// Test the database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Query helper function
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Get a client from the pool
const getClient = async () => {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;
  
  // Set a timeout of 5 seconds
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
  }, 5000);
  
  // Monkey patch the query method to keep track of the last query executed
  client.query = (...args) => {
    client.lastQuery = args;
    return query.apply(client, args);
  };
  
  client.release = () => {
    clearTimeout(timeout);
    client.query = query;
    client.release = release;
    return release.apply(client);
  };
  
  return client;
};

module.exports = {
  pool,
  query,
  getClient
};
