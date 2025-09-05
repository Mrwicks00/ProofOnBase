// lib/wagmi.ts
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, baseSepolia, mainnet } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "ProofOnBase",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "your-project-id",
  chains: [base, baseSepolia, mainnet], // <- add base + mainnet
  ssr: true,
});
