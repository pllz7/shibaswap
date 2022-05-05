const { ethers } = require("hardhat")
const { prepare, deploy, getBigNumber, createSSLP } = require("./utilities")
const { expect } = require("chai")

describe("TreasureFinder", function () {
  before(async function () {
    await prepare(this, ["TreasureFinder", "BuryBone", "TreasureFinderExploitMock", "BuryLeash", "BuryShib", "RevertingERC20Mock", "UniswapV2Factory", "UniswapV2Pair"])
  })

  beforeEach(async function () {
    await deploy(this, [
      ["bone", this.RevertingERC20Mock, ["BONE", "BONE", getBigNumber("10000000")]],
      ["shib", this.RevertingERC20Mock, ["SHIB", "SHIB", getBigNumber("10000000")]],
      ["leash", this.RevertingERC20Mock, ["LEASH", "LEASH", getBigNumber("10000000")]],
      ["weth", this.RevertingERC20Mock, ["WETH", "ETH", getBigNumber("10000000")]],
      ["wbtc", this.RevertingERC20Mock, ["WBTC", "WBTC", getBigNumber("10000000")]],
      ["usdc", this.RevertingERC20Mock, ["USDC", "USDC", getBigNumber("10000000")]],
      ["dai", this.RevertingERC20Mock, ["DAI", "DAI", getBigNumber("10000000")]],
      ["usdt", this.RevertingERC20Mock, ["USDT", "USDT", getBigNumber("10000000")]],
      ["mic", this.RevertingERC20Mock, ["MIC", "MIC", getBigNumber("10000000")]],
      ["strudel", this.RevertingERC20Mock, ["$TRDL", "$TRDL", getBigNumber("10000000")]]
    ])

    await deploy(this, [["factory", this.UniswapV2Factory, [this.alice.address, [
      this.weth.address,
      this.wbtc.address,
      this.usdc.address,
      this.dai.address,
      this.usdt.address,
    ]]]])
    await deploy(this, [["buryBone", this.BuryBone, [this.bone.address]]])
    await deploy(this, [["buryLeash", this.BuryLeash, [this.leash.address]]])
    await deploy(this, [["buryShib", this.BuryShib, [this.shib.address]]])
    
    await deploy(this, [["treasureFinder", this.TreasureFinder, 
      [this.factory.address,
       this.carol.address,
       this.buryBone.address,
       this.buryLeash.address,
       this.buryShib.address,
       this.bone.address,
       this.shib.address,
       this.leash.address,
       this.weth.address]]])
    
    await deploy(this, [["exploiter", this.TreasureFinderExploitMock, [this.treasureFinder.address]]])
    await createSSLP(this, "boneEth", this.bone, this.weth, getBigNumber(10))
    await createSSLP(this, "boneShib", this.bone, this.shib, getBigNumber(10))
    await createSSLP(this, "boneLeash", this.bone, this.leash, getBigNumber(10))
    await createSSLP(this, "strudelEth", this.strudel, this.weth, getBigNumber(10))
    await createSSLP(this, "micEth", this.mic, this.weth, getBigNumber(10))
    await createSSLP(this, "strudelMIC", this.strudel, this.mic, getBigNumber(10))
    await createSSLP(this, "usdcEth", this.usdc, this.weth, getBigNumber(10))
    await createSSLP(this, "usdcWbtc", this.usdc, this.wbtc, getBigNumber(10))
    await createSSLP(this, "micUSDC", this.mic, this.usdc, getBigNumber(10))
    await createSSLP(this, "leashMIC", this.leash, this.mic, getBigNumber(10))
  })
  describe("setBridge", function () {
    it("does not allow to set bridge for Bone", async function () {
      await expect(this.treasureFinder.setBridge(this.bone.address, this.weth.address)).to.be.revertedWith("TreasureFinder: Invalid bridge")
    })

    it("does not allow to set bridge for WETH", async function () {
      await expect(this.treasureFinder.setBridge(this.weth.address, this.bone.address)).to.be.revertedWith("TreasureFinder: Invalid bridge")
    })

    it("does not allow to set bridge to itself", async function () {
      await expect(this.treasureFinder.setBridge(this.dai.address, this.dai.address)).to.be.revertedWith("TreasureFinder: Invalid bridge")
    })

    it("emits correct event on bridge", async function () {
      await expect(this.treasureFinder.setBridge(this.dai.address, this.bone.address))
        .to.emit(this.treasureFinder, "LogBridgeSet")
        .withArgs(this.dai.address, this.bone.address)
    })
  })
  describe("convert", function () {
    it("should convert BONE - ETH", async function () {
      await this.boneEth.transfer(this.treasureFinder.address, getBigNumber(1))
      await this.treasureFinder.convert(this.bone.address, this.weth.address)
      expect(await this.bone.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.weth.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.boneEth.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.weth.balanceOf(this.carol.address)).to.equal("1897569270781234370")
    })

    it("should convert USDC - ETH", async function () {
      await this.usdcEth.transfer(this.treasureFinder.address, getBigNumber(1))
      await this.treasureFinder.convert(this.usdc.address, this.weth.address)
      expect(await this.bone.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.usdc.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.weth.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.usdcEth.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.weth.balanceOf(this.carol.address)).to.equal("1000000000000000000")
      expect(await this.usdc.balanceOf(this.carol.address)).to.equal("1000000000000000000")
    })

    it("should convert USDC - WBTC", async function () {
      await this.usdcWbtc.transfer(this.treasureFinder.address, getBigNumber(1))
      await this.treasureFinder.convert(this.usdc.address, this.wbtc.address)
      expect(await this.bone.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.usdc.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.wbtc.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.usdcWbtc.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.wbtc.balanceOf(this.carol.address)).to.equal("1000000000000000000")
      expect(await this.usdc.balanceOf(this.carol.address)).to.equal("1000000000000000000")
    })

    it("should convert $TRDL - MIC", async function () {
      await this.strudelMIC.transfer(this.treasureFinder.address, getBigNumber(1))
      await this.treasureFinder.convert(this.mic.address, this.strudel.address)
      expect(await this.bone.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.strudel.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.mic.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.strudelMIC.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.bone.balanceOf(this.buryBone.address)).to.equal("510336348141116683")
      expect(await this.shib.balanceOf(this.buryShib.address)).to.equal("484170486252844393")
      expect(await this.leash.balanceOf(this.buryLeash.address)).to.equal("484170486252844393")
    })

    it("should convert BONE - SHIB", async function () {
      await this.boneShib.transfer(this.treasureFinder.address, getBigNumber(1))
      await this.treasureFinder.convert(this.bone.address, this.shib.address)
      expect(await this.bone.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.shib.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.boneShib.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.bone.balanceOf(this.buryBone.address)).to.equal("632523090260411458")
      expect(await this.shib.balanceOf(this.buryShib.address)).to.equal("722113201749481096")
      expect(await this.leash.balanceOf(this.buryLeash.address)).to.equal("593215817587113906")
    })

    it("converts MIC/TRDL using more complex path", async function () {
      await this.strudelMIC.transfer(this.treasureFinder.address, getBigNumber(1))
      await this.treasureFinder.setBridge(this.mic.address, this.strudel.address)
      await this.treasureFinder.convert(this.mic.address, this.strudel.address)
      expect(await this.bone.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.strudelMIC.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.bone.balanceOf(this.buryBone.address)).to.equal("456329008599230235")
      expect(await this.shib.balanceOf(this.buryShib.address)).to.equal("435161895057120223")
      expect(await this.leash.balanceOf(this.buryLeash.address)).to.equal("435161895057120223")
    })

    it("reverts if it loops back", async function () {
      await this.strudelMIC.transfer(this.treasureFinder.address, getBigNumber(1))
      await this.treasureFinder.setBridge(this.strudel.address, this.mic.address)
      await this.treasureFinder.setBridge(this.mic.address, this.strudel.address)
      await expect(this.treasureFinder.convert(this.strudel.address, this.mic.address)).to.be.reverted
    })

    it("reverts if caller is not EOA", async function () {
      await this.boneEth.transfer(this.treasureFinder.address, getBigNumber(1))
      await expect(this.exploiter.convert(this.bone.address, this.weth.address)).to.be.revertedWith("TreasureFinder: must use EOA")
    })

    it("reverts if pair does not exist", async function () {
      await expect(this.treasureFinder.convert(this.mic.address, this.micUSDC.address)).to.be.revertedWith("TreasureFinder: Invalid pair")
    })

    it("reverts if no path is available", async function () {
      await this.leashMIC.transfer(this.treasureFinder.address, getBigNumber(1))
      await expect(this.treasureFinder.convert(this.mic.address, this.leash.address)).to.be.revertedWith("TreasureFinder: Cannot convert")
      expect(await this.bone.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.leashMIC.balanceOf(this.treasureFinder.address)).to.equal(getBigNumber(1))
      expect(await this.bone.balanceOf(this.buryBone.address)).to.equal(0)
    })
  })

  describe("convertMultiple", function () {
    it("should allow to convert multiple", async function () {
      await this.usdcWbtc.transfer(this.treasureFinder.address, getBigNumber(1))
      await this.boneEth.transfer(this.treasureFinder.address, getBigNumber(1))
      await this.treasureFinder.convertMultiple([this.usdc.address, this.bone.address], [this.wbtc.address, this.weth.address])
      expect(await this.bone.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.usdcWbtc.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.boneEth.balanceOf(this.treasureFinder.address)).to.equal(0)
      expect(await this.weth.balanceOf(this.carol.address)).to.equal("1897569270781234370")
      expect(await this.usdc.balanceOf(this.carol.address)).to.equal("1000000000000000000")
      expect(await this.wbtc.balanceOf(this.carol.address)).to.equal("1000000000000000000")
    })
  })
})
