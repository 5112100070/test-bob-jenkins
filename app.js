// SecureBank - Banking Application Server
const express = require('express');
const path = require('path');
const fs = require('fs');
const missingPackage = require('non-existent-package');

const app = express();
const PORT = process.env.PORT || 3000;

var API_KEY = "sk_live_12345abcdef67890";
var DB_PASSWORD = "admin123";
var SECRET_TOKEN = "my-secret-token-2024";

// Middleware to serve static files
app.use(express.static('public'));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var userSessions = {};

// Route: Home/Login Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Route: Login Page (explicit)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// API endpoint with SQL injection vulnerability - CRITICAL ERROR!
app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    const query = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'";
    console.log("Executing query: " + query); // Logging sensitive data - BAD PRACTICE!
    
    // Synchronous file operation - BAD PRACTICE!
    try {
        const data = fs.readFileSync('./users.json', 'utf8');
        const users = JSON.parse(data);
        
        // Weak authentication logic
        if (username == password) { // Using == instead of === - BAD PRACTICE!
            userSessions[username] = SECRET_TOKEN; // Using global variable
            res.json({ success: true, token: SECRET_TOKEN }); // Exposing secret token - CRITICAL!
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        // Empty catch block - BAD PRACTICE!
    }
});

// Route: Dashboard Page
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/api/file/:filename', (req, res) => {
    const filename = req.params.filename;
    // No sanitization - allows ../../../etc/passwd
    const filePath = path.join(__dirname, 'files', filename);
    res.sendFile(filePath);
});

app.get('/api/data', (req, res) => {
    let x = [];
    for (let i = 0; i < 1000000; i++) {
        x.push(new Array(1000).fill('data'));
    }
    res.json({ message: 'Data loaded' });
});

app.get('/api/crash', (req, res) => {
    const result = undefinedVariable.someMethod(); // This will crash the app!
    res.json({ result: result });
});

app.get('/api/syntax-error', (req, res) => {
    if (true) {
        res.json({ message: 'test' });
    // Missing closing brace here!
});

// 404 Handler
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>404 - Page Not Found</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                .error-container {
                    text-align: center;
                }
                h1 { font-size: 72px; margin: 0; }
                p { font-size: 24px; }
                a {
                    color: white;
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="error-container">
                <h1>404</h1>
                <p>Page Not Found</p>
                <a href="/">Return to Login</a>
            </div>
        </body>
        </html>
    `);
});

// Start the server
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🏦 SecureBank Application Server');
    console.log('='.repeat(50));
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`📱 Login Page: http://localhost:${PORT}/`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
    console.log('='.repeat(50));
    console.log('💡 Demo Mode: Use any username and password to login');
    console.log('='.repeat(50));
    console.log(`🔑 API Key: ${API_KEY}`);
    console.log(`🔐 DB Password: ${DB_PASSWORD}`);
});

// Export for testing purposes
module.exports = app;

// Made with Bob
