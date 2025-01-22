const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const axios = require("axios");

const app = express();
const PORT = 5001;

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' }));

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

  /*
  @to-do 
  -userın privacy budgetına göre epsilonu updatele ve süreci devam ettir
  */

  // Burada epsilon'u bir değişkene veya veri tabanına kaydedebilirsiniz
  console.log(`Privacy level updated to: ${epsilon}`);
  res.status(200).json({ message: "Privacy level updated successfully!" });
});

app.get("/api/application-test", (req, res) => {
  db.all("SELECT * FROM application_test", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Error retrieving data!" });
    }
    res.status(200).json(rows);
  });
});

app.post("/retrieve-loan-purposes", async (req, res) => {
  const { epsilon } = req.body;

  if (!epsilon || epsilon < 0.1 || epsilon > 1.0) {
    return res.status(400).json({ message: "Invalid privacy level!" });
  }

  try {
    const response = await axios.post('http://127.0.0.1:5002/apply-dp', {
      epsilon: epsilon,
      query: "SELECT NAME_CASH_LOAN_PURPOSE, COUNT(*) as purpose_count FROM previous_application.previous_application GROUP BY NAME_CASH_LOAN_PURPOSE",
      table_name: "previous_application"
    });
    res.status(200).json({ data: response.data.result });
  } catch (error) {
    console.error("Error retrieving data:", error.message);
    console.error("Error response:", error.response?.data);
    res.status(500).json({ message: "Error retrieving data!" });
  }
});

// Add new endpoint for debt ratio analysis
app.post("/retrieve-debt-analysis", async (req, res) => {
  const { epsilon } = req.body;
  console.log("Request received for debt analysis with epsilon:", epsilon);

  if (!epsilon || epsilon < 0.1 || epsilon > 1.0) {
    return res.status(400).json({ message: "Invalid privacy level!" });
  }

  try {
    const response = await axios.post('http://127.0.0.1:5002/apply-dp-debtratio', {
      epsilon: epsilon,
      table_name: "application_train"
    });
    res.status(200).json({ data: response.data });
  } catch (error) {
    console.error("Error retrieving debt analysis:", error.message);
    console.error("Error response:", error.response?.data);
    res.status(500).json({ message: "Error retrieving debt analysis!" });
  }
});

app.options('*', cors({ origin: 'http://localhost:3000' })); // Preflight request handling

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
