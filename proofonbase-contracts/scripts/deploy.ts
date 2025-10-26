import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 Starting contract deployment...");
  console.log(`📡 Network: ${network.name}`);
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with the account:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance));

  // 1) Deploy DIDRegistry
  console.log("\n⏳ Deploying DIDRegistry...");
  const DIDRegistry = await ethers.getContractFactory("DIDRegistry");
  const didRegistry = await DIDRegistry.deploy();
  await didRegistry.waitForDeployment();
  const didRegistryAddress = await didRegistry.getAddress();
  console.log(`✅ DIDRegistry deployed to: ${didRegistryAddress}`);

  // 2) Deploy CredentialIssuer
  console.log("\n⏳ Deploying CredentialIssuer...");
  const CredentialIssuer = await ethers.getContractFactory("CredentialIssuer");
  const credentialIssuer = await CredentialIssuer.deploy();
  await credentialIssuer.waitForDeployment();
  const credentialIssuerAddress = await credentialIssuer.getAddress();
  console.log(`✅ CredentialIssuer deployed to: ${credentialIssuerAddress}`);

  // 3) Deploy Groth16Verifier
  console.log("\n⏳ Deploying Groth16Verifier...");
  const Groth16Verifier = await ethers.getContractFactory("Groth16Verifier");
  const verifier = await Groth16Verifier.deploy();
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();
  console.log(`✅ Groth16Verifier deployed to: ${verifierAddress}`);

  // 4) Deploy AgeGate
  console.log("\n⏳ Deploying AgeGate...");
  const AgeGate = await ethers.getContractFactory("AgeGate");
  const ageGate = await AgeGate.deploy(verifierAddress);
  await ageGate.waitForDeployment();
  const ageGateAddress = await ageGate.getAddress();
  console.log(`✅ AgeGate deployed to: ${ageGateAddress}`);

  // Wait for confirmations
  console.log("\n⏳ Waiting for block confirmations...");
  await didRegistry.deploymentTransaction()?.wait(5);
  console.log("✅ Confirmations received");

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    DIDRegistry: didRegistryAddress,
    CredentialIssuer: credentialIssuerAddress,
    Groth16Verifier: verifierAddress,
    AgeGate: ageGateAddress,
    deploymentTime: new Date().toISOString(),
  };

  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentsDir, `${network.name}-${deploymentInfo.chainId}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`📁 Deployment info saved to: ${deploymentFile}`);

  // Verify DIDRegistry
  console.log("\n🔍 Verifying DIDRegistry...");
  try {
    const hre = require("hardhat");
    await hre.run("verify:verify", {
      address: didRegistryAddress,
      constructorArguments: [],
    });
    console.log("✅ DIDRegistry verified successfully!");
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("ℹ️  DIDRegistry is already verified");
    } else {
      console.error("❌ DIDRegistry verification failed:", error.message);
      console.log(`\n💡 Verify manually: npx hardhat verify --network ${network.name} ${didRegistryAddress}`);
    }
  }

  // Verify CredentialIssuer
  console.log("\n🔍 Verifying CredentialIssuer...");
  try {
    const hre = require("hardhat");
    await hre.run("verify:verify", {
      address: credentialIssuerAddress,
      constructorArguments: [],
    });
    console.log("✅ CredentialIssuer verified successfully!");
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("ℹ️  CredentialIssuer is already verified");
    } else {
      console.error("❌ CredentialIssuer verification failed:", error.message);
      console.log(`\n💡 Verify manually: npx hardhat verify --network ${network.name} ${credentialIssuerAddress}`);
    }
  }

  // Verify Groth16Verifier
  console.log("\n🔍 Verifying Groth16Verifier...");
  try {
    const hre = require("hardhat");
    await hre.run("verify:verify", {
      address: verifierAddress,
      constructorArguments: [],
    });
    console.log("✅ Groth16Verifier verified successfully!");
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("ℹ️  Groth16Verifier is already verified");
    } else {
      console.error("❌ Groth16Verifier verification failed:", error.message);
      console.log(`\n💡 Verify manually: npx hardhat verify --network ${network.name} ${verifierAddress}`);
    }
  }

  // Verify AgeGate
  console.log("\n🔍 Verifying AgeGate...");
  try {
    const hre = require("hardhat");
    await hre.run("verify:verify", {
      address: ageGateAddress,
      constructorArguments: [verifierAddress],
    });
    console.log("✅ AgeGate verified successfully!");
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("ℹ️  AgeGate is already verified");
    } else {
      console.error("❌ AgeGate verification failed:", error.message);
      console.log(`\n💡 Verify manually: npx hardhat verify --network ${network.name} ${ageGateAddress} ${verifierAddress}`);
    }
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Deployment Summary:");
  console.log("================================");
  console.log(`Network: ${deploymentInfo.network} (Chain ID: ${deploymentInfo.chainId})`);
  console.log(`Deployer: ${deploymentInfo.deployer}`);
  console.log(`DIDRegistry: ${didRegistryAddress}`);
  console.log(`CredentialIssuer: ${credentialIssuerAddress}`);
  console.log(`Groth16Verifier: ${verifierAddress}`);
  console.log(`AgeGate: ${ageGateAddress}`);
  console.log(`Deployment Time: ${deploymentInfo.deploymentTime}`);
  console.log("================================");

  return {
    didRegistry: didRegistryAddress,
    credentialIssuer: credentialIssuerAddress,
    verifier: verifierAddress,
    ageGate: ageGateAddress,
    deploymentInfo
  };
}

main()
  .then((result) => {
    console.log("\n✅ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });