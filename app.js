// SecureBank - Banking Application Server
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.static('public'));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route: Home/Login Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Route: Login Page (explicit)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Route: Dashboard Page
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
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
});

// Export for testing purposes
module.exports = app;

// Made with Bob
