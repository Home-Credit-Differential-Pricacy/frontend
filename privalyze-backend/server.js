const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// SQLite Bağlantısı
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
    db.run(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT)",
      (err) => {
        if (err) {
          console.error("Error creating users table:", err.message);
        }
      }
    );
  }
});

// Routes
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    (err) => {
      if (err) {
        if (err.code === "SQLITE_CONSTRAINT") {
          return res.status(400).json({ message: "User already exists!" });
        }
        return res.status(500).json({ message: "Error inserting user!" });
      }
      res.status(201).json({ message: "User registered successfully!" });
    }
  );
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Both fields are required!" });
  }

  db.get(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, row) => {
      if (err) {
        return res.status(500).json({ message: "Error querying database!" });
      }
      if (!row) {
        return res.status(401).json({ message: "Invalid email or password!" });
      }
      res.status(200).json({ message: `Welcome back, ${row.name}!` });
    }
  );
});
app.post("/set-privacy-level", (req, res) => {
  const { epsilon } = req.body;

  if (!epsilon || epsilon < 0.1 || epsilon > 1.0) {
    return res.status(400).json({ message: "Invalid privacy level!" });
  }

  // Burada epsilon'u bir değişkene veya veri tabanına kaydedebilirsiniz
  console.log(`Privacy level updated to: ${epsilon}`);
  res.status(200).json({ message: "Privacy level updated successfully!" });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
