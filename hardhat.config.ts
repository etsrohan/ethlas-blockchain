import { HardhatUserConfig } from "hardhat/types";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import * as dotenv from "dotenv";
import "@typechain/hardhat";
dotenv.config();
import "@nomiclabs/hardhat-etherscan";
import "solidity-coverage";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/5771fa5944764406a994e4800c31a3fa",
      chainId: 4,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
    },
  },
  namedAccounts: {
    deployer: 0,
    admin: 1,
  },
  paths: {
    sources: "src",
  },
  typechain: {
    outDir: "src/types",
    target: "ethers-v5",
  },
};
export default config;
