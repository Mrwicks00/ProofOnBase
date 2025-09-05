// lib/wagmi.ts
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { ADDRESSES } from "./addresses";

// Define Base Sepolia manually
const baseSepolia = {
  id: 84532,
  name: "Base Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia.base.org"] },
  },
  blockExplorers: {
    default: { name: "BaseScan", url: "https://sepolia.basescan.org" },
  },
  testnet: true,
} as const;

export const config = getDefaultConfig({
  appName: "ProofOnBase",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "your-project-id",
  chains: [baseSepolia],
  ssr: true,
});
