// We import the better-sqlite3 library
const Database = require('better-sqlite3');
const path = require('path');

// SINGLETON PATTERN
// This means we only ever create ONE database connection
// Think of it like one door to the database — everyone uses the same door
let instance = null;

function getDatabase() {
  if (!instance) {
    instance = new Database(path.join(__dirname, 'tms.db'));
    createTables(instance);
    console.log('Database connected!');
  }
  return instance;
}

// This creates our tables (like Excel sheets) inside the database
function createTables(db) {
  // Users table — stores everyone who registers
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'developer'
    )
  `);

  // Tasks table — stores all tasks
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