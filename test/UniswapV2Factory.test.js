const { ethers } = require("hardhat")
const { prepare, deploy, getBigNumber, createSSLP } = require("./utilities")
const { expect } = require("chai")

describe("UniswapV2Factory", function () {
    before(async function () {
        await prepare(this, ["RevertingERC20Mock", "UniswapV2Factory", "UniswapV2Pair"])
    })

    beforeEach(async function () {
        await deploy(this, [
            ["bone", this.RevertingERC20Mock, ["BONE", "BONE", getBigNumber("10000000")]],
            ["shib", this.RevertingERC20Mock, ["SHIB", "SHIB", getBigNumber("10000000")]],
            ["weth", this.RevertingERC20Mock, ["WETH", "ETH", getBigNumber("10000000")]]
        ])
        await deploy(this, [["factory", this.UniswapV2Factory, [this.alice.address, [this.weth.address]]]])
        await createSSLP(this, "boneWeth", this.bone, this.weth, getBigNumber(10))
        await createSSLP(this, "boneShib", this.bone, this.shib, getBigNumber(10))
    })

    describe("getFeeInfo", function () {
        it('should get fee for top coin', async function () {
            expect(await this.boneWeth.totalFee()).to.equal(3)
            expect(await this.boneWeth.alpha()).to.equal(1)
            expect(await this.boneWeth.beta()).to.equal(3)
        })

        it('should get fee for regular coin', async function () {
            expect(await this.boneShib.totalFee()).to.equal(3)
            expect(await this.boneShib.alpha()).to.equal(1)
            expect(await this.boneShib.beta()).to.equal(6)
        })
    })

    describe("setTopCoinFee", function () {
        it('should update fee for top coin', async function () {
            await this.factory.setTopCoinFee(4, 1, 5)
            expect(await this.factory.totalFeeTopCoin()).to.equal(4)
            expect(await this.factory.alphaTopCoin()).to.equal(1)
            expect(await this.factory.betaTopCoin()).to.equal(5)
        })

        it('should fail if incorrect values', async function () {
            await expect(this.factory.setTopCoinFee(4, 4, 4)).to.be.revertedWith('UniswapV2: IMPROPER FRACTION')
        })
    })

    describe("setRegularCoinFee", function () {
        it('should update fee for regular coin', async function () {
            await this.factory.setRegularCoinFee(4, 1, 5)
            expect(await this.factory.totalFeeRegular()).to.equal(4)
            expect(await this.factory.alphaRegular()).to.equal(1)
            expect(await this.factory.betaRegular()).to.equal(5)
        })

        it('should fail if incorrect values', async function () {
            await expect(this.factory.setRegularCoinFee(4, 4, 4)).to.be.revertedWith('UniswapV2: IMPROPER FRACTION')
        })
    })

    describe("updatePairFee", function () {
        it('should update fee for top coin', async function () {
            await this.factory.updatePairFee(this.bone.address, this.weth.address, 2, 1, 2)
            expect(await this.boneWeth.totalFee()).to.equal(2)
            expect(await this.boneWeth.alpha()).to.equal(1)
            expect(await this.boneWeth.beta()).to.equal(2)
        })
        
        it('should update fee for regular coin', async function () {
            await this.factory.updatePairFee(this.bone.address, this.shib.address, 4, 1, 5)
            expect(await this.boneShib.totalFee()).to.equal(4)
            expect(await this.boneShib.alpha()).to.equal(1)
            expect(await this.boneShib.beta()).to.equal(5)
        })

        it('should fail if incorrect values', async function () {
            await expect(this.factory.updatePairFee(this.bone.address, this.shib.address, 4, 4, 4)).to.be.revertedWith('UniswapV2: IMPROPER FRACTION')
        })

        it('should fail if incorrect pair', async function () {
            await expect(this.factory.updatePairFee(this.weth.address, this.shib.address, 4, 4, 4)).to.be.revertedWith('UniswapV2: IMPROPER FRACTION')
        })
    })
})