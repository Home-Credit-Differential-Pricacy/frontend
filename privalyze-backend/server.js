const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require('mysql2');
const axios = require("axios");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

let privacyBudget = 5; // Privacy budget initialized

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

app.post("/retrieve-data", (req, res) => {
    const { privacyCost } = req.body;

    if (!privacyCost || privacyCost < 0) {
        return res.status(400).json({ message: "Invalid privacy cost!" });
    }

    if (privacyCost > privacyBudget) {
        return res.status(400).json({ message: "Insufficient privacy budget!" });
    }

    privacyBudget -= privacyCost;
    console.log(`Data retrieved with privacy cost: ${privacyCost}. Remaining budget: ${privacyBudget}`);

    res.status(200).json({
        message: "Data retrieved successfully!",
        remainingBudget: privacyBudget,
    });
});

app.post("/update-privacy-budget", (req, res) => {
    const { newBudget } = req.body;

    if (!newBudget || newBudget <= 0) {
        return res.status(400).json({ message: "Invalid budget value!" });
    }

    privacyBudget = newBudget;
    console.log(`Privacy budget updated to: ${privacyBudget}`);
    res.status(200).json({ message: "Privacy budget updated successfully!" });
});

// Example for using the updated privacy cost
app.post("/retrieve-loan-purposes", async (req, res) => {
    const { privacyCost } = req.body;

    if (!privacyCost || privacyCost < 0) {
        return res.status(400).json({ message: "Invalid privacy cost!" });
    }

    if (privacyCost > privacyBudget) {
        return res.status(400).json({ message: "Insufficient privacy budget!" });
    }

    try {
        const query = `
      SELECT NAME_CASH_LOAN_PURPOSE, COUNT(*) as purpose_count
      FROM previous_application.previous_application
      GROUP BY NAME_CASH_LOAN_PURPOSE;
    `;

        const response = await axios.post('http://127.0.0.1:5002/apply-dp', {
            privacyCost: privacyCost,
            query: query,
            table_name: "previous_application"
        });

        privacyBudget -= privacyCost;
        res.status(200).json({
            data: response.data,
            remainingBudget: privacyBudget,
        });
    } catch (error) {
        console.error("Error retrieving data:", error.message);
        res.status(500).json({ message: "Error retrieving data!" });
    }
});

// Add new endpoint for debt ratio analysis
app.post("/retrieve-debt-analysis", async (req, res) => {
    const { privacyCost } = req.body;
    console.log("Request received for debt analysis with privacyCost:", privacyCost);

    if (!privacyCost || privacyCost < 0) {
        return res.status(400).json({ message: "Invalid privacy level!" });
    }

    try {
        const response = await axios.post('http://127.0.0.1:5002/apply-dp-debtratio', {
            privacyCost: privacyCost,
            table_name: "application_train"
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error retrieving debt analysis:", error.message);
        res.status(500).json({ message: "Error retrieving debt analysis!" });
    }
});

// Add other routes as necessary...

app.options('*', cors({ origin: 'http://localhost:3000' })); // Preflight request handling

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
