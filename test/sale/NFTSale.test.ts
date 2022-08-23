import { expect } from "../chai-setup";
import { assert } from "chai";
import { ethers } from "hardhat";
import { setupSale } from "./fixtures";
import { PromiseType } from "utility-types";
import { BigNumberish, BigNumber } from "ethers";

type FixtureType = PromiseType<ReturnType<typeof setupSale>>;
type UserType = FixtureType["deployer"];

describe("TestorinoNFT.sol", () => {
  let deployer: UserType;
  let alice: UserType;
  let admin: UserType;
  let NFT: FixtureType["NFT"];
  let Sale: FixtureType["Sale"];

  beforeEach(async () => {
    // Setup Variables
    ({
      deployer,
      admin,
      users: [alice],
      NFT,
      Sale,
    } = await setupSale());
  });

  it("Sale Init", async () => {
    // Check NFT contract
    assert.equal(await Sale.nftContract(), NFT.address);
    // Check Price
    assert.equal(
      (await Sale.price()).toString(),
      ethers.utils.parseEther("0.1").toString()
    );
    // Check placeholder URI
    assert.equal(await Sale.placeholderURI(), "");
  });
  it("Alice can purchase NFT", async () => {
    const price: BigNumberish = ethers.utils.parseEther("0.1");
    // Alice purchases NFT
    await expect(alice.Sale.purchase({ value: price }))
      .to.emit(Sale, "Sold")
      .withArgs(1, alice.address, price);

    // Check if alice got NFT
    assert.equal(await NFT.ownerOf(1), alice.address);
  });
  it("Cannot purchase at wrong price", async () => {
    let price: BigNumberish = ethers.utils.parseEther("0.05");
    // Alice purchases NFT
    await expect(alice.Sale.purchase({ value: price })).to.be.revertedWith(
      "Insufficient or excess funds"
    );

    price = ethers.utils.parseEther("0.2");
    await expect(alice.Sale.purchase({ value: price })).to.be.revertedWith(
      "Insufficient or excess funds"
    );
  });
  it("Owner can withdraw ETH", async () => {
    // Alice purchases an NFT
    const price: BigNumberish = ethers.utils.parseEther("0.1");
    await alice.Sale.purchase({ value: price });

    // Check Sale balance
    assert.equal(
      (await Sale.provider.getBalance(Sale.address)).toString(),
      price.toString()
    );

    // Owner withdraws eth
    await deployer.Sale.withdrawETH();

    // Sale balance goes to 0
    assert.equal(
      (await Sale.provider.getBalance(Sale.address)).toString(),
      "0"
    );
  });
  it("Admins can set price", async () => {
    // Admin sets new price
    const newPrice: BigNumberish = ethers.utils.parseEther("0.5");
    await admin.Sale.setPrice(newPrice);
    assert.equal((await Sale.price()).toString(), newPrice.toString());

    // Alice purchases NFT at old price
    const price: BigNumberish = ethers.utils.parseEther("0.1");
    await expect(alice.Sale.purchase({ value: price })).to.be.revertedWith(
      "Insufficient or excess funds"
    );

    // Alice purchases NFT at new price
    await expect(alice.Sale.purchase({ value: newPrice }))
      .to.emit(Sale, "Sold")
      .withArgs(1, alice.address, newPrice);
  });
});
