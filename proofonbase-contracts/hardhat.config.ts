// hardhat.config.ts
import * as dotenv from "dotenv";
dotenv.config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// Use a dedicated env var for Base to avoid mixing keys
const PRIVATE_KEY =
  process.env.BASE_PRIVATE_KEY ||
  "0x0000000000000000000000000000000000000000000000000000000000000000";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    // Base Sepolia testnet
    baseSepolia: {
      // Official RPC: https://sepolia.base.org
      // (You can swap to an Alchemy/Infura endpoint if you prefer)
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      chainId: 84532,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    // You can pass a single string if you only verify on BaseScan Sepolia,
    // but keeping the object form is future-proof.
    apiKey: {
      baseSepolia: process.env.BASESCAN_API_KEY || "",
      // (Optional) base: process.env.BASESCAN_MAINNET_API_KEY || ""
    },
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
};

export default config;
