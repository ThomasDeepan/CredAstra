import { useState, useEffect } from 'react' // 1. Added useEffect
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi' // 2. Added useAccount
import { credAstraContract } from '../web3/config.js'

const saveToBackend = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/issuer/issue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: addressToVerify, // The wallet address
        skill: skillName,          // The skill name (e.g. "Java")
        ipfs: "ipfs://...",         // Metadata link
        issuer: address             // Your connected wallet
      }),
    });

    if (response.ok) {
      console.log("Skill successfully logged to MongoDB! ✅");
    }
  } catch (error) {
    console.error("Failed to connect to backend:", error);
  }
};

export default function Verify() {
  const { address } = useAccount() // Get the connected issuer's address
  const [skillName, setSkillName] = useState(''); 
  const [addressToVerify, setAddressToVerify] = useState('');
  const [lastSubmitted, setLastSubmitted] = useState(null)

  const hasVerifyFunction =
    credAstraContract.verify?.functionName &&
    typeof credAstraContract.verify?.args === 'function' &&
    credAstraContract.abi.length > 0

  const { data: hash, isPending, error, writeContractAsync } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // 3. THIS IS THE NEW LOGIC: Save to MongoDB when confirmed
  useEffect(() => {
    const saveToBackend = async () => {
      if (isConfirmed && lastSubmitted) {
        try {
          const response = await fetch('http://localhost:5000/api/issuer/issue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipient: lastSubmitted.address,
              skill: "Blockchain Verified Skill", // You can make this dynamic later
              ipfs: "ipfs://QmYourHash",
              issuer: address
            })
          });
          const data = await response.json();
          console.log("Backend Success:", data);
        } catch (err) {
          console.error("Backend Error:", err);
        }
      }
    };

    saveToBackend();
  }, [isConfirmed, lastSubmitted, address]);

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
      // We store the address here so the useEffect knows who was verified
      setLastSubmitted({ address: addressToVerify, hash: txHash })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <section className="grid" style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-header">
          <h2 className="card-title">Search & Issue Skill</h2>
          <p className="card-subtitle">
            Enter a professional skill and the recipient's wallet address to issue a Soulbound Token.
          </p>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="verify-form">
            <label className="verify-label">
              Skill Name
              <input
                className="verify-input"
                type="text"
                placeholder="e.g. Java Developer"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                required
              />
            </label>
  
            <label className="verify-label">
              Recipient Wallet Address
              <input
                className="verify-input"
                type="text"
                placeholder="0x..."
                value={addressToVerify}
                onChange={(e) => setAddressToVerify(e.target.value)}
                required
              />
            </label>
  
            <button
              type="submit"
              className="btn-primary"
              disabled={isPending || isConfirming}
            >
              {isPending || isConfirming ? 'Minting Badge...' : 'Issue Verified Badge'}
            </button>
          </form>
        </div>
      </div>
    </section>
  ); // Closed the return
} // THIS IS THE CRITICAL BRACE THAT CLOSES THE FUNCTION