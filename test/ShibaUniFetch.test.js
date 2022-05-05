// const { ethers } = require("hardhat")
// const { expect } = require("chai")
// const { BigNumber } = ethers
//
// describe("ShibaUniFetch", function () {
//   before(async function () {
//     this.WETH = await ethers.getContractFactory("ERC20Mock")
//     this.xShib = await ethers.getContractFactory("ERC20Mock")
//     this.xLeash = await ethers.getContractFactory("ERC20Mock")
//     this.tBone = await ethers.getContractFactory("ERC20Mock")
//     this.USDC = await ethers.getContractFactory("ERC20Mock")
//     this.leash = await ethers.getContractFactory("ERC20Mock")
//     this.bone = await ethers.getContractFactory("ERC20Mock")
//     this.WBTC = await ethers.getContractFactory("ERC20Mock")
//     this.DAI = await ethers.getContractFactory("ERC20Mock")
//     this.USDT = await ethers.getContractFactory("ERC20Mock")
//     this.ShibaUniFetch = await ethers.getContractFactory("ShibaUniFetch")
//     this.UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory")
//     this.UniswapV2Router02 = await ethers.getContractFactory("UniswapV2Router02")
//
//     this.signers = await ethers.getSigners()
//     this.alice = this.signers[0]
//     this.bob = this.signers[1]
//     this.carol = this.signers[2]
//     this.feeSetter = this.signers[3]
//   })
//
//   beforeEach(async function () {
//     this.weth = await this.WETH.deploy("WETH", "weth", "1000")
//     this.xshib = await this.xShib.deploy("XSHIB", "xshib", "1000")
//     this.xleash = await this.xLeash.deploy("XLEASH", "xleash", "1000")
//     this.tbone = await this.tBone.deploy("TBONE", "tbone", "1000")
//     this.bone = await this.tBone.deploy("BONE", "bone", "1000")
//     this.usdc = await this.USDC.deploy("USDC", "usdc", "1000")
//     this.wbtc = await this.WBTC.deploy("WBTC", "wbtc", "1000")
//     this.dai = await this.DAI.deploy("DAI", "dai", "1000")
//     this.usdt = await this.USDT.deploy("USDT", "usdt", "1000")
//
//     this.oldfactory = await this.UniswapV2Factory.deploy(this.feeSetter.address)
//     this.oldrouter = await this.UniswapV2Router02.deploy(this.oldfactory.address, this.weth.address, this.xshib.address,
//                     this.leash.address, this.bone.address, this.usdc.address, this.wbtc.address, this.dai.address, this.usdt.address)
//
//     this.newfactory = await this.UniswapV2Factory.deploy(this.feeSetter.address)
//     this.newrouter = await this.UniswapV2Router02.deploy(this.newfactory.address, this.weth.address, this.xshib.address,
//                     this.leash.address, this.bone.address, this.usdc.address, this.wbtc.address, this.dai.address, this.usdt.address)
//
//     this.shibuni = await this.ShibaUniFetch.deploy(this.oldrouter.address, this.newrouter.address)
//   })
//
//   it("should initialize correct values", async function () {
//     expect(await this.shibuni.oldRouter()).to.equal(this.oldrouter.address)
//     expect(await this.shibuni.router()).to.equal(this.newrouter.address)
//   })
// })