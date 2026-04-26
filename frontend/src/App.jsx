import { useState } from 'react'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  const handleLogin = (e) => {
    e.preventDefault()
    const email = e.target.email?.value || ''
    const password = e.target.password?.value || ''
    if (email && password) {
      setUser({ email, name: 'User' })
      setIsLoggedIn(true)
      e.target.reset()
    }
  }

  const handleRegister = (e) => {
    e.preventDefault()
    const name = e.target.name?.value || ''
    const email = e.target.email?.value || ''
    const password = e.target.password?.value || ''
    if (name && email && password) {
      setUser({ name, email })
      setIsLoggedIn(true)
      setShowRegister(false)
      e.target.reset()
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    setShowRegister(false)
  }

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
                  <input type="password" name="confirm" placeholder="Confirm Password" required />
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
                onClick={() => setActiveTab('investments')}
              >
                Investments
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${activeTab === 'portfolios' ? 'active' : ''}`}
                onClick={() => setActiveTab('portfolios')}
              >
                Portfolios
              </button>
            </li>
            <li>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-header">
          <h2>Welcome, {user.name}! 👋</h2>
          <p>{user.email}</p>
        </div>

        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <h3>Dashboard</h3>
            <div className="cards-grid">
              <div className="card">
                <h4>Total Balance</h4>
                <p className="amount">$45,230.50</p>
                <span className="badge">+12.5% this month</span>
              </div>
              <div className="card">
                <h4>Investments</h4>
                <p className="amount">8</p>
                <span className="badge">Active</span>
              </div>
              <div className="card">
                <h4>Portfolios</h4>
                <p className="amount">3</p>
                <span className="badge">Managed</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investments' && (
          <div className="tab-content">
            <div className="section-header">
              <h3>Investments</h3>
              <button className="btn-primary">+ Add Investment</button>
            </div>
            <div className="investments-list">
              <div className="investment-item">
                <h4>Apple Inc.</h4>
                <p>AAPL - 10 shares @ $150.50</p>
                <span className="value">$1,505.00</span>
              </div>
              <div className="investment-item">
                <h4>Microsoft Corp.</h4>
                <p>MSFT - 5 shares @ $350.25</p>
                <span className="value">$1,751.25</span>
              </div>
              <div className="investment-item">
                <h4>Tesla Inc.</h4>
                <p>TSLA - 3 shares @ $245.80</p>
                <span className="value">$737.40</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'portfolios' && (
          <div className="tab-content">
            <div className="section-header">
              <h3>Portfolios</h3>
              <button className="btn-primary">+ Create Portfolio</button>
            </div>
            <div className="portfolios-list">
              <div className="portfolio-item">
                <h4>Growth Portfolio</h4>
                <p>6 investments</p>
                <span className="value">$28,450.25</span>
              </div>
              <div className="portfolio-item">
                <h4>Conservative Mix</h4>
                <p>4 investments</p>
                <span className="value">$12,380.75</span>
              </div>
              <div className="portfolio-item">
                <h4>Dividend Focus</h4>
                <p>3 investments</p>
                <span className="value">$8,990.50</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
