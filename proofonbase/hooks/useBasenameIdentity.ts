// hooks/useBasenameIdentity.ts
"use client";

import { useAccount, useChainId } from "wagmi";
import { base } from "wagmi/chains";
import { useEffect, useState } from "react";
import { getBasename, getEnsName, verifyReverseResolution } from "@/lib/basenames";

type IdentityProfile = {
  address: `0x${string}`;
  name: string | null;                // Basename or ENS
  source: "basename" | "ens" | null;  // where it came from
  reverseOK: boolean;                 // name -> addr equals wallet
  did: string;                        // did:pkh
};

export function useBasenameIdentity() {
  const { address } = useAccount();
  const activeChainId = useChainId();
  const [profile, setProfile] = useState<IdentityProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!address) {
      setProfile(null);
      return;
    }

    const resolveIdentity = async () => {
      setIsLoading(true);
      
      try {
        // 1) Try to resolve Basename on Base first
        console.log("Resolving Basename for address:", address);
        const basename = await getBasename(address);
        console.log("Basename result:", basename);
        
        let name: string | null = null;
        let source: IdentityProfile["source"] = null;
        
        if (basename) {
          name = basename;
          source = "basename";
        } else {
          // 2) Fallback to ENS on Mainnet
          console.log("No Basename found, trying ENS...");
          const ensName = await getEnsName(address);
          console.log("ENS result:", ensName);
          
          if (ensName) {
            name = ensName;
            source = "ens";
          }
        }
        
        // 3) Verify reverse resolution if we found a name
        let reverseOK = false;
        if (name) {
          console.log("Verifying reverse resolution for:", name);
          reverseOK = await verifyReverseResolution(name, address);
          console.log("Reverse verification result:", reverseOK);
        }
        
        const did = `did:pkh:eip155:${activeChainId ?? base.id}:${address}`;
        
        const newProfile: IdentityProfile = {
          address,
          name,
          source,
          reverseOK,
          did,
        };
        
        console.log("Final profile:", newProfile);
        setProfile(newProfile);
        
      } catch (error) {
        console.error("Error resolving identity:", error);
        const did = `did:pkh:eip155:${activeChainId ?? base.id}:${address}`;
        setProfile({
          address,
          name: null,
          source: null,
          reverseOK: false,
          did,
        });
      } finally {
        setIsLoading(false);
      }
    };

    resolveIdentity();
  }, [address, activeChainId]);

  return { profile, isLoading };
}
