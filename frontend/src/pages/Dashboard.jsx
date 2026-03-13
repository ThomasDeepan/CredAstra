import { useAccount, useReadContract } from 'wagmi'
import { credAstraContract } from '../web3/config.js'

export default function Dashboard() {
  const { address, isConnected } = useAccount()

  const hasPreviewFunction =
    credAstraContract.previewRead?.functionName && credAstraContract.abi.length > 0

  const args =
    typeof credAstraContract.previewRead?.args === 'function'
      ? credAstraContract.previewRead.args(address)
      : credAstraContract.previewRead?.args ?? []

  const { data, isLoading, isError } = useReadContract({
    address: credAstraContract.address,
    abi: credAstraContract.abi,
    functionName: credAstraContract.previewRead?.functionName,
    args,
    chainId: credAstraContract.chainId,
    query: {
      enabled: Boolean(isConnected && address && hasPreviewFunction),
    },
  })

  return (
    <section className="grid">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Your CredAstra profile</h2>
          <p className="card-subtitle">
            Overview of your on-chain credit signal pulled directly from the CredAstra contract.
          </p>
        </div>
        <div className="card-body">
          {!isConnected && (
            <p className="muted">Connect your wallet on the Home page to see your profile.</p>
          )}
          {isConnected && (
            <>
              <div className="wallet-row">
                <span className="wallet-label">Wallet</span>
                <span className="wallet-value">
                  {address?.slice(0, 6)}…{address?.slice(-4)}
                </span>
              </div>
              <div className="wallet-row">
                <span className="wallet-label">Primary metric</span>
                <span className="preview-value">
                  {!hasPreviewFunction && (
                    <span className="muted">
                      Configure <code>previewRead</code> in <code>web3/config.js</code> to display a
                      key metric here (for example, a credit score or risk tier).
                    </span>
                  )}
                  {hasPreviewFunction && isLoading && (
                    <span className="muted">Loading from contract…</span>
                  )}
                  {hasPreviewFunction && isError && (
                    <span className="error-text">
                      Unable to read from contract. Check the address, ABI, chain, and function
                      name.
                    </span>
                  )}
                  {hasPreviewFunction && !isLoading && !isError && (
                    <span>
                      {data === undefined || data === null
                        ? 'No data returned yet.'
                        : typeof data === 'object'
                          ? JSON.stringify(data)
                          : String(data)}
                    </span>
                  )}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
