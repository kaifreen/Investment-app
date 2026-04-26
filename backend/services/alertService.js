const cron = require('node-cron');
const Alert = require('../models/Alert');
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

const sendSimulatedEmail = (email, subject, text) => {
  console.log('\n=======================================');
  console.log(`📧 SIMULATED EMAIL TO: ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body:\n${text}`);
  console.log('=======================================\n');
};

const checkAlerts = async () => {
  try {
    const alerts = await Alert.find({ isTriggered: false }).populate('userId', 'name email');
    if (alerts.length === 0) return;

    const symbols = [...new Set(alerts.map(a => a.symbol))];
    
    yahooFinance.suppressNotices(['yahooSurvey']);
    const quotes = await yahooFinance.quote(symbols);
    const quotesArray = Array.isArray(quotes) ? quotes : [quotes];
    
    const priceMap = {};
    quotesArray.forEach(q => {
      if (q && q.symbol) {
        priceMap[q.symbol] = q.regularMarketPrice;
      }
    });

    for (let alert of alerts) {
      const currentPrice = priceMap[alert.symbol];
      if (!currentPrice) continue;

      let triggered = false;
      if (alert.condition === 'below' && currentPrice <= alert.targetPrice) {
        triggered = true;
      } else if (alert.condition === 'above' && currentPrice >= alert.targetPrice) {
        triggered = true;
      }

      if (triggered) {
        alert.isTriggered = true;
        await alert.save();
        
        sendSimulatedEmail(
          alert.userId.email,
          `Price Alert Triggered: ${alert.symbol}`,
          `Hello ${alert.userId.name},\n\nYour alert for ${alert.symbol} has been triggered!\nThe current price is $${currentPrice.toFixed(2)}, which is ${alert.condition} your target of $${alert.targetPrice.toFixed(2)}.\n\nLog in to your Investment App to take action.`
        );
      }
    }
  } catch (err) {
    console.error('Error in alertService:', err);
  }
};

const startCron = () => {
  cron.schedule('*/2 * * * *', () => {
    console.log('[Cron] Checking price alerts...');
    checkAlerts();
  });
};

module.exports = { startCron };
