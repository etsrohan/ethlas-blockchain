import {
  ethers,
  deployments,
  getNamedAccounts,
  getUnnamedAccounts,
} from "hardhat";
import { setupUsers, setupUser } from "../utils";
import { TestorinoNFT } from "../../src/types";

export const setupNFT = deployments.createFixture(async () => {
  //Deployment Setup
  await deployments.fixture(["TestorinoNFT"]);
  const NFT = (await ethers.getContract("TestorinoNFT")) as TestorinoNFT;
  const contracts = { NFT };

  // Setup Players
  const { deployer: deployerAddress, admin: adminAddress } =
    await getNamedAccounts();
  const unnamedAccounts = await getUnnamedAccounts();
  const users = await setupUsers(unnamedAccounts, contracts);
  const deployer = await setupUser(deployerAddress, contracts);
  const admin = await setupUser(adminAddress, contracts);

  await deployer.NFT.setAdmin(admin.address, true);

  return { users, deployer, admin, ...contracts };
});
