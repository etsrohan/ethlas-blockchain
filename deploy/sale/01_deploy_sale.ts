import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute } = deployments;

  const { deployer } = await getNamedAccounts();
  const nftAddress = (await ethers.getContract("TestorinoNFT")).address;
  const price = ethers.utils.parseEther("0.01");
  const placeholderURI = "";

  console.log({ deployer });
  await deploy("NFTSale", {
    contract: "NFTSale",
    skipIfAlreadyDeployed: true,
    log: true,
    from: deployer,
    args: [nftAddress, price, placeholderURI],
  });

  const saleAddress = (await ethers.getContract("NFTSale")).address;

  // Set sale contract as an admin on NFT contract
  await execute(
    "TestorinoNFT",
    { from: deployer, log: true },
    "setAdmin",
    saleAddress,
    true
  );
};

export default func;
func.tags = ["NFTSale"];
func.dependencies = ["TestNFT"];
