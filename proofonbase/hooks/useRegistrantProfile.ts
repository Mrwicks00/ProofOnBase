// hooks/useRegistrantProfile.ts
import { useAccount, useChainId, useEnsName, useEnsAddress } from "wagmi";
import { mainnet, base, baseSepolia } from "wagmi/chains";
import { useEffect, useMemo, useState } from "react";

type Profile = {
  address: `0x${string}`;
  ensName: string | null;
  reverseOK: boolean;
  did: string;
  records?: Record<string, string | null>;
};

export function useRegistrantProfile() {
  const { address } = useAccount();
  const chainId = useChainId();
  const [profile, setProfile] = useState<Profile | null>(null);

  // Try L2 (Base) primary name first, fallback to L1 ENS
  const ensOnBase = useEnsName({
    address,
    chainId: base.id,
    query: { enabled: !!address },
  });

  const ensOnL1 = useEnsName({
    address,
    chainId: mainnet.id,
    query: { enabled: !!address && !ensOnBase.data },
  });

  const ensName = useMemo(
    () => ensOnBase.data ?? ensOnL1.data ?? null,
    [ensOnBase.data, ensOnL1.data]
  );

  // If we found a name, confirm it resolves back to the address (forward check)
  const forward = useEnsAddress({
    name: ensName ?? undefined,
    chainId: mainnet.id, // forward lookups for .eth on L1; basenames are bridged
    query: { enabled: !!ensName },
  });

  const reverseOK =
    !!address &&
    !!forward.data &&
    forward.data.toLowerCase() === address?.toLowerCase();

  useEffect(() => {
    if (!address) return setProfile(null);

    // Use Base Sepolia chain ID for testnet, Base mainnet for production
    const currentChainId = chainId ?? baseSepolia.id;
    const did = `did:pkh:eip155:${currentChainId}:${address}`;

    // If no ENS/Basename, ensName=null and reverseOK=false — still valid!
    setProfile({
      address,
      ensName,
      reverseOK,
      did,
    });
  }, [address, chainId, ensName, reverseOK]);

  return {
    profile,
    isLoading: !address || ensOnBase.isFetching || ensOnL1.isFetching,
  };
}
