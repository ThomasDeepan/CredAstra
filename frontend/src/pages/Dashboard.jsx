import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { credAstraContract } from '../web3/config.js'

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const [mongoSkills, setMongoSkills] = useState([])

  // --- WE HAVE REMOVED THE PREVIEW FUNCTION ERRORS BY WRAPPING THEM ---
  const hasPreviewFunction = credAstraContract.previewRead?.functionName && credAstraContract.abi.length > 0
  const args = typeof credAstraContract.previewRead?.args === 'function'
      ? credAstraContract.previewRead.args(address)
      : credAstraContract.previewRead?.args ?? []

  const { data: balance, isLoading, isError } = useReadContract({
    address: credAstraContract.address,
    abi: credAstraContract.abi,
    functionName: credAstraContract.previewRead?.functionName,
    args,
    chainId: credAstraContract.chainId,
    query: { enabled: Boolean(isConnected && address && hasPreviewFunction) },
  })

  // --- FETCH SKILLS FROM YOUR MONGODB BACKEND ---
  useEffect(() => {
    if (isConnected && address) {
      // Replace with your actual backend URL if different
      fetch(`http://localhost:5000/api/issuer/skills/${address}`)
        .then(res => res.json())
        .then(data => setMongoSkills(data))
        .catch(err => console.error("Error fetching skills:", err))
    }
  }, [isConnected, address])

  // --- THE JURY'S LINKEDIN SEARCH FEATURE ---
  const handleLinkedInSearch = (skillName) => {
    const query = encodeURIComponent(`${skillName} Developer`);
    const url = `https://www.linkedin.com/jobs/search/?keywords=${query}&location=India`;
    window.open(url, '_blank');
  }

  return (
    <section className="grid" style={{ gap: '2rem' }}>
      {/* SECTION 1: ON-CHAIN IDENTITY */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Digital Identity</h2>
          <p className="card-subtitle">Verified on Polygon Amoy Testnet</p>
        </div>
        <div className="card-body">
          {!isConnected ? (
            <p className="muted">Please connect your wallet to view your identity.</p>
          ) : (
            <div className="wallet-info">
              <div className="wallet-row">
                <span className="wallet-label">Connected Wallet:</span>
                <span className="wallet-value"><b>{address}</b></span>
              </div>
              <div className="wallet-row" style={{ marginTop: '10px' }}>
                <span className="wallet-label">Total Verified Skills (SBTs):</span>
                <span className="preview-value" style={{ fontSize: '1.5rem', color: '#8884d8' }}>
                   {isLoading ? "..." : (balance ? String(balance) : "0")}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: THE SKILL PASSPORT (CONNECTED TO MONGODB) */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Skill Passport</h2>
          <p className="card-subtitle">Click on a skill to find matching job opportunities on LinkedIn.</p>
        </div>
        <div className="card-body">
          {mongoSkills.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {mongoSkills.map((skill, index) => (
                <div key={index} style={{ padding: '15px', border: '1px solid #333', borderRadius: '8px', background: '#1a1a1a' }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>{skill.skillName}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#4caf50' }}>Verified Badge ✓</p>
                  
                  <button 
                    onClick={() => handleLinkedInSearch(skill.skillName)}
                    style={{
                      marginTop: '10px',
                      backgroundColor: '#0077b5',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    Find {skill.skillName} Jobs
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">No verified skills found in the database. Go to the "Verify" page to mint your first badge!</p>
          )}
        </div>
      </div>
    </section>
  )
}