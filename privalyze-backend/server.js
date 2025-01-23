const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require('mysql2');
const axios = require("axios");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Routes
// Update signup route for MySQL
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const query = 'INSERT INTO userdata (fullname, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, password], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: "User already exists!" });
      }
      return res.status(500).json({ message: "Error registering user!" });
    }
    res.status(201).json({ message: "User registered successfully!" });
  });
});

// Update signin route for MySQL
app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Both fields are required!" });
  }

  const query = 'SELECT * FROM userdata WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error querying database!" });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }
    res.status(200).json({ message: `Welcome back, ${results[0].fullname}!` });
  });
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

app.get("/api/application-test", (req, res) => {
  db.all("SELECT * FROM application_test", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Error retrieving data!" });
    }
    res.status(200).json(rows);
  });
});

app.post("/retrieve-loan-purposes-smartnoise", async (req, res) => {
  const { epsilon } = req.body;

  if (!epsilon || epsilon < 0.1 || epsilon > 1.0) {
    return res.status(400).json({ message: "Invalid privacy level!" });
  }

  try {
    const query = `
      SELECT NAME_CASH_LOAN_PURPOSE, COUNT(*) as purpose_count
      FROM previous_application.previous_application
      GROUP BY NAME_CASH_LOAN_PURPOSE;
    `;

    const response = await axios.post('http://127.0.0.1:5002/apply-dp', {
      epsilon: epsilon,
      query: query,
      table_name: "previous_application"
    });
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error retrieving data:", error.message);
    res.status(500).json({ message: "Error retrieving data!" });
  }
});

app.post("/retrieve-loan-purposes", async (req, res) => {
  const { epsilon } = req.body;

  if (!epsilon || epsilon < 0.1 || epsilon > 1.0) {
    return res.status(400).json({ message: "Invalid privacy level!" });
  }

  try {
    const query = `
      SELECT NAME_CASH_LOAN_PURPOSE, COUNT(*) as purpose_count
      FROM previous_application.previous_application
      GROUP BY NAME_CASH_LOAN_PURPOSE;
    `;

    const response = await axios.post('http://127.0.0.1:5002/apply-dp', {
      epsilon: epsilon,
      query: query,
      table_name: "previous_application"
    });
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error retrieving data:", error.message);
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
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error retrieving debt analysis:", error.message);
    console.error("Error response:", error.response?.data);
    res.status(500).json({ message: "Error retrieving debt analysis!" });
  }
});

app.post("/retrieve-credit-history", async (req, res) => {
  const { epsilon } = req.body;

  try {
    const response = await axios.post('http://127.0.0.1:5002/credit-history', {
      epsilon: epsilon,
      table_name: "bureau"
    });
    
    // Structure the response properly
    res.status(200).json({
      data: response.data,
      success: true
    });
  } catch (error) {
    console.error("Error retrieving credit history:", error.message);
    console.error("Error response:", error.response?.data);
    res.status(500).json({ 
      message: "Error retrieving credit history!",
      error: error.message,
      success: false 
    });
  }
});

app.post("/retrieve-credit-balance", async (req, res) => {
  const { epsilon } = req.body;

  try {
    const response = await axios.post('http://127.0.0.1:5002/credit-balance-analysis', {
      epsilon: epsilon
    });
    
    res.status(200).json({
      data: response.data,
      success: true
    });
  } catch (error) {
    console.error("Error retrieving credit balance analysis:", error.message);
    console.error("Error response:", error.response?.data);
    res.status(500).json({ 
      message: "Error retrieving credit balance analysis!",
      error: error.message,
      success: false 
    });
  }
});

app.options('*', cors({ origin: 'http://localhost:3000' })); // Preflight request handling

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
