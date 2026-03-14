import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAccount } from 'wagmi'

function AppLayout() {
  const { address, isConnected } = useAccount()
  const [navSearch, setNavSearch] = useState('') // Defined State

  // Function defined INSIDE the component
  const handleNavSearch = (e) => {
    e.preventDefault()
    if (!navSearch) return
    const query = encodeURIComponent(`${navSearch} Developer`)
    const url = `https://www.linkedin.com/jobs/search/?keywords=${query}&location=India`
    window.open(url, '_blank')
    setNavSearch('')
  }

  return (
    <div className="app-root">
      <header className="app-header" style={{ flexDirection: 'column', height: 'auto', paddingBottom: '15px' }}>
        
        {/* LINE 1: Brand, Nav, and Wallet */}
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <div className="brand">
            <span className="brand-mark">CA</span>
            <div className="brand-text">
              <span className="brand-title">CredAstra</span>
            </div>
          </div>
  
          <nav className="nav">
            <NavLink to="/" end className="nav-link">Home</NavLink>
            <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
            <NavLink to="/verify" className="nav-link">Verify</NavLink>
          </nav>
  
          <div className="header-wallet">
            {isConnected && address ? (
              <span className="wallet-chip">{address.slice(0, 6)}…{address.slice(-4)}</span>
            ) : (
              <span className="muted">Not connected</span>
            )}
          </div>
        </div>
  
        {/* LINE 2: The LinkedIn Search Bar */}
        <div style={{ width: '100%', marginTop: '15px', display: 'flex', justifyContent: 'center' }}>
          <form onSubmit={handleNavSearch} style={{ display: 'flex', width: '100%', maxWidth: '600px' }}>
            <input
              type="text"
              placeholder="Search for your next career move (e.g. MERN Stack)..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 15px',
                borderRadius: '25px 0 0 25px',
                border: '1px solid #333',
                background: '#1a1a1a',
                color: 'white',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 25px',
                background: '#0077b5',
                color: 'white',
                border: 'none',
                borderRadius: '0 25px 25px 0',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              LinkedIn Search
            </button>
          </form>
        </div>
      </header>
  
      <main className="app-main">
        <Outlet />
      </main>
      {/* ... footer */}
    </div>
  );
}

export default AppLayout;
