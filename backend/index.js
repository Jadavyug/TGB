const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MySQL Connection Configuration
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", 
    database: "ecommerce_db" 
});

// Check Connection
db.connect((err) => {
    if (err) {
        console.log("❌ MySQL Connection Failed!");
        console.log("Error Message: " + err.message);
        console.log("Tip: Make sure MySQL is running in XAMPP or Services.");
    } else {
        console.log("✅ Connected to MySQL Database successfully!");
    }
});

// --- ROUTES ---

// SIGNUP ROUTE
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (username, email, password) VALUES (?,?,?)";
        
        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) {
                return res.json({ success: false, message: "Email already exists or Database Error" });
            }
            res.status(201).json({ success: true, message: "User Registered" });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// LOGIN ROUTE
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    
    db.query(sql, [email], async (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Database Error" });
        
        if (result.length > 0) {
            const match = await bcrypt.compare(password, result[0].password);
            if (match) {
                // Return success and the username to show in frontend
                res.json({ success: true, username: result[0].username });
            } else {
                res.json({ success: false, message: "Wrong password!" });
            }
        } else {
            res.json({ success: false, message: "User not found!" });
        }
    });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});