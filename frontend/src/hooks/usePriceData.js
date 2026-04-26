import { useState, useEffect, useRef } from 'react';

const cryptoSymbolMap = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  ADA: 'cardano',
  XRP: 'ripple',
  DOGE: 'dogecoin',
  DOT: 'polkadot'
};

export const usePriceData = (investments) => {
  const [livePrices, setLivePrices] = useState({});
  const [changes24h, setChanges24h] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  
  const token = localStorage.getItem('token');
  const hasFetchedRef = useRef(false);

  // Fetch Crypto (every 60s)
  useEffect(() => {
    if (!investments || investments.length === 0) return;
    let isMounted = true;

    const fetchCrypto = async () => {
      const cryptos = investments.filter(inv => inv.type === 'crypto');
      if (cryptos.length === 0) return;

      const ids = cryptos.map(c => {
        const sym = c.symbol.toUpperCase();
        return cryptoSymbolMap[sym] || c.symbol.toLowerCase();
      }).join(',');
      
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
        const data = await res.json();
        
        const newPrices = {};
        const newChanges = {};

        cryptos.forEach(c => {
          const sym = c.symbol.toUpperCase();
          const id = cryptoSymbolMap[sym] || c.symbol.toLowerCase();
          if (data[id]) {
            newPrices[c._id] = data[id].usd;
            newChanges[c._id] = data[id].usd_24h_change;
          }
        });

        if (isMounted) {
          setLivePrices(prev => ({ ...prev, ...newPrices }));
          setChanges24h(prev => ({ ...prev, ...newChanges }));
        }
      } catch (err) {
        console.error("CoinGecko API error", err);
      }
    };

    fetchCrypto();
    const intervalId = setInterval(fetchCrypto, 60000);
    return () => { isMounted = false; clearInterval(intervalId); };
  }, [investments]);

  // Fetch Stocks/ETFs/Bonds via Backend (every 120s)
  useEffect(() => {
    if (!investments || investments.length === 0) {
      setIsLoading(false);
      return;
    }
    let isMounted = true;

    const fetchStocks = async () => {
      const nonCryptos = investments.filter(inv => inv.type !== 'crypto');
      if (nonCryptos.length === 0) {
        setIsLoading(false);
        return;
      }
      
      if (!hasFetchedRef.current) {
        setIsLoading(true);
        hasFetchedRef.current = true;
      }
      setIsError(false);

      // Extract unique symbols
      const symbols = [...new Set(nonCryptos.map(inv => inv.symbol))].join(',');
      
      try {
        const res = await fetch(`/api/market/stocks?symbols=${symbols}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        const newPrices = {};
        const newChanges = {};

        if (res.ok) {
          nonCryptos.forEach(c => {
            const sym = c.symbol.toUpperCase();
            if (data[sym]) {
              newPrices[c._id] = data[sym].price;
              newChanges[c._id] = data[sym].changePercent;
            }
          });
        }

        if (isMounted) {
          setLivePrices(prev => ({ ...prev, ...newPrices }));
          setChanges24h(prev => ({ ...prev, ...newChanges }));
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setIsError(true);
          setIsLoading(false);
          console.error("Market API error", err);
        }
      }
    };

    fetchStocks();
    const intervalId = setInterval(fetchStocks, 120000);
    return () => { isMounted = false; clearInterval(intervalId); };
  }, [investments, token]);

  return { livePrices, changes24h, isLoading, isError };
};
