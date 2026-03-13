import { createConfig, http } from 'wagmi'
import { QueryClient } from '@tanstack/react-query'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
http("https://eth-sepolia.g.alchemy.com/v2/LC4B3y6H7tGgqrZhP6GKd")

// Chains you want CredAstra to support.
// You can change these to the networks where your contracts are deployed.
export const supportedChains = [sepolia, mainnet]

export const wagmiConfig = createConfig({
  chains: supportedChains,
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
})

export const queryClient = new QueryClient()

// Central place to describe your CredAstra Solidity contract.
// Fill this in with the actual deployed address, ABI, and preferred preview function.
export const credAstraContract = {
  // Example: sepolia chain id
  chainId: sepolia.id,

  // TODO: replace with your deployed contract address
  address: '0x0000000000000000000000000000000000000000',

  // TODO: paste your contract ABI here (array from your build artifacts)
  abi: [],

  // Optional: lightweight "preview" read used on the main dashboard and profile.
  // Set functionName to a view function like "getUserScore".
  // If your function takes the connected wallet as first argument, you can
  // derive args from the active address using the args(address) helper.
  previewRead: {
    functionName: null,
    // args: (address) => [address],
  },

  // Optional: configuration for the Verify page.
  // Example:
  // verify: {
  //   functionName: 'verifyAddress',
  //   args: (addressToVerify) => [addressToVerify],
  // },
  verify: undefined,
}

