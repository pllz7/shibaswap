const { ethers } = require("hardhat")
const { expect } = require("chai")

describe("BuryLeash", function () {
  before(async function () {
    this.ERC20Mock = await ethers.getContractFactory("ERC20Mock")
    this.BuryLeash = await ethers.getContractFactory("BuryLeash")

    this.signers = await ethers.getSigners()
    this.alice = this.signers[0]
    this.bob = this.signers[1]
    this.carol = this.signers[2]
  })

  beforeEach(async function () {
    this.erc20 = await this.ERC20Mock.deploy("Test", "tst", "10000")
    this.leash = await this.BuryLeash.deploy(this.erc20.address)
    this.erc20.transfer(this.bob.address, "2500")
    this.erc20.transfer(this.carol.address, "2500")
  })

  it("should not allow enter if not enough approve", async function () {
    await expect(this.leash.enter("100")).to.be.revertedWith("ERC20: transfer amount exceeds allowance")
    await this.erc20.approve(this.leash.address, "50")
    await expect(this.leash.enter("100")).to.be.revertedWith("ERC20: transfer amount exceeds allowance")
    await this.erc20.approve(this.leash.address, "100")
    await this.leash.enter("100")
    expect(await this.leash.balanceOf(this.alice.address)).to.equal("100")
  })

  it("should not allow withraw more than what you have", async function () {
    await this.erc20.approve(this.leash.address, "100")
    await this.leash.enter("100")
    await expect(this.leash.leave("200")).to.be.revertedWith("ERC20: burn amount exceeds balance")
  })

  it("should work with more than one participant", async function () {
    await this.erc20.approve(this.leash.address, "100")
    await this.erc20.connect(this.bob).approve(this.leash.address, "100", { from: this.bob.address })
    // Alice enters and gets 20 shares. Bob enters and gets 10 shares.
    await this.leash.enter("20")
    await this.leash.connect(this.bob).enter("10", { from: this.bob.address })
    expect(await this.leash.balanceOf(this.alice.address)).to.equal("20")
    expect(await this.leash.balanceOf(this.bob.address)).to.equal("10")
    expect(await this.erc20.balanceOf(this.leash.address)).to.equal("30")
    // BuryBone get 20 more BONEs from an external source.
    await this.erc20.connect(this.carol).transfer(this.leash.address, "20", { from: this.carol.address })
    // Alice deposits 10 more BONEs. She should receive 10*30/50 = 6 shares.
    await this.leash.enter("10")
    expect(await this.leash.balanceOf(this.alice.address)).to.equal("26")
    expect(await this.leash.balanceOf(this.bob.address)).to.equal("10")
    // Bob withdraws 5 shares. He should receive 5*60/36 = 8 
    await this.leash.connect(this.bob).leave("5", { from: this.bob.address })
    expect(await this.leash.balanceOf(this.alice.address)).to.equal("26")
    expect(await this.leash.balanceOf(this.bob.address)).to.equal("5")
    expect(await this.erc20.balanceOf(this.leash.address)).to.equal("52")
    expect(await this.erc20.balanceOf(this.alice.address)).to.equal("4970")
    expect(await this.erc20.balanceOf(this.bob.address)).to.equal("2498")
  })
})