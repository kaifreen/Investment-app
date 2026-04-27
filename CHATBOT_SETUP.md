# Smart Investment Chatbot Setup Guide

## Quick Start

### 1. **Get OpenAI API Key**
   - Visit: https://platform.openai.com/account/api-keys
   - Create a new API key
   - Copy the key

### 2. **Update Backend .env**
   - Navigate to: `backend/.env`
   - Find: `OPENAI_API_KEY=your_openai_api_key_here`
   - Replace with your actual API key:
     ```
     OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
     ```

### 3. **Install Dependencies** (Already done)
   - OpenAI package is already installed in backend
   - Run `npm install` in both frontend and backend if needed

### 4. **Start the Application**
   ```bash
   npm start
   ```
   This starts both backend (port 5000) and frontend (port 3002+)

### 5. **Access the Chatbot**
   - Login to your account
   - Look for the 💬 button in the bottom-right corner
   - Click to open the Investment Assistant chatbot

---

## Features

✅ **Smart Portfolio Analysis** - Analyzes your current investments
✅ **Diversification Recommendations** - Suggests asset allocation strategies
✅ **Real-Time Market Context** - Considers current market conditions
✅ **Risk-Based Personalization** - Customizes advice based on your risk profile
✅ **Quick Questions** - Pre-built questions for common scenarios
✅ **Chat History** - Conversation persists during session
✅ **Dark/Light Theme Support** - Matches your app theme
✅ **Responsive Design** - Works on mobile and desktop

---

## How the Chatbot Works

### 3-Step Flow (Follows Your Project Logic)

**Step 1: Tools** → Recommends investment instruments (stocks, bonds, ETFs, crypto)
**Step 2: API Data** → Considers market conditions and real-time data
**Step 3: Personalization** → Tailors strategy to your risk level and goals

### Example Interaction

**User:** "How should I diversify my portfolio?"

**Bot Response:**
```
Based on your medium risk profile and long-term growth goal:

Suggested Allocation:
- 40% Stocks (growth potential)
- 30% Bonds (stability)
- 20% ETFs (diversification)
- 10% Crypto (optional high-risk)

Reason: This allocation balances growth with stability...
```

---

## API Endpoint

### POST `/api/chat`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "message": "How should I diversify my portfolio?",
  "riskLevel": "moderate",
  "investmentGoal": "long-term growth",
  "portfolio": {}  // Optional: current portfolio data
}
```

**Response:**
```json
{
  "success": true,
  "message": "AI-generated diversification strategy...",
  "timestamp": "2026-04-27T15:30:45.123Z"
}
```

---

## Files Added

### Backend
- `backend/controllers/chatController.js` - Chat AI logic
- `backend/routes/chatRoutes.js` - Chat API endpoints

### Frontend
- `frontend/src/components/ChatBot.jsx` - React chatbot component
- `frontend/src/components/ChatBot.css` - Chatbot styling

### Updated Files
- `backend/server.js` - Added chat route
- `backend/.env` - Added OPENAI_API_KEY
- `frontend/src/App.jsx` - Integrated ChatBot component

---

## Troubleshooting

### "OpenAI API key is invalid"
- Check your API key in `.env`
- Ensure you're using gpt-4 or update to gpt-3.5-turbo if needed

### "Rate limit exceeded"
- OpenAI has usage limits
- Wait a moment before sending another message
- Check your OpenAI account billing

### Chatbot doesn't appear
- Make sure you're logged in
- Check browser console for errors (F12)
- Verify token is being sent correctly

### API Connection Error
- Ensure backend is running on port 5000
- Check CORS settings in server.js
- Verify token is valid

---

## Optional Enhancements

1. **Save Chat History to Database**
   ```javascript
   // Create ChatHistory model and save conversations
   ```

2. **Chat History Pagination**
   ```javascript
   // Show previous conversations
   ```

3. **Export Recommendations as PDF**
   ```javascript
   // Generate downloadable strategies
   ```

4. **Voice Input/Output**
   ```javascript
   // Add speech recognition
   ```

---

## Support

If you encounter issues:
1. Check your OpenAI API key
2. Verify backend is running: `curl http://localhost:5000/api/health`
3. Check browser console for errors
4. Ensure you're logged in before using chatbot
