const { ethers } = require("hardhat")
const { expect } = require("chai")

describe("BuryShib", function () {
  before(async function () {
    this.ERC20Mock = await ethers.getContractFactory("ERC20Mock")
    this.BuryShib = await ethers.getContractFactory("BuryShib")

    this.signers = await ethers.getSigners()
    this.alice = this.signers[0]
    this.bob = this.signers[1]
    this.carol = this.signers[2]
  })

  beforeEach(async function () {
    this.erc20 = await this.ERC20Mock.deploy("Test", "TST", "10000000000000000000000000000")
    this.shib = await this.BuryShib.deploy(this.erc20.address)
    await this.erc20.transfer(this.bob.address, "25000000000000000000000000")
    await this.erc20.transfer(this.carol.address, "25000000000000000000000000")
  })

  it("should not allow enter if not enough approve", async function () {
    await expect(this.shib.enter("10000000000000000000000000")).to.be.revertedWith("ERC20: transfer amount exceeds allowance")
    await this.erc20.approve(this.shib.address, "50")
    await expect(this.shib.enter("10000000000000000000000000")).to.be.revertedWith("ERC20: transfer amount exceeds allowance")
    await this.erc20.approve(this.shib.address, "100000000000000000000000000000000000")
    await this.shib.enter("1000000000000000000000000")
    expect(await this.shib.balanceOf(this.alice.address)).to.equal("1000000000000000000000000")
  })

  it("should not allow withraw more than what you have", async function () {
    await this.erc20.approve(this.shib.address, "100000000000000000000000000000000000")
    await this.shib.enter("1000000000000000000000000")
    await expect(this.shib.leave("2000000000000000000000000")).to.be.revertedWith("ERC20: burn amount exceeds balance")
  })

  it("should work with more than one participant", async function () {
    await this.erc20.approve(this.shib.address, "100000000000000000000000000000000000")
    await this.erc20.connect(this.bob).approve(this.shib.address, "100000000000000000000000000000000000", { from: this.bob.address })
    // Alice enters and gets 20 shares. Bob enters and gets 10 shares.
    await this.shib.enter("2000000000000000000000000")
    await this.shib.connect(this.bob).enter("1000000000000000000000000", { from: this.bob.address })
    expect(await this.shib.balanceOf(this.alice.address)).to.equal("2000000000000000000000000")
    expect(await this.shib.balanceOf(this.bob.address)).to.equal("1000000000000000000000000")
    expect(await this.erc20.balanceOf(this.shib.address)).to.equal("3000000000000000000000000")
    // BuryBone get 20 more BONEs from an external source.
    await this.erc20.connect(this.carol).transfer(this.shib.address, "2000000000000000000000000", { from: this.carol.address })
    // Alice deposits 10 more BONEs. She should receive 10*30/50 = 6 shares.
    await this.shib.enter("1000000000000000000000000")
    expect(await this.shib.balanceOf(this.alice.address)).to.equal("2600000000000000000000000")
    expect(await this.shib.balanceOf(this.bob.address)).to.equal("1000000000000000000000000")
    // Bob withdraws 5 shares. He should receive 5*60/36 = 8 shares
    await this.shib.connect(this.bob).leave("5", { from: this.bob.address })
    expect(await this.shib.balanceOf(this.alice.address)).to.equal("2600000000000000000000000")
    expect(await this.shib.balanceOf(this.bob.address)).to.equal("999999999999999999999995")
    expect(await this.erc20.balanceOf(this.shib.address)).to.equal("5999999999999999999999992")
    expect(await this.erc20.balanceOf(this.alice.address)).to.equal("9947000000000000000000000000")
    expect(await this.erc20.balanceOf(this.bob.address)).to.equal("24000000000000000000000008")
  })
})