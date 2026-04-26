# Investment App - Full Stack Project

A professional investment management application built with Node.js, Express, MongoDB, HTML/CSS/JavaScript/TypeScript.

## 🏗️ Project Structure

```
investment-app/
├── backend/
│   ├── models/          # MongoDB data models
│   │   ├── User.js      # User schema
│   │   ├── Investment.js # Investment schema
│   │   └── Portfolio.js  # Portfolio schema
│   ├── controllers/      # Business logic
│   │   ├── authController.js
│   │   ├── investmentController.js
│   │   └── portfolioController.js
│   ├── routes/          # API routes
│   │   ├── authRoutes.js
│   │   ├── investmentRoutes.js
│   │   └── portfolioRoutes.js
│   ├── middleware/      # Custom middleware
│   │   └── authMiddleware.js
│   ├── server.js        # Main server file
│   ├── .env             # Environment variables
│   └── package.json     # Backend dependencies
│
└── frontend/
    ├── ts/              # TypeScript source files
    │   ├── api.ts       # API client
    │   ├── auth.ts      # Authentication logic
    │   ├── dashboard.ts # Dashboard logic
    │   ├── investments.ts
    │   ├── portfolios.ts
    │   └── main.ts
    ├── js/              # Compiled JavaScript (generated)
    ├── css/             # Stylesheets
    │   ├── style.css
    │   └── responsive.css
    ├── index.html       # Main HTML file
    ├── package.json     # Frontend dependencies
    ├── tsconfig.json    # TypeScript configuration
    └── README.md        # Frontend documentation
```

## 🚀 Getting Started

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure MongoDB connection in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/investment-app
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. Start the server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Compile TypeScript to JavaScript:
```bash
npm run build
# or watch for changes
npm run watch
```

4. Start local server:
```bash
npm start
```

Frontend will be available at `http://localhost:3000`

## 📋 Features

### Authentication
- User registration with validation
- Secure login with JWT tokens
- Password hashing with bcryptjs
- Protected routes with middleware

### Investments Management
- Add, view, update, and delete investments
- Track stock, mutual funds, bonds, crypto, ETFs
- Calculate gains/losses and percentages
- Real-time value updates

### Portfolio Management
- Create multiple investment portfolios
- Organize investments by portfolio
- Track overall portfolio performance
- Easy portfolio management

### Dashboard
- Summary statistics
- Total portfolio value
- Gain/loss tracking
- Interactive tables and cards

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Clean and modern interface
- Modal dialogs for forms
- Real-time data updates
- Alert notifications

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling with variables and flexbox
- **TypeScript** - Type-safe JavaScript
- **Vanilla JavaScript** - No framework dependencies
- **Responsive Design** - Mobile-first approach

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Investments
- `POST /api/investments` - Create investment
- `GET /api/investments` - Get all investments
- `GET /api/investments/:id` - Get single investment
- `PUT /api/investments/:id` - Update investment
- `DELETE /api/investments/:id` - Delete investment

### Portfolios
- `POST /api/portfolios` - Create portfolio
- `GET /api/portfolios` - Get all portfolios
- `GET /api/portfolios/:id` - Get single portfolio
- `POST /api/portfolios/:id/add-investment` - Add investment to portfolio
- `PUT /api/portfolios/:id` - Update portfolio
- `DELETE /api/portfolios/:id` - Delete portfolio

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected API routes with middleware
- CORS configuration
- Input validation
- Secure token storage in localStorage

## 📱 Responsive Breakpoints

- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 480px

## 🎨 Color Scheme

- Primary: #2563eb (Blue)
- Secondary: #1e40af (Dark Blue)
- Success: #10b981 (Green)
- Danger: #ef4444 (Red)
- Warning: #f59e0b (Orange)

## 📦 Environment Variables

**.env (Backend)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/investment-app
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

## 🚀 Deployment

### Backend (e.g., Heroku)
1. Set environment variables
2. Deploy using your hosting platform
3. Update API_BASE_URL in frontend

### Frontend (e.g., Netlify, Vercel)
1. Build TypeScript: `npm run build`
2. Deploy `index.html` and compiled files
3. Ensure API URL points to deployed backend

## 📞 Support

For issues or questions, please refer to the documentation or contact the development team.

## 📄 License

ISC License

---

**Created:** 2026  
**Version:** 1.0.0  
**Author:** Investment App Team
