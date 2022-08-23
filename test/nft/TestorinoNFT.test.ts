import { expect } from "../chai-setup";
import { assert } from "chai";
import { ethers } from "hardhat";
import { setupNFT } from "./fixtures";
import { PromiseType } from "utility-types";
import { BigNumberish, BigNumber } from "ethers";

type FixtureType = PromiseType<ReturnType<typeof setupNFT>>;
type UserType = FixtureType["deployer"];

describe("TestorinoNFT.sol", () => {
  let deployer: UserType;
  let alice: UserType;
  let admin: UserType;
  let NFT: FixtureType["NFT"];

  beforeEach(async () => {
    // Setup Variables
    ({
      deployer,
      admin,
      users: [alice],
      NFT,
    } = await setupNFT());
  });

  it("TestorinoNFT Init", async () => {
    // deployer is owner of contract
    assert.equal(await NFT.owner(), deployer.address);
    // NFT name is correct
    assert.equal(await NFT.name(), "TestorinoNFT");
    // NFT symbol is correct
    assert.equal(await NFT.symbol(), "TNFT");
  });
  it("Admin can mint nft", async () => {
    // Admin can mint new NFT
    await expect(admin.NFT.mint(alice.address, "")).to.be.ok;

    // Alice cannot mint
    await expect(alice.NFT.mint(alice.address, "")).to.be.revertedWith(
      "Caller does not have Admin Access"
    );

    // Check owner of NFT tokenId 1
    assert.equal(await NFT.ownerOf(1), alice.address);
  });
  it("Owner can set cap", async () => {
    // Admin sets cap
    await expect(deployer.NFT.setCap(100)).to.emit(NFT, "SetCap").withArgs(100);

    // Admin cannot set cap
    await expect(admin.NFT.setCap(20)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });
});
