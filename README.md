# 🏦 SecureBank - Banking Application Frontend

A dummy banking application frontend built with Express.js, featuring a professional login page and interactive dashboard.

## 📋 Features

### Login Page
- Professional banking theme with gradient background
- Responsive design for all devices
- Username and password input fields
- Dummy authentication (accepts any credentials)
- Clean and modern UI

### Dashboard
- **Account Overview**: Display total balance across all accounts
- **Multiple Accounts**: Savings and checking account cards
- **Recent Transactions**: List of recent banking activities with debit/credit indicators
- **Quick Actions**: 6 banking action buttons (Transfer, Pay Bills, Mobile Recharge, etc.)
- **User Profile**: Display logged-in username
- **Logout Functionality**: Secure session management

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   
   Or directly:
   ```bash
   node app.js
   ```

3. **Access the Application**
   - Open your browser and navigate to: `http://localhost:3000`
   - The server runs on port 3000 by default

## 🎯 Usage

### Login
1. Navigate to `http://localhost:3000`
2. Enter any username and password (this is a demo application)
3. Click "Sign In"
4. You'll be redirected to the dashboard

### Dashboard
- View your account balances
- Check recent transactions
- Access quick action buttons
- Logout when done

## 📁 Project Structure

```
test-bob-jenkins/
├── app.js                  # Express.js server
├── package.json            # Project dependencies
├── public/                 # Static files
│   ├── css/
│   │   └── style.css      # Banking theme styles
│   └── js/
│       └── login.js       # Login functionality
└── views/                  # HTML pages
    ├── login.html         # Login page
    └── dashboard.html     # Dashboard page
```

## 🎨 Design Features

### Color Scheme
- Primary: Blue (#1565C0)
- Secondary: Dark Blue (#0D47A1)
- Accent: Light Blue (#42A5F5)
- Success: Green (#4CAF50)
- Danger: Red (#F44336)

### UI Components
- Gradient backgrounds
- Card-based layout
- Smooth animations
- Hover effects
- Responsive grid system
- Professional typography

## 🔒 Security Note

**⚠️ IMPORTANT**: This is a **DUMMY APPLICATION** for demonstration purposes only.

- No real authentication is implemented
- Any username/password combination will work
- No data is stored or transmitted
- Session management uses browser sessionStorage
- Not suitable for production use

## 🛠️ Technologies Used

- **Backend**: Express.js (Node.js)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with modern design patterns
- **Session**: Browser sessionStorage API

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔧 Configuration

### Change Port
Edit `app.js` or set environment variable:
```bash
PORT=8080 node app.js
```

### Customize Branding
- Edit `views/login.html` and `views/dashboard.html` for content
- Modify `public/css/style.css` for styling
- Update bank name "SecureBank" throughout the files

## 📊 Demo Data

The dashboard displays dummy data including:
- Total Balance: $125,450.00
- Savings Account: $85,230.50
- Checking Account: $40,219.50
- 5 Recent Transactions
- 6 Quick Action Buttons

## 🤝 Contributing

This is a demo project. Feel free to fork and modify for your needs.

## 📄 License

This project is for educational and demonstration purposes.

## 👨‍💻 Development

### Run in Development Mode
```bash
npm start
```

### Test the Application
```bash
npm test
```

## 🌐 API Endpoints

- `GET /` - Login page
- `GET /login` - Login page (explicit)
- `GET /dashboard` - Dashboard page
- `404` - Custom 404 error page

## 💡 Tips

1. Use any username/password to login
2. The username you enter will be displayed on the dashboard
3. Use the logout button to return to the login page
4. All quick action buttons show "Coming soon" alerts

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
PORT=3001 node app.js
```

### Cannot Find Module 'express'
Run:
```bash
npm install
```

### Page Not Loading
1. Check if the server is running
2. Verify the URL: `http://localhost:3000`
3. Check console for errors

## 📞 Support

For issues or questions, please check the console output for error messages.

---

**Built with ❤️ for demonstration purposes**