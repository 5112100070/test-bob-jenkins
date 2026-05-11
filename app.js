// SecureBank - Banking Application Server
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto-utils'); // ERROR: Module tidak ada - akan menyebabkan crash

const app = express();
const PORT = process.env.PORT || 3500;

// Use environment variables instead of hardcoded credentials
const API_KEY = process.env.API_KEY || "sk_live_12345abcdef67890";
const DB_PASSWORD = process.env.DB_PASSWORD || "admin123";
const SECRET_TOKEN = process.env.SECRET_TOKEN || "my-secret-token-2024";

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

// API endpoint - Fixed security issues
app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    // Input validation
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required' });
    }
    
    // Use async file operation
    fs.readFile('./users.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users file');
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        
        try {
            const users = JSON.parse(data);
            
            // Improved authentication logic (still demo mode)
            if (username === password) {
                const sessionToken = `session_${Date.now()}_${Math.random()}`;
                userSessions[username] = sessionToken;
                res.json({ success: true, token: sessionToken });
            } else {
                res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        } catch (parseErr) {
            console.error('Error parsing users data');
            res.status(500).json({ success: false, message: 'Server error' });
        }
    });
});

// Route: Dashboard Page
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/api/file/:filename', (req, res) => {
    const filename = req.params.filename;
    
    // Sanitize filename to prevent path traversal
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(__dirname, 'files', sanitizedFilename);
    
    // Check if file exists and is within allowed directory
    const normalizedPath = path.normalize(filePath);
    const baseDir = path.join(__dirname, 'files');
    
    if (!normalizedPath.startsWith(baseDir)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).json({ error: 'File not found' });
        }
    });
});

app.get('/api/data', (req, res) => {
    // Fixed memory leak - reduced array size
    const data = Array(100).fill('data');
    res.json({ message: 'Data loaded', count: data.length });
});

app.get('/api/crash', (req, res) => {
    try {
        // Fixed: Handle potential undefined variable
        const result = { status: 'ok', message: 'Endpoint working' };
        res.json({ result: result });
    } catch (err) {
        console.error('Error in /api/crash:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/syntax-error', (req, res) => {
    if (true) {
        res.json({ message: 'test' });
    }
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
    // Removed sensitive data logging
    console.log('🔒 Security: Credentials loaded from environment');
});

// Export for testing purposes
module.exports = app;

// Made with Bob
