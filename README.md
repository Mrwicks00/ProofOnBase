# ProofOnBase

A Zero-Knowledge Proof (ZKP) enabled decentralized identity management system built on Base, featuring privacy-preserving age verification with native Basename/ENS integration and name-based DIDs.

## 🌟 Features

- **Zero-Knowledge Age Verification**: Prove you're over 18 without revealing your exact age or birth date
- **Name-Based DIDs**: Generate human-readable DIDs using Basenames (e.g., `did:pkh:eip155:84532:alice.base.eth`)
- **Basename Integration**: Native support for Base Basenames with ENS fallback
- **Decentralized Identity (DID)**: Create and manage your onchain identity with name metadata
- **Verifiable Credentials**: Issue and verify age credentials with name information
- **QR Code Verification**: Scan QR codes to verify credentials with name display
- **Base Sepolia Deployment**: Fully deployed smart contracts on Base testnet

## 🏗️ Architecture

### Smart Contracts (Base Sepolia)

- **DIDRegistry**: `0x093E7D57E555c620532d7430C09C147674AAE846`
- **CredentialIssuer**: `0xa06E8A95a704C63aC037384D4d7d6F17b30Af`
- **Groth16Verifier**: `0xDde8c98Bc421cf2E456fC77ce66A823ae7f800b4`
- **AgeGate**: `0x5380726B01e85252107d702e28EC6AA82928E0f8`

### Zero-Knowledge Proof System

- **Circom** for circuit compilation and constraint generation
- **SnarkJS** for proof generation and verification
- **Groth16** proving system for efficient verification
- **Age Proof Circuit** (`age_proof.circom`) for age verification logic

### Frontend Stack

- **Next.js 15** with TypeScript
- **Wagmi v2** for blockchain interactions
- **RainbowKit** for wallet connection
- **Tailwind CSS** for styling
- **SnarkJS** for ZK proof generation
- **Redis** for managing sessions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- A Base Sepolia wallet with testnet ETH

### Installation

1. **Clone the repository**

```bash
git clone [<repository-url>](https://github.com/Mrwicks00/ProofOnBase.git)
cd ProofOnBase
```

2. **Install dependencies**

```bash
cd proofonbase
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Add your environment variables:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
BASE_PRIVATE_KEY=your_base_private_key_for_server_operations
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

4. **Start the development server**

```bash
pnpm dev
```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 How It Works

### 1. Identity Registration

- Connect your wallet to Base Sepolia
- System automatically detects your Basename/ENS (if available)
- Register a Decentralized Identifier (DID) onchain with name metadata
- Generate name-based DIDs (e.g., `did:pkh:eip155:84532:alice.base.eth`) when name is verified

### 2. Age Credential Issuance

- Provide your birth date (year, month, day)
- System generates a verifiable credential with name metadata
- Credential proves you're over 18 without revealing exact age
- Name information is included for better UX and verification

### 3. Zero-Knowledge Proof Generation

- Generate a ZK proof using your birth date
- Proof demonstrates age ≥ 18 without revealing birth date
- Uses Groth16 proving system for efficient verification

### 4. Credential Verification

- Scan QR codes to verify credentials (shows name if available)
- Onchain verification using smart contracts
- Instant verification without revealing personal data
- Verification results display subject name for better UX

## 🎯 Basename Integration

### What are Basenames?

Basenames are human-readable names on Base (like `alice.base.eth`) that work across all EVM chains. They're built on ENS technology and provide a foundation for onchain identity.

### Setting Up Your Basename

1. **Get a Basename**

   - Visit [base.org/names](https://base.org/names)
   - Register your desired name (e.g., `yourname.base.eth`)

2. **Set as Primary**

   - Go to "My Basenames"
   - Click ⋯ next to your name
   - Select "Set as primary"
   - Sign the transaction

3. **Use in ProofOnBase**
   - Connect your wallet
   - Your Basename will automatically appear
   - Shows ✓ when properly set as primary

### Fallback Support

- **Basename first**: Resolves names on Base Mainnet
- **ENS fallback**: Falls back to Ethereum Mainnet ENS
- **Wallet-only**: Works without any name

## 📱 Usage Guide

### For Users

1. **Connect Wallet**

   - Click "Connect Wallet"
   - Switch to Base Sepolia network
   - Your Basename/ENS will be detected automatically

2. **Register DID**

   - Click "Register My DID"
   - Sign the transaction
   - Your onchain identity is created

3. **Issue Age Credential**

   - Go to "Issue Credential" tab
   - Enter your birth date
   - Click "Issue Credential"
   - Credential is generated and stored

4. **Generate Proof**

   - Go to "Generate Proof" tab
   - Click "Generate Proof"
   - ZK proof is created using your birth date

5. **Verify Credential**
   - Go to "Verify" tab
   - Scan QR code or enter verification code
   - Instant verification without revealing personal data

### For Developers

#### Smart Contract Integration

```typescript
import { ADDRESSES } from "@/lib/addresses";

// Use deployed contracts
const didRegistry = new ethers.Contract(
  ADDRESSES.baseSepolia.DIDRegistry,
  DIDRegistryABI,
  signer
);
```

#### Basename Resolution

```typescript
import { getBasename, getEnsName } from "@/lib/basenames";

// Resolve Basename on Base Mainnet
const basename = await getBasename(address);

// Fallback to ENS on Ethereum Mainnet
const ensName = await getEnsName(address);
```

## 🔒 Privacy & Security

- **Zero-Knowledge**: Birth dates never leave your device
- **Onchain Verification**: Proofs verified onchain without revealing data
- **Decentralized**: No central authority controls your identity
- **Immutable**: DID registration is permanent and tamper-proof

## 🌐 Network Support

### Primary Network

- **Base Sepolia** (Chain ID: 84532) - Main deployment

### Basename Resolution

- **Base Mainnet** (Chain ID: 8453) - Basename resolution
- **Ethereum Mainnet** (Chain ID: 1) - ENS fallback

## 🛠️ Development

### Project Structure

```
proofonbase/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   └── page.tsx           # Main application
├── components/            # React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
│   ├── abi/              # Smart contract ABIs
│   ├── basenames.ts      # Basename resolution
│   └── wagmi.ts          # Wagmi configuration
└── public/               # Static assets
    └── age_proof_js/     # ZK proof artifacts
```

### Key Files

- `hooks/useBasenameIdentity.ts` - Basename/ENS resolution
- `lib/basenames.ts` - L2 Resolver integration
- `hooks/useDid.ts` - DID management
- `hooks/useProof.ts` - ZK proof generation

### Adding New Features

1. Smart contracts: Add to `proofonbase-contracts/`
2. Frontend: Add components to `components/`
3. Hooks: Add custom logic to `hooks/`
4. API: Add routes to `app/api/`

## 🧪 Testing

### Test with Basenames

1. Get a Basename at [base.org/names](https://base.org/names)
2. Set it as primary
3. Connect wallet to see name resolution

### Test Age Verification

1. Use any birth date from 1990-2010
2. Generate proof
3. Verify using QR code scanner

## 🚀 Deployment

### Frontend (Vercel)

```bash
# Build the project
pnpm build

# Deploy to Vercel
vercel --prod
```

### Smart Contracts

```bash
cd proofonbase-contracts
npx hardhat run scripts/deploy.ts --network baseSepolia
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Base](https://base.org) for the L2 infrastructure
- [ENS](https://ens.domains) for the naming system
- [SnarkJS](https://github.com/iden3/snarkjs) for ZK proof generation
- [Wagmi](https://wagmi.sh) for React hooks
- [RainbowKit](https://rainbowkit.com) for wallet connection

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Documentation**: [Base Docs](https://docs.base.org)

---

**Built with ❤️ on Base**
