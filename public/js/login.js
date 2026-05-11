// Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    // Check if user is already logged in
    if (sessionStorage.getItem('username')) {
        window.location.href = '/dashboard';
    }
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // Dummy validation - accept any non-empty credentials
        if (username && password) {
            // Store username in sessionStorage
            sessionStorage.setItem('username', username);
            
            // Show success message (optional)
            console.log('Login successful for user:', username);
            
            // Redirect to dashboard
            window.location.href = '/dashboard';
        } else {
            alert('Please enter both username and password');
        }
    });
    
    // Add enter key support
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
});

// Made with Bob
