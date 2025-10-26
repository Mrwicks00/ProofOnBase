// lib/addresses.ts
export const ADDRESSES = {
  baseSepolia: {
    chainId: 84532,
    rpcUrl: "https://sepolia.base.org",
    DIDRegistry: "0x112f5552bD85Bf18709E668d8f1E9E30B7F5C18e",
    CredentialIssuer: "0x204725eF8e5E7CDbaDAB09e78BCB79bdEB75Cc72",
    Groth16Verifier: "0x0B0f01f04D803E5B093c3066f351a7D8BcD70EaF",
    AgeGate: "0x11c468376129B183339aab1A7757A34eFf351467",
  },
} as const;

export type NetworkKey = keyof typeof ADDRESSES;
export const DEFAULT_NETWORK: NetworkKey = "baseSepolia";
