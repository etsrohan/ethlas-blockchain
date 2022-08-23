import {
  ethers,
  deployments,
  getNamedAccounts,
  getUnnamedAccounts,
} from "hardhat";
import { setupUsers, setupUser } from "../utils";
import { TestorinoNFT, NFTSale } from "../../src/types";

export const setupSale = deployments.createFixture(async () => {
  //Deployment Setup
  await deployments.fixture(["TestorinoNFT", "NFTSale"]);
  const NFT = (await ethers.getContract("TestorinoNFT")) as TestorinoNFT;
  const Sale = (await ethers.getContract("NFTSale")) as NFTSale;
  const contracts = { NFT, Sale };

  // Setup Players
  const { deployer: deployerAddress, admin: adminAddress } =
    await getNamedAccounts();
  const unnamedAccounts = await getUnnamedAccounts();
  const users = await setupUsers(unnamedAccounts, contracts);
  const deployer = await setupUser(deployerAddress, contracts);
  const admin = await setupUser(adminAddress, contracts);

  await deployer.Sale.setAdmin(admin.address, true);

  return { users, deployer, admin, ...contracts };
});
