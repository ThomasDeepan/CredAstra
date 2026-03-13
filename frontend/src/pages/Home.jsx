import { useMemo } from 'react'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useReadContract,
} from 'wagmi'
import { credAstraContract } from '../web3/config.js'

function ConnectWalletCard() {
  const { address, isConnected } = useAccount()
  const { connectors, connect, isPending: isConnecting, error } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()

  const primaryConnector = useMemo(
    () => connectors.find((c) => c.id === 'injected') ?? connectors[0],
    [connectors],
  )

  if (isConnected) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Wallet connected</h2>
          <p className="card-subtitle">You are ready to use CredAstra.</p>
        </div>
        <div className="card-body">
          <div className="wallet-row">
            <span className="wallet-label">Address</span>
            <span className="wallet-value">
              {address?.slice(0, 6)}…{address?.slice(-4)}
            </span>
          </div>
          <div className="wallet-row">
            <span className="wallet-label">Network</span>
            <span className="wallet-value">{chainId ?? 'Unknown'}</span>
          </div>
        </div>
        <div className="card-footer">
          <button type="button" className="btn-secondary" onClick={() => disconnect()}>
            Disconnect
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Connect your wallet</h2>
        <p className="card-subtitle">
          Connect MetaMask or another browser wallet to start interacting with your CredAstra
          contracts.
        </p>
      </div>
      <div className="card-footer">
        <button
          type="button"
          className="btn-primary"
          disabled={!primaryConnector || isConnecting}
          onClick={() =>
            primaryConnector ? connect({ connector: primaryConnector }) : undefined
          }
        >
          {isConnecting ? 'Connecting…' : 'Connect wallet'}
        </button>
      </div>
      {error && <p className="error-text">{error.message}</p>}
    </div>
  )
}

function ContractPreviewCard() {
  const { address } = useAccount()

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
      enabled: Boolean(address && hasPreviewFunction),
    },
  })

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Live contract preview</h2>
        <p className="card-subtitle">
          This reads from a view function you configure in <code>web3/config.js</code>.
        </p>
      </div>
      <div className="card-body">
        {!hasPreviewFunction && (
          <p className="muted">
            To wire this up to your Solidity contract, set <code>credAstraContract.address</code>,{' '}
            <code>credAstraContract.abi</code>, and{' '}
            <code>credAstraContract.previewRead.functionName</code> in{' '}
            <code>src/web3/config.js</code>. Once configured, the current value will appear here for
            the connected wallet.
          </p>
        )}

        {hasPreviewFunction && (
          <div className="preview-result">
            {isLoading && <span className="muted">Loading from contract…</span>}
            {isError && (
              <span className="error-text">
                Unable to read from contract. Check the address, ABI, chain, and function name.
              </span>
            )}
            {!isLoading && !isError && (
              <span className="preview-value">
                {data === undefined || data === null
                  ? 'No data returned yet.'
                  : typeof data === 'object'
                    ? JSON.stringify(data)
                    : String(data)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <section className="grid">
      <ConnectWalletCard />
      <ContractPreviewCard />
    </section>
  )
}
