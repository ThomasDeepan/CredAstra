import { NavLink, Outlet } from 'react-router-dom'
import { useAccount } from 'wagmi'

function AppLayout() {
  const { address, isConnected } = useAccount()

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">CA</span>
          <div className="brand-text">
            <span className="brand-title">CredAstra</span>
            <span className="brand-subtitle">On-chain credit intelligence</span>
          </div>
        </div>
        <nav className="nav">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
          <NavLink to="/dashboard" className="nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/verify" className="nav-link">
            Verify
          </NavLink>
        </nav>
        <div className="header-wallet">
          {isConnected && address ? (
            <span className="wallet-chip">
              {address.slice(0, 6)}…{address.slice(-4)}
            </span>
          ) : (
            <span className="muted">Wallet: not connected</span>
          )}
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <span className="muted">
          Frontend wired for your Solidity contracts. Configure details in{' '}
          <code>src/web3/config.js</code>.
        </span>
      </footer>
    </div>
  )
}

export default AppLayout
