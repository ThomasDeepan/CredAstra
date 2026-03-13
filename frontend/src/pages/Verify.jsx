import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { credAstraContract } from '../web3/config.js'

export default function Verify() {
  const [addressToVerify, setAddressToVerify] = useState('')
  const [lastSubmitted, setLastSubmitted] = useState(null)

  const hasVerifyFunction =
    credAstraContract.verify?.functionName &&
    typeof credAstraContract.verify?.args === 'function' &&
    credAstraContract.abi.length > 0

  const { data: hash, isPending, error, writeContractAsync } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  async function handleSubmit(event) {
    event.preventDefault()
    if (!hasVerifyFunction || !addressToVerify) return

    const args = credAstraContract.verify.args(addressToVerify)
    try {
      const txHash = await writeContractAsync({
        address: credAstraContract.address,
        abi: credAstraContract.abi,
        functionName: credAstraContract.verify.functionName,
        args,
        chainId: credAstraContract.chainId,
      })
      setLastSubmitted({ address: addressToVerify, hash: txHash })
    } catch (err) {
      // handled via error object
      console.error(err)
    }
  }

  return (
    <section className="grid">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Verify address</h2>
          <p className="card-subtitle">
            Submit an address to your CredAstra contract for verification (for example, to register
            or attest its creditworthiness).
          </p>
        </div>
        <div className="card-body">
          {!hasVerifyFunction && (
            <p className="muted">
              To enable this flow, add a <code>verify</code> section to <code>credAstraContract</code>{' '}
              in <code>src/web3/config.js</code>, for example:
              <br />
              <code>
                {`verify: { functionName: 'verifyAddress', args: (address) => [address] }`}
              </code>
            </p>
          )}

          <form onSubmit={handleSubmit} className="verify-form">
            <label className="verify-label">
              Address to verify
              <input
                className="verify-input"
                type="text"
                placeholder="0x..."
                value={addressToVerify}
                onChange={(e) => setAddressToVerify(e.target.value)}
              />
            </label>

            <button
              type="submit"
              className="btn-primary"
              disabled={!hasVerifyFunction || !addressToVerify || isPending || isConfirming}
            >
              {isPending || isConfirming ? 'Submitting…' : 'Submit verification'}
            </button>
          </form>

          {error && <p className="error-text">{error.shortMessage || error.message}</p>}

          {lastSubmitted && (
            <div className="verify-status">
              <p className="muted">
                Submitted verification for <code>{lastSubmitted.address}</code>
              </p>
              <p className="muted">
                Status:{' '}
                {isConfirming
                  ? 'Waiting for confirmation…'
                  : isConfirmed
                    ? 'Confirmed on-chain.'
                    : 'Pending...'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
