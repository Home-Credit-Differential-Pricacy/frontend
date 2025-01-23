const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const axios = require("axios");

const app = express();
const PORT = 5001;
const DEFAULT_PRIVACY_BUDGET = 5; // Varsayılan privacy budget

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));

// SQLite Bağlantısı
const db = new sqlite3.Database("./database.sqlite", (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
        db.run(
            `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT, 
        email TEXT UNIQUE, 
        password TEXT, 
        privacy_budget INTEGER DEFAULT ${DEFAULT_PRIVACY_BUDGET}
      )`,
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
        "INSERT INTO users (name, email, password, privacy_budget) VALUES (?, ?, ?, ?)",
        [name, email, password, DEFAULT_PRIVACY_BUDGET],
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
            res.status(200).json({ message: `Welcome back, ${row.name}!`, privacyBudget: row.privacy_budget });
        }
    );
});

// Privacy Budget Endpoints
app.get("/get-privacy-budget", (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: "Email is required!" });
    }

    db.get(
        "SELECT privacy_budget FROM users WHERE email = ?",
        [email],
        (err, row) => {
            if (err) {
                return res.status(500).json({ message: "Error retrieving privacy budget!" });
            }
            if (!row) {
                return res.status(404).json({ message: "User not found!" });
            }
            res.status(200).json({ privacyBudget: row.privacy_budget });
        }
    );
});

app.post("/reduce-privacy-budget", (req, res) => {
    const { email, amount } = req.body;

    if (!email || !amount) {
        return res.status(400).json({ message: "Email and amount are required!" });
    }

    db.get(
        "SELECT privacy_budget FROM users WHERE email = ?",
        [email],
        (err, row) => {
            if (err) {
                return res.status(500).json({ message: "Error querying database!" });
            }
            if (!row) {
                return res.status(404).json({ message: "User not found!" });
            }

            const newBudget = row.privacy_budget - amount;

            if (newBudget < 0) {
                return res.status(400).json({ message: "Not enough privacy budget!" });
            }

            db.run(
                "UPDATE users SET privacy_budget = ? WHERE email = ?",
                [newBudget, email],
                (err) => {
                    if (err) {
                        return res.status(500).json({ message: "Error updating privacy budget!" });
                    }
                    res.status(200).json({ newPrivacyBudget: newBudget });
                }
            );
        }
    );
});

// Loan Purposes with Privacy Budget
app.post("/retrieve-loan-purposes", async (req, res) => {
    const { email } = req.body;

    db.get(
        "SELECT privacy_budget FROM users WHERE email = ?",
        [email],
        async (err, row) => {
            if (err) {
                return res.status(500).json({ message: "Error querying database!" });
            }
            if (!row || row.privacy_budget <= 0) {
                return res.status(400).json({ message: "Not enough privacy budget!" });
            }

            const query = `
        SELECT NAME_CASH_LOAN_PURPOSE, COUNT(*) as purpose_count
        FROM previous_application.previous_application
        GROUP BY NAME_CASH_LOAN_PURPOSE;
      `;

            try {
                const response = await axios.post("http://127.0.0.1:5002/apply-dp", {
                    epsilon: row.privacy_budget,
                    query: query,
                    table_name: "previous_application",
                });

                // Privacy Budget Azaltma
                const newBudget = row.privacy_budget - 1;
                db.run("UPDATE users SET privacy_budget = ? WHERE email = ?", [newBudget, email]);

                res.status(200).json({ data: response.data, newPrivacyBudget: newBudget });
            } catch (error) {
                console.error("Error retrieving data:", error.message);
                res.status(500).json({ message: "Error retrieving data!" });
            }
        }
    );
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
