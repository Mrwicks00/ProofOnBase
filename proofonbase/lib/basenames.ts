// lib/basenames.ts
import {
  Address,
  createPublicClient,
  encodePacked,
  http,
  keccak256,
  namehash,
} from 'viem';
import { base, mainnet } from 'viem/chains';
import L2ResolverAbi from './abi/L2ResolverAbi';

// Basename L2 Resolver address on Base Mainnet (not Sepolia!)
const BASENAME_L2_RESOLVER_ADDRESS = '0x8c8F1a1e1bFdb15E7ed562efc84e5A588E68aD73' as Address;

// Create clients for Base and Mainnet
const baseClient = createPublicClient({
  chain: base,
  transport: http(),
});

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

// Function to convert reverse node to bytes (from OnchainKit)
function convertReverseNodeToBytes(address: Address, chainId: number): `0x${string}` {
  const reverseNode = namehash(`${address.slice(2).toLowerCase()}.addr.reverse`);
  const chainIdBytes = encodePacked(['uint256'], [BigInt(chainId)]);
  return keccak256(encodePacked(['bytes32', 'bytes32'], [reverseNode, chainIdBytes]));
}

// Function to resolve a Basename on Base Mainnet (chainId: 8453)
// Note: Basenames exist on Base Mainnet, not Base Sepolia
export async function getBasename(address: Address): Promise<string | null> {
  try {
    console.log(`Resolving Basename on Base Mainnet (chainId: ${base.id}) for address:`, address);
    const addressReverseNode = convertReverseNodeToBytes(address, base.id);
    console.log('Reverse node:', addressReverseNode);
    
    const basename = await baseClient.readContract({
      abi: L2ResolverAbi,
      address: BASENAME_L2_RESOLVER_ADDRESS,
      functionName: 'name',
      args: [addressReverseNode],
    });
    
    console.log('Basename resolver response:', basename);
    
    if (basename && basename !== '') {
      return basename as string;
    }
    return null;
  } catch (error) {
    console.error('Error resolving Basename on Base Mainnet:', error);
    return null;
  }
}

// Function to resolve ENS name on Mainnet
export async function getEnsName(address: Address): Promise<string | null> {
  try {
    const ensName = await mainnetClient.getEnsName({ address });
    return ensName || null;
  } catch (error) {
    console.error('Error resolving ENS name:', error);
    return null;
  }
}

// Function to verify reverse resolution (name -> address)
export async function verifyReverseResolution(name: string, expectedAddress: Address): Promise<boolean> {
  try {
    // For Basenames, check on Base
    if (name.endsWith('.base.eth')) {
      const nameHash = namehash(name);
      const resolvedAddress = await baseClient.readContract({
        abi: L2ResolverAbi,
        address: BASENAME_L2_RESOLVER_ADDRESS,
        functionName: 'addr',
        args: [nameHash],
      });
      return resolvedAddress?.toLowerCase() === expectedAddress.toLowerCase();
    }
    
    // For ENS names, check on Mainnet
    const resolvedAddress = await mainnetClient.getEnsAddress({ name });
    return resolvedAddress?.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error('Error verifying reverse resolution:', error);
    return false;
  }
}

// Function to get Basename text record
export async function getBasenameTextRecord(name: string, key: string): Promise<string | null> {
  try {
    const nameHash = namehash(name);
    const textRecord = await baseClient.readContract({
      abi: L2ResolverAbi,
      address: BASENAME_L2_RESOLVER_ADDRESS,
      functionName: 'text',
      args: [nameHash, key],
    });
    
    if (textRecord && textRecord !== '') {
      return textRecord as string;
    }
    return null;
  } catch (error) {
    console.error('Error getting Basename text record:', error);
    return null;
  }
}

// Text record keys for Basenames
export const BasenameTextRecordKeys = {
  Description: 'description',
  Twitter: 'com.twitter',
  GitHub: 'com.github',
  Website: 'url',
  Avatar: 'avatar',
  Email: 'email',
} as const;
