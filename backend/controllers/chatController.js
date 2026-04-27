const OpenAI = require('openai');
const Portfolio = require('../models/Portfolio');

let openai = null;

const buildFallbackAdvice = (message, riskLevel, investmentGoal, userPortfolio) => {
  const normalizedRisk = (riskLevel || 'moderate').toLowerCase();
  const lowerMessage = (message || '').toLowerCase();

  const allocationsByRisk = {
    low: [
      { asset: 'Bonds / Debt Funds', percentage: 50 },
      { asset: 'Broad Market ETFs', percentage: 30 },
      { asset: 'Large-Cap Stocks', percentage: 15 },
      { asset: 'Gold / Defensive Assets', percentage: 5 },
    ],
    moderate: [
      { asset: 'Broad Market ETFs', percentage: 40 },
      { asset: 'Large/Mid-Cap Stocks', percentage: 30 },
      { asset: 'Bonds / Debt Funds', percentage: 20 },
      { asset: 'High-Risk (Crypto/Thematic)', percentage: 10 },
    ],
    high: [
      { asset: 'Stocks (Diversified)', percentage: 55 },
      { asset: 'Growth ETFs', percentage: 20 },
      { asset: 'Bonds / Cash Buffer', percentage: 15 },
      { asset: 'High-Risk (Crypto/Thematic)', percentage: 10 },
    ],
  };

  const chosen =
    allocationsByRisk[normalizedRisk] ||
    allocationsByRisk.moderate;

  const hasPortfolio = userPortfolio && Array.isArray(userPortfolio.investments);
  const portfolioHint = hasPortfolio
    ? `I analyzed your current holdings and built suggestions for your ${investmentGoal || 'long-term growth'} goal.`
    : `I do not have your portfolio data right now, so this is a baseline allocation for ${investmentGoal || 'long-term growth'}.`;

  const focusTip = lowerMessage.includes('crypto')
    ? '\n\nCrypto tip: keep crypto exposure capped at 5-10% unless you can handle high volatility.'
    : '';

  const bullets = chosen
    .map((item) => `- ${item.asset}: ${item.percentage}%`)
    .join('\n');

  return `Here is a practical diversification plan:\n\n${portfolioHint}\n\nSuggested Allocation:\n${bullets}\n\nWhy this works:\n- Spreads risk across multiple asset classes\n- Balances growth and stability for your risk profile\n- Keeps high-volatility assets limited to control drawdowns${focusTip}\n\nIf you want, I can also provide a step-by-step monthly investment plan (SIP style) based on your budget.`;
};

// Initialize OpenAI only if API key is available
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const generateChatResponse = async (req, res) => {
  try {
    const { message, riskLevel, investmentGoal, portfolio } = req.body;
    const userId = req.userId;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Fetch user's portfolio if not provided
    let userPortfolio = portfolio;
    if (!userPortfolio && userId) {
      userPortfolio = await Portfolio.findOne({ userId }).populate('investments');
    }

    // Build context for the AI
    let portfolioContext = '';
    if (userPortfolio && userPortfolio.investments) {
      const totalValue = userPortfolio.investments.reduce((sum, inv) => {
        const unitPrice = inv.currentPrice > 0 ? inv.currentPrice : inv.buyPrice;
        const amount = unitPrice * inv.quantity;
        return sum + amount;
      }, 0);
      const allocation = userPortfolio.investments.map(inv => ({
        symbol: inv.symbol,
        amount: (inv.currentPrice > 0 ? inv.currentPrice : inv.buyPrice) * inv.quantity,
        percentage: totalValue > 0
          ? ((((inv.currentPrice > 0 ? inv.currentPrice : inv.buyPrice) * inv.quantity) / totalValue) * 100).toFixed(2)
          : '0.00'
      }));
      portfolioContext = `\nUser's Current Portfolio:\n${JSON.stringify(allocation, null, 2)}\nTotal Portfolio Value: $${totalValue}`;
    }

    // Graceful fallback when OpenAI is not configured
    if (!openai || !process.env.OPENAI_API_KEY) {
      return res.json({
        success: true,
        message: buildFallbackAdvice(message, riskLevel, investmentGoal, userPortfolio),
        source: 'fallback',
        timestamp: new Date()
      });
    }

    // System prompt following the project's 3-step flow
    const systemPrompt = `You are a Smart Investment Diversification Assistant. Your role is to analyze portfolios and suggest diversification strategies.

FOLLOW THIS 3-STEP FLOW:
Step 1: Recommend Tools/Assets (stocks, bonds, ETFs, crypto, etc.)
Step 2: Consider Real-Time Market Data and Trends
Step 3: Personalize Strategy Based on User's Risk Profile and Goals

User Profile:
- Risk Level: ${riskLevel || 'moderate'}
- Investment Goal: ${investmentGoal || 'long-term growth'}
${portfolioContext}

Guidelines:
- Keep responses clear and structured
- Use bullet points for recommendations
- Include suggested allocation percentages
- Explain the "why" behind your recommendations
- Be beginner-friendly
- Always consider diversification principles`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const botMessage = response.choices[0].message.content;

    // Log chat interaction (optional)
    console.log(`Chat with user ${userId}: ${message}`);

    res.json({
      success: true,
      message: botMessage,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Chat Error:', error);
    
    // Handle specific OpenAI errors
    if (error.status === 401) {
      const { message, riskLevel, investmentGoal, portfolio } = req.body || {};
      let userPortfolio = portfolio;
      if (!userPortfolio && req.userId) {
        userPortfolio = await Portfolio.findOne({ userId: req.userId }).populate('investments');
      }

      return res.json({
        success: true,
        message: `${buildFallbackAdvice(message, riskLevel, investmentGoal, userPortfolio)}\n\nNote: OpenAI key appears invalid, so I used local fallback guidance.`,
        source: 'fallback',
        timestamp: new Date()
      });
    }
    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      return res.status(503).json({ error: 'OpenAI module not properly installed' });
    }

    res.status(500).json({ error: 'Failed to generate chat response: ' + error.message });
  }
};

module.exports = {
  generateChatResponse
};
