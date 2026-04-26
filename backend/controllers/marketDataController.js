const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

const getStockPrices = async (req, res) => {
  try {
    const { symbols } = req.query;
    if (!symbols) {
      return res.status(400).json({ error: 'No symbols provided' });
    }

    const symbolArray = symbols.split(',').map(s => s.trim().toUpperCase());
    const results = {};

    // Suppress warnings for missing symbols gracefully
    yahooFinance.suppressNotices(['yahooSurvey']);

    try {
      const quotes = await yahooFinance.quote(symbolArray);
      const quotesArray = Array.isArray(quotes) ? quotes : [quotes];

      quotesArray.forEach(q => {
        if (q && q.symbol && q.regularMarketPrice !== undefined) {
          results[q.symbol] = {
            price: q.regularMarketPrice,
            changePercent: q.regularMarketChangePercent
          };
        }
      });
    } catch (quoteErr) {
      console.error('Yahoo Finance Quote Error:', quoteErr);
      // Sometimes querying an array fails if one symbol is completely invalid, 
      // but usually yahooFinance2 filters it out. 
    }

    res.json(results);
  } catch (err) {
    console.error('Yahoo Finance API Error:', err);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
};

module.exports = {
  getStockPrices
};
