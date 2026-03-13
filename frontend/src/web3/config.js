import { createConfig, http } from 'wagmi'
import { QueryClient } from '@tanstack/react-query'
import { polygonAmoy } from 'wagmi/chains' // 1. IMPORT AMOY
import { injected } from 'wagmi/connectors'

// 2. CHANGE SUPPORTED CHAINS TO AMOY
export const supportedChains = [polygonAmoy]

export const wagmiConfig = createConfig({
  chains: supportedChains,
  connectors: [injected()],
  transports: {
    // 3. SET THE TRANSPORT FOR AMOY ID (80002)
    [polygonAmoy.id]: http("https://rpc-amoy.polygon.technology"),
  },
})

export const queryClient = new QueryClient()

export const credAstraContract = {
  chainId: polygonAmoy.id, // 4. USE THE IMPORTED ID
  address: '0x9Dc1c3Ed995D8deF2AEE2DEACE6F4CE071C01800', 
  abi: [
    {
      "constant": true,
      "inputs": [{"name": "_owner", "type": "address"}],
      "name": "balanceOf",
      "outputs": [{"name": "count", "type": "uint256"}],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ],

  previewRead: {
    functionName: 'balanceOf', 
    args: (address) => [address], 
  },

  verify: {
    functionName: 'mintSkill',
    args: (addressToVerify) => [addressToVerify, "https://gateway.pinata.cloud/ipfs/QmVerifiedSkill"],
  },
}