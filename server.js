
const express = require('express');
const cors = require('cors');
const path = require('path');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { db, triggerSync } = require('./database');
const { downloadDatabase } = require('./services/googleDrive');

const app = express();
const PORT = 3000;

const DB_PATH = path.join(__dirname, 'broklin.sqlite');
const JWT_SECRET = 'your-secret-key-change-in-prod';


// Middleware


// Allow requests from our specific Netlify Frontend
const corsOptions = {
  origin: ['https://broklinn.netlify.app', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true, // Allow cookies/headers
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json()); // Allow JSON data

// Serve React Frontend (Static Files)
app.use(express.static(path.join(__dirname, 'client/dist')));



// --- AUTH MIDDLEWARE ---
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// --- AUTH API ENDPOINTS ---

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send("Missing fields");

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], function (err) {
    if (err) return res.status(400).json({ error: "Username already exists" });

    // Auto-login
    const token = jwt.sign({ id: this.lastID, username }, JWT_SECRET);
    res.json({ token, username });
  });
});


// LOGIN
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: "User not found" });

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
      res.json({ token, username, avatar: user.avatar_url });
    } else {
      res.status(403).json({ error: "Invalid password" });
    }
  });
});


// GOOGLE AUTH
const CLIENT_ID = "27212760084-fr6c7hpq0ckt9mls3gcah8knbv0eosqd.apps.googleusercontent.com"; // User's actual ID
const googleClient = new OAuth2Client(CLIENT_ID);

app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;

  try {
    // 1. Verify Google Token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const { name, email, picture, sub: googleId } = ticket.getPayload();

    // 2. Find or Create User
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (user) {
        // User exists -> Login
        const sessionToken = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
        res.json({ token: sessionToken, username: user.username, avatar: user.avatar_url });
      } else {
        // New User -> Register
        // Use part of email as username if name is not unique (simplified)
        const username = name || email.split('@')[0];

        db.run(
          "INSERT INTO users (username, email, google_id, avatar_url) VALUES (?, ?, ?, ?)",
          [username, email, googleId, picture],
          function (err) {
            if (err) return res.status(500).json({ error: "Registration failed" });
            const sessionToken = jwt.sign({ id: this.lastID, username }, JWT_SECRET);
            res.json({ token: sessionToken, username, avatar: picture });
          }
        );
      }
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid Google Token" });
  }
});



// --- REST API ENDPOINTS ---




// 1. GET ALL ITEMS (User Specific)
app.get('/api/items', authenticateToken, (req, res) => {
  const { type, status } = req.query;
  let query = "SELECT * FROM items WHERE user_id = ?";
  let params = [req.user.id];

  if (type) {
    query += " AND type = ?";
    params.push(type);
    if (status) {
      query += " AND status = ?";
      params.push(status);
    }
  }

  query += " ORDER BY created_at DESC";

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const results = rows.map(row => ({
      ...row,
      metadata: row.metadata ? JSON.parse(row.metadata) : {}
    }));

    res.json(results);
  });
});

// 2. ADD NEW ITEM (User Specific)
app.post('/api/items', authenticateToken, (req, res) => {
  const { type, title, content, url, metadata } = req.body;

  if (!type || !title) {
    return res.status(400).json({ error: "Type and Title are required" });
  }

  const query = `
    INSERT INTO items (user_id, type, title, content, url, metadata) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const metaString = metadata ? JSON.stringify(metadata) : '{}';

  db.run(query, [req.user.id, type, title, content, url, metaString], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    triggerSync();
    res.json({ message: "Item saved successfully", id: this.lastID });
  });
});

// 3. UPDATE STATUS (User Specific)
app.patch('/api/items/:id', authenticateToken, (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  db.run("UPDATE items SET status = ? WHERE id = ? AND user_id = ?", [status, id, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    triggerSync();
    res.json({ message: "Updated" });
  });
});

// 4. DELETE ITEM (User Specific)
app.delete('/api/items/:id', authenticateToken, (req, res) => {
  db.run("DELETE FROM items WHERE id = ? AND user_id = ?", [req.params.id, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    triggerSync();
    res.json({ message: "Deleted" });
  });
});


// 4. DELETE ITEM
app.delete('/api/items/:id', (req, res) => {
  db.run("DELETE FROM items WHERE id = ?", req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    triggerSync();
    res.json({ message: "Deleted" });
  });
});

// 5. MANUAL SYNC
app.post('/api/sync', (req, res) => {
  triggerSync();
  res.json({ message: "Sync Triggered" });
});

// 6. EXPORT TO HTML (Website Sync Feature)
app.get('/api/export', (req, res) => {
  db.all("SELECT * FROM items ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).send("Error reading DB");

    let html = `
      <!DOCTYPE html>
      <html>
      <head>

        <title>Broklin Export</title>
        <style>
          body { font-family: sans-serif; background: #0f172a; color: white; padding: 20px; }
          .item { background: #1e293b; padding: 15px; margin-bottom: 10px; border-radius: 8px; }
          a { color: #3b82f6; text-decoration: none; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Broklin Backup (${new Date().toLocaleDateString()})</h1>
        ${rows.map(row => `
          <div class="item">
            <small>${row.type}</small><br>
            <a href="${row.url || '#'}">${row.title}</a>
            <p>${row.content || ''}</p>
          </div>
        `).join('')}
      </body>
      </html>
    `;

    res.setHeader('Content-Disposition', 'attachment; filename="lifeos_backup.html"');
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  });
});

// --- SPA CATCH-ALL (Fixing wildcard crash) ---
// Using middleware to fallback instead of app.get('*') which caused issues
app.use((req, res, next) => {
  // If request isn't for API and header accepts HTML, send index.html
  if (req.method === 'GET' && req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  } else {
    next();
  }
});

// --- STARTUP SEQUENCE ---




async function startServer() {
  console.log("🚀 Starting Broklin...");

  // 1. Try to download latest DB from Drive
  try {
    await downloadDatabase(DB_PATH);
  } catch (err) {
    console.log("⚠️  Could not sync from Drive (Offline?), using local DB.");
  }

  // 2.
  // PROFILE UPDATE
  app.put('/api/auth/profile', authenticateToken, (req, res) => {
    const { display_name, avatar_url } = req.body;
    const userId = req.user.id;

    const sql = `UPDATE users SET display_name = COALESCE(?, display_name), avatar_url = COALESCE(?, avatar_url) WHERE id = ?`;

    db.run(sql, [display_name, avatar_url, userId], function (err) {
      if (err) return res.status(500).json({ error: "Failed to update profile" });
      res.json({ success: true, display_name, avatar_url });
      triggerSync().catch(console.error);
    });
  });


  // TASKS API
  app.get('/api/tasks', authenticateToken, (req, res) => {
    db.all("SELECT * FROM tasks WHERE user_id = ?", [req.user.id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  app.post('/api/tasks', authenticateToken, (req, res) => {
    const { content, status } = req.body; // status: 'todo', 'inProgress', 'done'
    db.run("INSERT INTO tasks (user_id, content, status) VALUES (?, ?, ?)", [req.user.id, content, status || 'todo'], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, content, status: status || 'todo' });
      triggerSync().catch(console.error); // 🔥 Instant Sync
    });
  });

  app.put('/api/tasks/:id', authenticateToken, (req, res) => {
    const { status } = req.body;
    db.run("UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?", [status, req.params.id, req.user.id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
      triggerSync().catch(console.error); // 🔥 Instant Sync
    });
  });

  app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
    db.run("DELETE FROM tasks WHERE id = ? AND user_id = ?", [req.params.id, req.user.id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
      triggerSync().catch(console.error); // 🔥 Instant Sync
    });
  });


  // HABIT MATRIX API
  app.get('/api/habits/logs', authenticateToken, (req, res) => {
    db.all("SELECT date, count FROM habit_logs WHERE user_id = ?", [req.user.id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  app.post('/api/habits/log', authenticateToken, (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const { count } = req.body; // allow manual setting or increment

    // Check if exists
    db.get("SELECT * FROM habit_logs WHERE user_id = ? AND date = ?", [req.user.id, today], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });

      if (row) {            // Increment
        db.run("UPDATE habit_logs SET count = count + 1 WHERE id = ?", [row.id], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ success: true, date: today, count: row.count + 1 });
          triggerSync().catch(console.error); // 🔥 Instant Sync
        });
      } else {
        // Insert
        db.run("INSERT INTO habit_logs (user_id, date, count) VALUES (?, ?, 1)", [req.user.id, today], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ success: true, date: today, count: 1 });
          triggerSync().catch(console.error); // 🔥 Instant Sync
        });
      }
    });
  });

  // Start Server
  app.listen(PORT, () => {
    console.log(`Broklin Server running on port ${PORT}`);

    // Ensure columns exist (Migration)
    db.run("ALTER TABLE users ADD COLUMN display_name TEXT", (err) => { /* Ignore duplicate column error */ });
    db.run("ALTER TABLE users ADD COLUMN avatar_url TEXT", (err) => { /* Ignore duplicate column error */ });

    // Create Tasks Table
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      content TEXT,
      status TEXT DEFAULT 'todo',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Create Habit Logs Table
    db.run(`CREATE TABLE IF NOT EXISTS habit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      date TEXT,
      count INTEGER DEFAULT 1,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
  });
}

startServer();