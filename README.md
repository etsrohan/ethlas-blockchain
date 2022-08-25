# **Smart Contracts**

<img alt="Solidity" src="https://img.shields.io/badge/Solidity-e6e6e6?style=for-the-badge&logo=solidity&logoColor=black"> <img alt="Typescipt" src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white">

This repository contains the Hardhat Ethereum development environment for the development, testing and deployment of the Testorino NFT Sale Smart Contracts.

## **Prerequisites**

-   git
-   npm
-   yarn
-   hardhat

## **Getting started**
1.  Clone the repository

```sh
git clone --branch <branch_name> https://github.com/grdmoney/poket_blockchain.git
```

2.  Navigate to `ethlas-blockchain` directory

```sh
cd ethlas-blockchain
```

3.  Install dependencies

```sh
yarn install
```

4.  Configure project (Will add later when deploying to testnet)

```sh
cp .env.example .env
```

## **Compile Smart Contracts**

To compile every smart contract run the following command in your terminal:

```sh
yarn hardhat compile
```

For specific files use :

```sh
yarn hardhat compile src/<contract-folder-name>/<contract-name>.sol
```


## **Run tests**

To run the tests in the test folder run the following command in your terminal:

Note: Running tests automatically compiles any smart contracts

-   To run all tests
```sh
yarn hardhat test
```

-   To run a specific test

```sh
yarn hardhat test test/<folder_name>/<filename>.test.ts
```

## **Deploy to Blockchain Network** (need to add testnets later)

-   To a specific testnet

```sh
yarn hardhat --network <network-name-in-tsconfig> deploy -- tags <deploy-script-tags>
```

-   To local development network (to test deployment)

```sh
yarn hardhat deploy -- tags <deploy-script-tags>
```