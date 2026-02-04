// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { uploadDatabase } = require('./services/googleDrive');


const DB_PATH = path.join(__dirname, 'broklin.sqlite');

// Connect to DB
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to local SQLite database.');
  }
});


// Create Tables (The Flexible Schema)
db.serialize(() => {

  // 1. Users Table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT,
      google_id TEXT,
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Items Table (Movies, Games, Bookmarks, Plans)
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      type TEXT NOT NULL, 
      title TEXT NOT NULL,
      content TEXT,
      url TEXT,
      status TEXT DEFAULT 'backlog',
      metadata TEXT, 
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // Migration: Add user_id if it doesn't exist (for older DBs)
  db.all("PRAGMA table_info(items)", (err, columns) => {
    if (err) return;
    const hasUserId = columns.some(col => col.name === 'user_id');
    if (!hasUserId) {
      db.run("ALTER TABLE items ADD COLUMN user_id INTEGER");
    }
  });

  // 3. Tags Table (For filtering)
  db.run(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER,
      name TEXT,
      FOREIGN KEY(item_id) REFERENCES items(id)
    )
  `);
});

/**
 * Wrapper to trigger Cloud Sync after changes
 * We debounce this (wait 5s) so we don't spam Google Drive if you save 10 items quickly.
 */
let syncTimer;

function triggerSync() {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    uploadDatabase(DB_PATH).catch(err => console.error("Sync Failed:", err.message));
  }, 1000); // Wait 1 second (was 5s)
}

module.exports = { db, triggerSync };