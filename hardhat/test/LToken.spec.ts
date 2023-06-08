import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";

async function deployFixture() {
  const [owner, acc1, acc2] = await ethers.getSigners();
  const uTokenFactory = await ethers.getContractFactory("UnknownToken");
  const uToken = await uTokenFactory.deploy();
  const lTokenFactory = await ethers.getContractFactory("LToken");
  const lToken = await lTokenFactory.deploy(uToken.getAddress());
  return { uToken, lToken, owner, acc1, acc2 };
}

describe("LToken contract", function () {
  it("Should set the right owner", async function () {
    const { uToken, lToken, owner, acc1, acc2 } = await loadFixture(deployFixture);

    expect(await lToken.owner()).to.equal(owner.address);
  });
});
