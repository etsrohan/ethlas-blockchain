import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();
  const baseURI = "ipfs://<ipfs-hash>/";
  const cap = 10;
  const revealUntil = 10;

  console.log({ deployer });
  await deploy("TestorinoNFT", {
    contract: "TestorinoNFT",
    skipIfAlreadyDeployed: true,
    log: true,
    from: deployer,
    args: [baseURI, cap, revealUntil],
  });
};

export default func;
func.tags = ["TestNFT"];
