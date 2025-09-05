// lib/addresses.ts
export const ADDRESSES = {
  baseSepolia: {
    chainId: 84532,
    rpcUrl: "https://sepolia.base.org",
    DIDRegistry: "0x093E7D57E555c620532d7430C09C147674AAE846",
    CredentialIssuer: "0xa06E8A95a704C63A63aC037384D4d7d6F17b30Af",
    Groth16Verifier: "0xDde8c98Bc421cf2E456fC77ce66A823ae7f800b4",
    AgeGate: "0x5380726B01e85252107d702e28EC6AA82928E0f8",
  },
} as const;

export type NetworkKey = keyof typeof ADDRESSES;
export const DEFAULT_NETWORK: NetworkKey = "baseSepolia";
