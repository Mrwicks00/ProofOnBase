// hooks/useBasenameIdentity.ts
"use client";

import { useAccount, useChainId, useEnsName, useEnsAddress } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { useEffect, useMemo, useState } from "react";

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

  // 1) Prefer Basename on Base
  const basename = useEnsName({
    address,
    chainId: base.id,
    query: { enabled: !!address },
  });

  // 2) Fallback to L1 ENS if no Basename
  const ens = useEnsName({
    address,
    chainId: mainnet.id,
    query: { enabled: !!address && !basename.data },
  });

  const name = useMemo(() => basename.data ?? ens.data ?? null, [basename.data, ens.data]);
  const source: IdentityProfile["source"] = basename.data ? "basename" : ens.data ? "ens" : null;

  // 3) Forward verification (name -> address)
  const forward = useEnsAddress({
    name: name ?? undefined,
    chainId: mainnet.id,               // .eth resolves on L1; basenames are bridged
    query: { enabled: !!name },
  });

  const reverseOK =
    !!address && !!forward.data && forward.data.toLowerCase() === address?.toLowerCase();

  useEffect(() => {
    if (!address) return setProfile(null);
    const did = `did:pkh:eip155:${activeChainId ?? base.id}:${address}`;
    setProfile({ address, name, source, reverseOK, did });
  }, [address, activeChainId, name, source, reverseOK]);

  return { profile, isLoading: !address || basename.isFetching || ens.isFetching };
}
