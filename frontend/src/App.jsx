import { useState, useEffect } from 'react'
import { usePriceData } from './hooks/usePriceData'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import ChatBot from './components/ChatBot'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [activeTab, setActiveTab] = useState('dashboard')

  const [investments, setInvestments] = useState([])
  const { livePrices, changes24h, isLoading } = usePriceData(investments)
  const [showAddInvestment, setShowAddInvestment] = useState(false)
  const [portfolios, setPortfolios] = useState([])
  const [showAddPortfolio, setShowAddPortfolio] = useState(false)
  const [sellingInvestment, setSellingInvestment] = useState(null)
  
  const [alerts, setAlerts] = useState([])
  const [showAlertForm, setShowAlertForm] = useState(false)
  
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')

  const API_URL = '/api'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  useEffect(() => {
    if (token) {
      // Fetch user profile
      fetch(`${API_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          handleLogout()
        } else {
          setUser(data)
          setIsLoggedIn(true)
          fetchInvestments()
          fetchPortfolios()
          fetchAlerts()
        }
      })
      .catch(() => handleLogout())
    }
  }, [token])

  const fetchInvestments = async () => {
    try {
      const res = await fetch(`${API_URL}/investments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setInvestments(data)
      }
    } catch (error) {
      console.error('Failed to fetch investments:', error)
    }
  }

  const fetchPortfolios = async () => {
    try {
      const res = await fetch(`${API_URL}/portfolios`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setPortfolios(data)
      }
    } catch (error) {
      console.error('Failed to fetch portfolios:', error)
    }
  }

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API_URL}/alerts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setAlerts(data)
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const email = e.target.email?.value || ''
    const password = e.target.password?.value || ''
    
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      
      if (res.ok) {
        setToken(data.token)
        localStorage.setItem('token', data.token)
        setUser(data.user)
        setIsLoggedIn(true)
        e.target.reset()
      } else {
        alert(data.error || 'Login failed')
      }
    } catch (err) {
      alert('Network error')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const name = e.target.name?.value || ''
    const email = e.target.email?.value || ''
    const password = e.target.password?.value || ''
    
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      
      if (res.ok) {
        alert('Registration successful! Please login.')
        setShowRegister(false)
        e.target.reset()
      } else {
        alert(data.error || 'Registration failed')
      }
    } catch (err) {
      alert('Network error')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    setShowRegister(false)
    setInvestments([])
    setPortfolios([])
    setAlerts([])
  }

  const handleAddInvestment = async (e) => {
    e.preventDefault()
    const investmentData = {
      symbol: e.target.symbol.value,
      name: e.target.name.value,
      type: e.target.type.value,
      quantity: Number(e.target.quantity.value),
      buyPrice: Number(e.target.buyPrice.value),
      purchaseDate: e.target.purchaseDate.value
    }

    try {
      const res = await fetch(`${API_URL}/investments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(investmentData)
      })
      
      const data = await res.json()
      
      if (res.ok) {
        alert('Investment added successfully!')
        setShowAddInvestment(false)
        fetchInvestments()
        e.target.reset()
      } else {
        alert(data.error || 'Failed to add investment')
      }
    } catch (err) {
      alert('Network error')
    }
  }

  const handleAddPortfolio = async (e) => {
    e.preventDefault()
    const portfolioData = {
      name: e.target.name.value,
      description: e.target.description.value
    }

    try {
      const res = await fetch(`${API_URL}/portfolios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(portfolioData)
      })
      
      const data = await res.json()
      
      if (res.ok) {
        alert('Portfolio created successfully!')
        setShowAddPortfolio(false)
        fetchPortfolios()
        e.target.reset()
      } else {
        alert(data.error || 'Failed to create portfolio')
      }
    } catch (err) {
      alert('Network error')
    }
  }

  const handleSellInvestment = async (e, id) => {
    e.preventDefault()
    const quantityToSell = Number(e.target.quantityToSell.value)
    const sellPrice = Number(e.target.sellPrice.value)
    
    try {
      const res = await fetch(`${API_URL}/investments/${id}/sell`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantityToSell, sellPrice })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        alert(`Sold successfully! Realized gain: $${data.realizedGain.toFixed(2)}`)
        setSellingInvestment(null)
        fetchInvestments()
        fetchPortfolios()
      } else {
        alert(data.error || 'Failed to sell investment')
      }
    } catch (err) {
      alert('Network error')
    }
  }

  const handleExportCSV = () => {
    if (investments.length === 0) {
      alert("No investments to export");
      return;
    }

    const headers = ['Name', 'Symbol', 'Type', 'Quantity', 'Buy Price ($)', 'Live Price ($)', 'Total Cost ($)', 'Current Value ($)', 'Gain/Loss ($)', '24h Change (%)'];
    
    const rows = investments.map(inv => {
      const livePrice = livePrices[inv._id] !== undefined ? livePrices[inv._id] : (inv.currentPrice || inv.buyPrice);
      const totalCost = inv.buyPrice * inv.quantity;
      const currentValue = livePrice * inv.quantity;
      const gainLoss = currentValue - totalCost;
      const change24h = changes24h[inv._id] || 0;

      return [
        `"${inv.name}"`,
        inv.symbol,
        inv.type,
        inv.quantity,
        inv.buyPrice.toFixed(2),
        livePrice.toFixed(2),
        totalCost.toFixed(2),
        currentValue.toFixed(2),
        gainLoss.toFixed(2),
        change24h.toFixed(2)
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'portfolio_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleAddAlert = async (e) => {
    e.preventDefault()
    const alertData = {
      symbol: e.target.symbol.value.toUpperCase(),
      targetPrice: Number(e.target.targetPrice.value),
      condition: e.target.condition.value
    }

    try {
      const res = await fetch(`${API_URL}/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(alertData)
      })
      
      const data = await res.json()
      
      if (res.ok) {
        alert('Alert created successfully! We will monitor the price for you.')
        setShowAlertForm(false)
        fetchAlerts()
        e.target.reset()
      } else {
        alert(data.error || 'Failed to create alert')
      }
    } catch (err) {
      alert('Network error')
    }
  }

  const handleDeleteAlert = async (id) => {
    try {
      const res = await fetch(`${API_URL}/alerts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchAlerts()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Dashboard calculations
  const totalBalance = investments.reduce((sum, inv) => {
    const price = livePrices[inv._id] !== undefined ? livePrices[inv._id] : (inv.currentPrice || inv.buyPrice)
    return sum + (price * inv.quantity)
  }, 0)
  
  const totalCost = investments.reduce((sum, inv) => sum + (inv.totalCost || 0), 0)
  const totalGain = totalBalance - totalCost
  const gainPercentage = totalCost > 0 ? ((totalGain / totalCost) * 100).toFixed(2) : 0

  // Asset Allocation
  const assetAllocation = investments.reduce((acc, inv) => {
    const livePrice = livePrices[inv._id] !== undefined ? livePrices[inv._id] : (inv.currentPrice || inv.buyPrice)
    const value = livePrice * inv.quantity
    if (value > 0) {
      if (!acc[inv.type]) {
        acc[inv.type] = { name: inv.type.charAt(0).toUpperCase() + inv.type.slice(1), value: 0 }
      }
      acc[inv.type].value += value
    }
    return acc
  }, {})

  const chartData = Object.values(assetAllocation)
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

  if (!isLoggedIn) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <h1>💼 Investment App</h1>
            <p className="subtitle">Manage Your Investments with Ease</p>

            {!showRegister ? (
              <div className="form-section">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                  <input type="email" name="email" placeholder="Email" required />
                  <input type="password" name="password" placeholder="Password" required />
                  <button type="submit" className="btn-primary">Login</button>
                </form>
                <p className="toggle-link">
                  Don't have an account? 
                  <button type="button" onClick={() => setShowRegister(true)} className="link-btn">
                    Register here
                  </button>
                </p>
              </div>
            ) : (
              <div className="form-section">
                <h2>Register</h2>
                <form onSubmit={handleRegister}>
                  <input type="text" name="name" placeholder="Full Name" required />
                  <input type="email" name="email" placeholder="Email" required />
                  <input type="password" name="password" placeholder="Password" required />
                  <button type="submit" className="btn-primary">Register</button>
                </form>
                <p className="toggle-link">
                  Already have an account? 
                  <button type="button" onClick={() => setShowRegister(false)} className="link-btn">
                    Login here
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">
            <h1>💼 Investment App</h1>
          </div>
          <ul className="nav-links">
            <li>
              <button
                className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${activeTab === 'investments' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('investments')
                  setShowAddInvestment(false)
                }}
              >
                Investments
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${activeTab === 'portfolios' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('portfolios')
                  setShowAddPortfolio(false)
                }}
              >
                Portfolios
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${activeTab === 'alerts' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('alerts')
                  setShowAlertForm(false)
                }}
              >
                Alerts
              </button>
            </li>
            <li>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </li>
            <li>
              <button 
                onClick={toggleTheme} 
                title="Toggle Theme"
                style={{background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: '0 5px', marginLeft: '10px'}}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-header">
          <h2>Welcome, {user?.name}! 👋</h2>
          <p>{user?.email}</p>
        </div>

        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <h3>Dashboard</h3>
            <div className="cards-grid">
              <div className="card">
                <h4>Total Balance</h4>
                {isLoading ? (
                  <div className="skeleton skeleton-text" style={{width: '150px', height: '38px', marginBottom: '12px'}}></div>
                ) : (
                  <p className="amount">${totalBalance.toFixed(2)}</p>
                )}
                <span className="badge">{gainPercentage > 0 ? '+' : ''}{gainPercentage}% all time</span>
              </div>
              <div className="card">
                <h4>Investments</h4>
                <p className="amount">{investments.length}</p>
                <span className="badge">Active</span>
              </div>
              <div className="card">
                <h4>Portfolios</h4>
                <p className="amount">{portfolios.length}</p>
                <span className="badge">Managed</span>
              </div>
            </div>

            {chartData.length > 0 && (
              <div className="card" style={{marginTop: '20px'}}>
                <h4 style={{marginBottom: '20px'}}>Asset Allocation</h4>
                <div style={{height: '300px', width: '100%'}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => `$${value.toFixed(2)}`}
                        contentStyle={{background: theme === 'dark' ? '#1e293b' : '#ffffff', border: theme === 'dark' ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '8px', color: theme === 'dark' ? '#e2e8f0' : '#0f172a'}}
                        itemStyle={{color: theme === 'dark' ? '#e2e8f0' : '#0f172a'}}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginTop: '10px'}}>
                  {chartData.map((entry, index) => (
                    <div key={entry.name} style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                      <div style={{width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length]}}></div>
                      <span style={{fontSize: '0.9rem', color: '#94a3b8'}}>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'investments' && (
          <div className="tab-content">
            <div className="section-header">
              <h3>Investments</h3>
              <div style={{display: 'flex', gap: '10px'}}>
                <button 
                  className="btn-secondary" 
                  onClick={handleExportCSV}
                  style={{background: 'transparent', border: '1px solid #10b981', color: '#10b981', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}
                >
                  📥 Export CSV
                </button>
                {!showAddInvestment && (
                  <button 
                    className="btn-primary" 
                    onClick={() => setShowAddInvestment(true)}
                  >
                    + Add Investment
                  </button>
                )}
              </div>
            </div>
            
            {showAddInvestment ? (
              <div className="card form-section" style={{marginBottom: '20px', maxWidth: '500px'}}>
                <h4 style={{marginBottom: '15px', color: '#e2e8f0'}}>New Investment</h4>
                <form onSubmit={handleAddInvestment}>
                  <input type="text" name="symbol" placeholder="Symbol (e.g. AAPL)" required />
                  <input type="text" name="name" placeholder="Asset Name" required />
                  <select name="type" className="form-select" required>
                    <option value="">Select Type</option>
                    <option value="stock">Stock</option>
                    <option value="crypto">Crypto</option>
                    <option value="etf">ETF</option>
                    <option value="bond">Bond</option>
                    <option value="mutual fund">Mutual Fund</option>
                  </select>
                  <input type="number" name="quantity" placeholder="Quantity" min="0" step="any" required />
                  <input type="number" name="buyPrice" placeholder="Buy Price" min="0" step="any" required />
                  <input type="date" name="purchaseDate" required />
                  
                  <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                    <button type="submit" className="btn-primary">Add Investment</button>
                    <button 
                      type="button" 
                      onClick={() => setShowAddInvestment(false)} 
                      style={{background: 'transparent', border: '1px solid #64748b', color: '#e2e8f0', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer'}}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : null}

            <div className="investments-list">
              {investments.length === 0 && !showAddInvestment ? (
                <p style={{color: '#94a3b8'}}>No investments found. Add one to get started!</p>
              ) : (
                investments.map(inv => {
                  const livePrice = livePrices[inv._id] !== undefined ? livePrices[inv._id] : (inv.currentPrice || inv.buyPrice)
                  const change = changes24h[inv._id] || 0
                  const isPositive = change >= 0
                  
                  return (
                    <div className="investment-item" key={inv._id} style={{flexDirection: 'column', alignItems: 'stretch'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>
                          <h4>{inv.name}</h4>
                          <p>{inv.symbol} - {inv.quantity} units @ ${inv.buyPrice.toFixed(2)}</p>
                        </div>
                        <div style={{textAlign: 'right'}}>
                          {isLoading ? (
                            <>
                              <div className="skeleton skeleton-text" style={{width: '90px', height: '24px', marginBottom: '6px', marginLeft: 'auto'}}></div>
                              <div className="skeleton skeleton-text" style={{width: '60px', height: '16px', marginLeft: 'auto'}}></div>
                            </>
                          ) : (
                            <>
                              <span className="value">${(livePrice * inv.quantity).toFixed(2)}</span>
                              <div className={isPositive ? 'text-green' : 'text-red'} style={{fontSize: '0.85rem', marginTop: '4px', fontWeight: '600'}}>
                                {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}% (24h)
                              </div>
                              <button 
                                onClick={() => setSellingInvestment(sellingInvestment === inv._id ? null : inv._id)} 
                                style={{marginTop: '8px', padding: '4px 8px', fontSize: '0.8rem', background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', borderRadius: '4px', cursor: 'pointer'}}
                              >
                                {sellingInvestment === inv._id ? 'Cancel' : 'Sell'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {sellingInvestment === inv._id && (
                        <div style={{marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(148, 163, 184, 0.1)'}}>
                          <form onSubmit={(e) => handleSellInvestment(e, inv._id)} style={{display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap'}}>
                            <input type="number" name="quantityToSell" placeholder="Qty to Sell" max={inv.quantity} min="0.000001" step="any" required className="form-select" style={{width: '120px'}} />
                            <input type="number" name="sellPrice" placeholder="Sell Price" defaultValue={livePrice.toFixed(2)} min="0" step="any" required className="form-select" style={{width: '120px'}} />
                            <button type="submit" className="btn-primary" style={{padding: '10px 16px'}}>Confirm Sale</button>
                          </form>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'portfolios' && (
          <div className="tab-content">
            <div className="section-header">
              <h3>Portfolios</h3>
              {!showAddPortfolio && (
                <button 
                  className="btn-primary" 
                  onClick={() => setShowAddPortfolio(true)}
                >
                  + Create Portfolio
                </button>
              )}
            </div>

            {showAddPortfolio ? (
              <div className="card form-section" style={{marginBottom: '20px', maxWidth: '500px'}}>
                <h4 style={{marginBottom: '15px', color: '#e2e8f0'}}>New Portfolio</h4>
                <form onSubmit={handleAddPortfolio}>
                  <input type="text" name="name" placeholder="Portfolio Name (e.g. Retirement)" required />
                  <input type="text" name="description" placeholder="Description" />
                  
                  <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                    <button type="submit" className="btn-primary">Create Portfolio</button>
                    <button 
                      type="button" 
                      onClick={() => setShowAddPortfolio(false)} 
                      style={{background: 'transparent', border: '1px solid #64748b', color: '#e2e8f0', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer'}}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : null}

            <div className="portfolios-list">
              {portfolios.length === 0 && !showAddPortfolio ? (
                <p style={{color: '#94a3b8'}}>No portfolios found. Create one to organize your investments!</p>
              ) : (
                portfolios.map(port => {
                  const portfolioAllocation = (port.investments || []).reduce((acc, inv) => {
                    const livePrice = livePrices[inv._id] !== undefined ? livePrices[inv._id] : (inv.currentPrice || inv.buyPrice)
                    const value = livePrice * inv.quantity
                    if (value > 0) {
                      if (!acc[inv.type]) {
                        acc[inv.type] = { name: inv.type.charAt(0).toUpperCase() + inv.type.slice(1), value: 0 }
                      }
                      acc[inv.type].value += value
                    }
                    return acc
                  }, {})
                  
                  const portChartData = Object.values(portfolioAllocation)

                  return (
                    <div className="portfolio-item" key={port._id} style={{display: 'flex', flexDirection: 'column'}}>
                      <div>
                        <h4>{port.name}</h4>
                        <p>{port.investments?.length || 0} investments</p>
                        <p style={{fontSize: '0.8rem', color: '#64748b', margin: '5px 0 15px 0'}}>{port.description}</p>
                        <span className="value">${(port.totalValue || 0).toFixed(2)}</span>
                      </div>
                      
                      {portChartData.length > 0 && (
                        <div style={{height: '200px', width: '100%', marginTop: '15px'}}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={portChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {portChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value) => `$${value.toFixed(2)}`}
                                contentStyle={{background: theme === 'dark' ? '#1e293b' : '#ffffff', border: theme === 'dark' ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '8px', color: theme === 'dark' ? '#e2e8f0' : '#0f172a'}}
                                itemStyle={{color: theme === 'dark' ? '#e2e8f0' : '#0f172a', fontSize: '0.9rem'}}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="tab-content">
            <div className="section-header">
              <h3>Price Alerts</h3>
              {!showAlertForm && (
                <button 
                  className="btn-primary" 
                  onClick={() => setShowAlertForm(true)}
                >
                  + Add Alert
                </button>
              )}
            </div>

            {showAlertForm && (
              <div className="card form-section" style={{marginBottom: '20px', maxWidth: '500px'}}>
                <h4 style={{marginBottom: '15px', color: 'var(--text-primary)'}}>New Price Alert</h4>
                <form onSubmit={handleAddAlert}>
                  <input type="text" name="symbol" placeholder="Symbol (e.g. AAPL, BTC)" required />
                  <div style={{display: 'flex', gap: '10px'}}>
                    <select name="condition" className="form-select" required style={{flex: 1}}>
                      <option value="below">Drops Below</option>
                      <option value="above">Rises Above</option>
                    </select>
                    <input type="number" name="targetPrice" placeholder="Target Price ($)" min="0" step="any" required style={{flex: 1}} />
                  </div>
                  
                  <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                    <button type="submit" className="btn-primary">Create Alert</button>
                    <button 
                      type="button" 
                      onClick={() => setShowAlertForm(false)} 
                      style={{background: 'transparent', border: '1px solid #64748b', color: 'var(--text-primary)', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer'}}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="investments-list">
              {alerts.length === 0 && !showAlertForm ? (
                <p style={{color: 'var(--text-secondary)'}}>No active alerts. Add one to start monitoring prices automatically!</p>
              ) : (
                alerts.map(alert => (
                  <div className="investment-item" key={alert._id}>
                    <div>
                      <h4 style={{textDecoration: alert.isTriggered ? 'line-through' : 'none', color: alert.isTriggered ? 'var(--text-secondary)' : 'var(--text-primary)'}}>
                        {alert.symbol}
                      </h4>
                      <p>
                        Notify me when price goes <strong>{alert.condition}</strong> ${alert.targetPrice.toFixed(2)}
                      </p>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                      {alert.isTriggered ? (
                        <span className="badge" style={{background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b'}}>Triggered</span>
                      ) : (
                        <span className="badge" style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6'}}>Monitoring</span>
                      )}
                      <button 
                        onClick={() => handleDeleteAlert(alert._id)}
                        style={{background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem'}}
                        title="Delete Alert"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
      
      {/* ChatBot - Show only when logged in */}
      {isLoggedIn && token && (
        <ChatBot 
          token={token} 
          riskLevel={user?.riskLevel || 'moderate'}
          investmentGoal={user?.investmentGoal || 'long-term growth'}
        />
      )}
    </div>
  )
}

export default App
