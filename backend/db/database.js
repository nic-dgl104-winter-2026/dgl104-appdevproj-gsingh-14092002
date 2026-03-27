// Database Module
// Implements the Singleton Pattern to ensure only one
// database connection instance exists throughout the application.

const Database = require('better-sqlite3');
const path = require('path');

let instance = null;

function getDatabase() {
  if (!instance) {
    instance = new Database(path.join(__dirname, 'tms.db'));
    createTables(instance);
    console.log('Database connected!');
  }
  return instance;
}

// Creates the required tables if they do not already exist
function createTables(db) {
  // Users table — stores registered user accounts
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'developer'
    )
  `);

  // Tasks table — stores all tasks in the system
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'todo',
      priority TEXT DEFAULT 'medium',
      due_date TEXT,
      assigned_to INTEGER,
      created_by INTEGER,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

module.exports = getDatabase;