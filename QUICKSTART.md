# Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

## ⚡ Quick Setup (5 minutes)

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Start Backend Server
```bash
npm start
```
✓ Server running on http://localhost:5000

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 4: Compile TypeScript (Optional)
```bash
npm run build
```

### Step 5: Open Frontend
1. Open `index.html` in your browser
2. Or run: `npm start` (requires Python 3)

## 🧪 Test the Application

### 1. Register a New User
- Click "Register here" link
- Fill in: Name, Email, Password
- Click Register

### 2. Login
- Use your registered email and password
- Click Login

### 3. Add an Investment
- Click "+ Add Investment" button
- Fill in investment details
- Click "Add Investment"

### 4. View Dashboard
- See total portfolio value
- Check gains/losses
- View all investments in table

### 5. Create Portfolio
- Click "+ Create Portfolio"
- Enter portfolio name
- Manage your investments

## 📋 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in `.env`
- Default: `mongodb://localhost:27017/investment-app`

### CORS Error
- Backend should be running on port 5000
- Check API_BASE_URL in `ts/api.ts`

### Port Already in Use
- Change PORT in `.env`
- Change API_BASE_URL accordingly

## 🔑 Example Test Account
After registration, you can use any email/password:
```
Email: test@example.com
Password: password123
```

## 📚 Key Files to Know

| File | Purpose |
|------|---------|
| `backend/server.js` | Main server entry point |
| `backend/models/*.js` | Database schemas |
| `backend/routes/*.js` | API endpoints |
| `frontend/index.html` | Main UI |
| `frontend/ts/api.ts` | API client |
| `frontend/css/style.css` | Styling |

## 🎯 Next Steps

1. **Customize Investment Types** - Edit `Investment.js` model
2. **Add More Features** - Create new routes and controllers
3. **Enhance UI** - Modify CSS and HTML
4. **Add Charts** - Integrate Chart.js for analytics
5. **Deploy** - Deploy to cloud platforms (Heroku, Vercel, etc.)

---

**Need Help?** Check the main README.md for detailed documentation.
