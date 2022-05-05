const { ethers } = require("hardhat")
const { expect } = require("chai")
const { time } = require("./utilities")

describe("TopDog", function () {
  before(async function () {
    this.signers = await ethers.getSigners()
    this.alice = this.signers[0]
    this.bob = this.signers[1]
    this.carol = this.signers[2]
    this.devWallet = this.signers[3]
    this.minter = this.signers[4]
    this.marketingWallet = this.signers[5]
    this.adminWallet = this.signers[6]
    this.emergencyWallet = this.signers[7]


    this.TopDog = await ethers.getContractFactory("TopDog")
    this.BoneToken = await ethers.getContractFactory("BoneToken")
    this.BoneLocker = await ethers.getContractFactory("BoneLocker")
    this.DevBoneDistributor = await ethers.getContractFactory("DevBoneDistributor")
    this.tBoneBoneDistributor = await ethers.getContractFactory("tBoneBoneDistributor")
    this.xShibBoneDistributor = await ethers.getContractFactory("xShibBoneDistributor")
    this.xLeashBoneDistributor = await ethers.getContractFactory("xLeashBoneDistributor")
    this.ERC20Mock = await ethers.getContractFactory("ERC20Mock", this.minter)
  })

  beforeEach(async function () {
    this.bone = await this.BoneToken.deploy()
    this.boneLocker = await this.BoneLocker.deploy(this.bone.address, this.emergencyWallet.address, 1, 1);
    this.devBoneDistributorRef = await this.DevBoneDistributor.deploy(this.bone.address, this.boneLocker.address, this.devWallet.address, this.marketingWallet.address, this.adminWallet.address);
    this.tBoneBoneDistributorRef = await this.tBoneBoneDistributor.deploy(this.bone.address);
    this.xShibBoneDistributorRef = await this.xShibBoneDistributor.deploy(this.bone.address);
    this.xLeashBoneDistributorRef = await this.xLeashBoneDistributor.deploy(this.bone.address);

    await this.bone.deployed()
    await this.boneLocker.deployed()
    await this.devBoneDistributorRef.deployed()
    await this.tBoneBoneDistributorRef.deployed()
    await this.xShibBoneDistributorRef.deployed()
    await this.xLeashBoneDistributorRef.deployed()
  })

  it("should set correct state variables", async function () {
    this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "1000", "0", "1000")
    await this.topDog.deployed()

    await this.bone.transferOwnership(this.topDog.address)

    const bone = await this.topDog.bone()
    const devBoneDistributorAddr = await this.topDog.devBoneDistributor()
    const owner = await this.bone.owner()

    const xShibBoneDistributor = await this.topDog.xShibBoneDistributor();
    const xLeashBoneDistributor = await this.topDog.xLeashBoneDistributor();
    const tBoneBoneDistributor = await this.topDog.tBoneBoneDistributor();

    expect(bone).to.equal(this.bone.address)
    expect(devBoneDistributorAddr).to.equal(this.devBoneDistributorRef.address)
    expect(owner).to.equal(this.topDog.address)
    expect(xShibBoneDistributor).to.equal(this.xShibBoneDistributorRef.address)
    expect(xLeashBoneDistributor).to.equal(this.xLeashBoneDistributorRef.address)
    expect(tBoneBoneDistributor).to.equal(this.tBoneBoneDistributorRef.address)
  })

  it("update rewards address", async function () {
    this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "1000", "0", "1000")
    await this.topDog.deployed()

    await this.bone.transferOwnership(this.topDog.address)
    await this.topDog.boneLockerUpdate(this.alice.address)
    await this.topDog.devBoneDistributorUpdate(this.bob.address)
    await this.topDog.tBoneBoneDistributorUpdate(this.carol.address)
    await this.topDog.xShibBoneDistributorUpdate(this.devWallet.address)
    await this.topDog.xLeashBoneDistributorUpdate(this.minter.address)


    const boneLocker = await this.topDog.boneLocker();
    expect(boneLocker).to.equal(this.alice.address)

    const devBoneDistributor = await this.topDog.devBoneDistributor();
    expect(devBoneDistributor).to.equal(this.bob.address)

    const tBoneBoneDistributor = await this.topDog.tBoneBoneDistributor();
    expect(tBoneBoneDistributor).to.equal(this.carol.address)

    const xShibBoneDistributor = await this.topDog.xShibBoneDistributor();
    expect(xShibBoneDistributor).to.equal(this.devWallet.address)

    const xLeashBoneDistributor = await this.topDog.xLeashBoneDistributor();
    expect(xLeashBoneDistributor).to.equal(this.minter.address)

  })

  it("should set correct reward percent vaules", async function () {
    this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "1000", "0", "1000")
    await this.topDog.deployed()

    const devPercent = await this.topDog.devPercent();
    const shibPercent = await this.topDog.xShibPercent();
    const leashPercent = await this.topDog.xLeashPercent();
    const bonePercent = await this.topDog.tBonePercent();

    expect(devPercent).to.equal("10")
    expect(shibPercent).to.equal("3")
    expect(leashPercent).to.equal("1")
    expect(bonePercent).to.equal("1")
  })

  it("update reward percent vaules", async function () {
    this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "1000", "0", "1000")
    await this.topDog.deployed()

    await this.bone.transferOwnership(this.topDog.address)
    await this.topDog.devPercentUpdate(2);
    await this.topDog.tBonePercentUpdate(3);
    await this.topDog.xShibPercentUpdate(4);
    await this.topDog.xLeashPercentUpdate(5);
    await this.topDog.setRewardMintPercent(60);
    await this.topDog.setDevRewardMintPercent(0);


    const devPercent = await this.topDog.devPercent();
    const tbonePercent = await this.topDog.tBonePercent();
    const xshibPercent = await this.topDog.xShibPercent();
    const xleashPercent = await this.topDog.xLeashPercent();
    const rewardMintPercent = await this.topDog.rewardMintPercent();
    const devRewardMintPercent = await this.topDog.devRewardMintPercent();

    expect(devPercent).to.equal(2)
    expect(tbonePercent).to.equal(3)
    expect(xshibPercent).to.equal(4)
    expect(xleashPercent).to.equal(5)
    expect(rewardMintPercent).to.equal(60)
    expect(devRewardMintPercent).to.equal(0)
  })

  it("should allow dev and only dev to update dev", async function () {
    this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "1000", "0", "1000")
    await this.topDog.deployed()

    expect(await this.topDog.devBoneDistributor()).to.equal(this.devBoneDistributorRef.address)

    await expect(this.topDog.connect(this.bob).devBoneDistributorUpdate(this.bob.address, { from: this.bob.address })).to.be.revertedWith("Ownable: caller is not the owner")

    await this.topDog.devBoneDistributorUpdate(this.bob.address)

    expect(await this.topDog.devBoneDistributor()).to.equal(this.bob.address)

    await this.topDog.devBoneDistributorUpdate(this.alice.address)

    expect(await this.topDog.devBoneDistributor()).to.equal(this.alice.address)
  })

  context("With ERC/LP token added to the field", function () {
    beforeEach(async function () {
      this.lp = await this.ERC20Mock.deploy("LPToken", "LP", "10000000000")

      await this.lp.transfer(this.alice.address, "1000")

      await this.lp.transfer(this.bob.address, "1000")

      await this.lp.transfer(this.carol.address, "1000")

      this.lp2 = await this.ERC20Mock.deploy("LPToken2", "LP2", "10000000000")

      await this.lp2.transfer(this.alice.address, "1000")

      await this.lp2.transfer(this.bob.address, "1000")

      await this.lp2.transfer(this.carol.address, "1000")
    })

    it("should allow emergency withdraw", async function () {
      // 100 per block farming rate starting at block 100 with bonus until block 1000
      this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "1000", "0", "1000")
      await this.topDog.deployed()

      await this.topDog.add("100", this.lp.address, true)

      await this.lp.connect(this.bob).approve(this.topDog.address, "1000", { from: this.bob.address })

      await this.topDog.connect(this.bob).deposit(0, "100", { from: this.bob.address })

      expect(await this.lp.balanceOf(this.bob.address)).to.equal("900")

      await this.topDog.connect(this.bob).emergencyWithdraw(0, { from: this.bob.address })

      expect(await this.lp.balanceOf(this.bob.address)).to.equal("1000")
    })

    it("should give out BONEs only after farming time", async function () {
      // 100 per block farming rate starting at block 100 with bonus until block 1000
      this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "100", "100", "1000")
      await this.topDog.deployed()

      await this.bone.transferOwnership(this.topDog.address)
      await this.boneLocker.transferOwnership(this.topDog.address)

      await this.topDog.add("100", this.lp.address, true)

      await this.lp.connect(this.bob).approve(this.topDog.address, "1000", { from: this.bob.address })
      await this.topDog.connect(this.bob).deposit(0, "100", { from: this.bob.address })
      await time.advanceBlockTo("89")

      await this.topDog.connect(this.bob).deposit(0, "0", { from: this.bob.address }) // block 90
      expect(await this.bone.balanceOf(this.bob.address)).to.equal("0")
      await time.advanceBlockTo("94")

      await this.topDog.connect(this.bob).deposit(0, "0", { from: this.bob.address }) // block 95
      expect(await this.bone.balanceOf(this.bob.address)).to.equal("0")
      await time.advanceBlockTo("99")

      await this.topDog.connect(this.bob).deposit(0, "0", { from: this.bob.address }) // block 100
      expect(await this.bone.balanceOf(this.bob.address)).to.equal("0")
      await time.advanceBlockTo("100")

      await this.topDog.connect(this.bob).deposit(0, "0", { from: this.bob.address }) // block 101
      expect(await this.bone.balanceOf(this.bob.address)).to.equal("330")

      await time.advanceBlockTo("104")
      await this.topDog.connect(this.bob).deposit(0, "0", { from: this.bob.address }) // block 105

      expect(await this.bone.balanceOf(this.bob.address)).to.equal("1650")
      // expect(await this.bone.balanceOf(this.dev.address)).to.equal("250")
      expect(await this.bone.totalSupply()).to.equal("5750")
    })

    it("should not distribute BONEs if no one deposit", async function () {
      // 100 per block farming rate starting at block 200 with bonus until block 1000
      this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "1000", "0", "1000")
      await this.topDog.deployed()

      await this.bone.transferOwnership(this.topDog.address)
      await this.boneLocker.transferOwnership(this.topDog.address)
      
      await this.topDog.add("100", this.lp.address, true)
      await this.lp.connect(this.bob).approve(this.topDog.address, "1000", { from: this.bob.address })
      await time.advanceBlockTo("199")
      expect(await this.bone.totalSupply()).to.equal("0")
      await time.advanceBlockTo("204")
      expect(await this.bone.totalSupply()).to.equal("0")
      await time.advanceBlockTo("209")
      await this.topDog.connect(this.bob).deposit(0, "10", { from: this.bob.address }) // block 210
      expect(await this.bone.totalSupply()).to.equal("0")
      expect(await this.bone.balanceOf(this.bob.address)).to.equal("0")
      expect(await this.bone.balanceOf(this.devBoneDistributorRef.address)).to.equal("0")
      expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("0")
      expect(await this.bone.balanceOf(this.tBoneBoneDistributorRef.address)).to.equal("0")
      expect(await this.bone.balanceOf(this.xShibBoneDistributorRef.address)).to.equal("0")
      expect(await this.bone.balanceOf(this.xLeashBoneDistributorRef.address)).to.equal("0")
      expect(await this.lp.balanceOf(this.bob.address)).to.equal("990")
      await time.advanceBlockTo("219")
      await this.topDog.connect(this.bob).withdraw(0, "10", { from: this.bob.address }) // block 220
      expect(await this.bone.totalSupply()).to.equal("115000")
      expect(await this.bone.balanceOf(this.bob.address)).to.equal("33000")
      expect(await this.bone.balanceOf(this.devBoneDistributorRef.address)).to.equal("5000")
      expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("72000")
      expect(await this.bone.balanceOf(this.tBoneBoneDistributorRef.address)).to.equal("1000")
      expect(await this.bone.balanceOf(this.xShibBoneDistributorRef.address)).to.equal("3000")
      expect(await this.bone.balanceOf(this.xLeashBoneDistributorRef.address)).to.equal("1000")
      expect(await this.lp.balanceOf(this.bob.address)).to.equal("1000")
    })

    it("should distribute BONEs properly for each staker", async function () {
      // 100 per block farming rate starting at block 300 with bonus until block 1000
      this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "1000", "0", "1000")
      await this.topDog.deployed()
      await this.bone.transferOwnership(this.topDog.address)
      await this.boneLocker.transferOwnership(this.topDog.address)

      await this.topDog.add("100", this.lp.address, true)
      await this.lp.connect(this.alice).approve(this.topDog.address, "1000", {
        from: this.alice.address,
      })
      await this.lp.connect(this.bob).approve(this.topDog.address, "1000", {
        from: this.bob.address,
      })
      await this.lp.connect(this.carol).approve(this.topDog.address, "1000", {
        from: this.carol.address,
      })
      // Alice deposits 10 LPs at block 310
      await time.advanceBlockTo("309")
      await this.topDog.connect(this.alice).deposit(0, "10", { from: this.alice.address })
      // Bob deposits 20 LPs at block 314
      await time.advanceBlockTo("313")
      await this.topDog.connect(this.bob).deposit(0, "20", { from: this.bob.address })
      // Carol deposits 30 LPs at block 318
      await time.advanceBlockTo("317")
      await this.topDog.connect(this.carol).deposit(0, "30", { from: this.carol.address })
      // Alice deposits 10 more LPs at block 320. At this point:
      //   Alice should have: 4*1000 + 4*1/3*1000 + 2*1/6*1000 = 5100
      //   TopDog should have the remaining: 10000 - 5100 - 1000= 3900
      await time.advanceBlockTo("319")
      await this.topDog.connect(this.alice).deposit(0, "10", { from: this.alice.address })
      expect(await this.bone.totalSupply()).to.equal("115000")
      expect(await this.bone.balanceOf(this.alice.address)).to.equal("18699")
      expect(await this.bone.balanceOf(this.bob.address)).to.equal("0")
      expect(await this.bone.balanceOf(this.carol.address)).to.equal("0")
      expect(await this.bone.balanceOf(this.topDog.address)).to.equal("43334")
      expect(await this.bone.balanceOf(this.devBoneDistributorRef.address)).to.equal("5000")
      expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("42967")
      expect(await this.bone.balanceOf(this.tBoneBoneDistributorRef.address)).to.equal("1000")
      expect(await this.bone.balanceOf(this.xShibBoneDistributorRef.address)).to.equal("3000")
      expect(await this.bone.balanceOf(this.xLeashBoneDistributorRef.address)).to.equal("1000")

      // Bob withdraws 5 LPs at block 330. At this point:
      //   Bob should have: 4*2/3*1000 + 2*2/6*1000 + 10*2/7*1000 = 6190
      await time.advanceBlockTo("329")
      await this.topDog.connect(this.bob).withdraw(0, "5", { from: this.bob.address })
      expect(await this.bone.totalSupply()).to.equal("230000")
      expect(await this.bone.balanceOf(this.alice.address)).to.equal("18699")
      expect(await this.bone.balanceOf(this.bob.address)).to.equal("20428")
      expect(await this.bone.balanceOf(this.carol.address)).to.equal("0")
      expect(await this.bone.balanceOf(this.topDog.address)).to.equal("81430")
      expect(await this.bone.balanceOf(this.devBoneDistributorRef.address)).to.equal("10000")
      expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("89443")
      expect(await this.bone.balanceOf(this.tBoneBoneDistributorRef.address)).to.equal("2000")
      expect(await this.bone.balanceOf(this.xShibBoneDistributorRef.address)).to.equal("6000")
      expect(await this.bone.balanceOf(this.xLeashBoneDistributorRef.address)).to.equal("2000")

      // Alice withdraws 20 LPs at block 340.
      // Bob withdraws 15 LPs at block 350.
      // Carol withdraws 30 LPs at block 360.
      await time.advanceBlockTo("339")
      await this.topDog.connect(this.alice).withdraw(0, "20", { from: this.alice.address })
      await time.advanceBlockTo("349")
      await this.topDog.connect(this.bob).withdraw(0, "15", { from: this.bob.address })
      await time.advanceBlockTo("359")
      await this.topDog.connect(this.carol).withdraw(0, "30", { from: this.carol.address })
      expect(await this.bone.totalSupply()).to.equal("575000")
      // Alice should have: 5666 + 10*2/7*1000 + 10*2/6.5*1000 = 11600
      expect(await this.bone.balanceOf(this.alice.address)).to.equal("38281")
      // Bob should have: 6190 + 10*1.5/6.5 * 1000 + 10*1.5/4.5*1000 = 11831
      expect(await this.bone.balanceOf(this.bob.address)).to.equal("39043")
      // Carol should have: 2*3/6*1000 + 10*3/7*1000 + 10*3/6.5*1000 + 10*3/4.5*1000 + 10*1000 = 26568
      expect(await this.bone.balanceOf(this.carol.address)).to.equal("87673")
      expect(await this.bone.balanceOf(this.devBoneDistributorRef.address)).to.equal("25000")
      expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("360001")
      expect(await this.bone.balanceOf(this.tBoneBoneDistributorRef.address)).to.equal("5000")
      expect(await this.bone.balanceOf(this.xShibBoneDistributorRef.address)).to.equal("15000")
      expect(await this.bone.balanceOf(this.xLeashBoneDistributorRef.address)).to.equal("5000")
      // All of them should have 1000 LPs back.
      expect(await this.lp.balanceOf(this.alice.address)).to.equal("1000")
      expect(await this.lp.balanceOf(this.bob.address)).to.equal("1000")
      expect(await this.lp.balanceOf(this.carol.address)).to.equal("1000")
    })

    it("should give proper BONEs allocation to each pool", async function () {
      // 100 per block farming rate starting at block 400 with bonus until block 1000
      this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "100", "400", "1000")
      // this.topDog = await this.TopDog.deploy(this.bone.address, this.dev.address, , this.xShib.address, this.xLeash.address, this.tBone.address)
      await this.bone.transferOwnership(this.topDog.address)
      await this.boneLocker.transferOwnership(this.topDog.address)

      await this.lp.connect(this.alice).approve(this.topDog.address, "1000", { from: this.alice.address })
      await this.lp2.connect(this.bob).approve(this.topDog.address, "1000", { from: this.bob.address })
      // Add first LP to the pool with allocation 1
      await this.topDog.add("10", this.lp.address, true)
      // Alice deposits 10 LPs at block 410
      await time.advanceBlockTo("409")
      await this.topDog.connect(this.alice).deposit(0, "10", { from: this.alice.address })
      // Add LP2 to the pool with allocation 2 at block 420
      await time.advanceBlockTo("419")
      await this.topDog.add("20", this.lp2.address, true)
      // Alice should have 10*1000 pending reward
      expect(await this.topDog.pendingBone(0, this.alice.address)).to.equal("10000")
      // Bob deposits 10 LP2s at block 425
      await time.advanceBlockTo("424")
      await this.topDog.connect(this.bob).deposit(1, "5", { from: this.bob.address })
      // Alice should have 10000 + 5*1/3*1000 = 11666 pending reward
      expect(await this.topDog.pendingBone(0, this.alice.address)).to.equal("11666")
      await time.advanceBlockTo("430")
      // At block 430. Bob should get 5*2/3*1000 = 3333. Alice should get ~1666 more.
      expect(await this.topDog.pendingBone(0, this.alice.address)).to.equal("13333")
      expect(await this.topDog.pendingBone(1, this.bob.address)).to.equal("3333")
    })

    it("should stop giving bonus BONEs after the bonus period ends", async function () {
      // 100 per block farming rate starting at block 500 with bonus until block 600
      this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "100", "500", "600")
      await this.bone.transferOwnership(this.topDog.address)
      await this.boneLocker.transferOwnership(this.topDog.address)

      await this.lp.connect(this.alice).approve(this.topDog.address, "1000", { from: this.alice.address })
      await this.topDog.add("1", this.lp.address, true)
      // Alice deposits 10 LPs at block 590
      await time.advanceBlockTo("589")
      await this.topDog.connect(this.alice).deposit(0, "10", { from: this.alice.address })
      // At block 605, she should have 1000*10 + 100*5 = 10500 pending.
      await time.advanceBlockTo("605")
      expect(await this.topDog.pendingBone(0, this.alice.address)).to.equal("10500")
      // At block 606, Alice withdraws all pending rewards and should get 10600.
      await this.topDog.connect(this.alice).deposit(0, "0", { from: this.alice.address })
      expect(await this.topDog.pendingBone(0, this.alice.address)).to.equal("0")
      expect(await this.bone.balanceOf(this.alice.address)).to.equal("3498")
    })

    it("should distribute dev fee properly", async function () {
      // 100 per block farming rate starting at block 700 with bonus until block 900
      this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "100", "700", "900")
      await this.bone.transferOwnership(this.topDog.address)
      await this.boneLocker.transferOwnership(this.topDog.address)

      await this.lp.connect(this.alice).approve(this.topDog.address, "1000", { from: this.alice.address })
      await this.topDog.add("1", this.lp.address, true)
      await time.advanceBlockTo("684")
      await this.topDog.connect(this.alice).deposit(0, "10", { from: this.alice.address })
      await time.advanceBlockTo("705")

      expect(await this.topDog.pendingBone(0, this.alice.address)).to.equal("5000")
      await this.topDog.connect(this.alice).deposit(0, "0", { from: this.alice.address })
      expect(await this.topDog.pendingBone(0, this.alice.address)).to.equal("0")
      expect(await this.bone.balanceOf(this.alice.address)).to.equal("1980")

      expect(await this.bone.balanceOf(this.devBoneDistributorRef.address)).to.equal("300")
      expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("4320")
      expect(await this.bone.balanceOf(this.xShibBoneDistributorRef.address)).to.equal("180")
      expect(await this.bone.balanceOf(this.tBoneBoneDistributorRef.address)).to.equal("60")
      expect(await this.bone.balanceOf(this.xLeashBoneDistributorRef.address)).to.equal("60")
    })

    it("should distribute dev fee properly when update reward percent", async function () {
      // 100 per block farming rate starting at block 900 with bonus until block 1000
      this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "100", "900", "1000")
      await this.bone.transferOwnership(this.topDog.address)
      await this.boneLocker.transferOwnership(this.topDog.address)

      await this.lp.connect(this.alice).approve(this.topDog.address, "1000", { from: this.alice.address })
      await this.topDog.add("1", this.lp.address, true)
      await time.advanceBlockTo("884")

      await expect(this.topDog.devPercentUpdate(20)).to.be.revertedWith("topDog: Percent too high")

      await this.topDog.devPercentUpdate(5);
      await this.topDog.tBonePercentUpdate(5);
      await this.topDog.xShibPercentUpdate(5);
      await this.topDog.xLeashPercentUpdate(5);

      await this.topDog.connect(this.alice).deposit(0, "10", { from: this.alice.address })
      await time.advanceBlockTo("905")

      expect(await this.topDog.pendingBone(0, this.alice.address)).to.equal("5000")
      await this.topDog.connect(this.alice).deposit(0, "0", { from: this.alice.address })
      expect(await this.topDog.pendingBone(0, this.alice.address)).to.equal("0")
      expect(await this.bone.balanceOf(this.alice.address)).to.equal("1980")

      expect(await this.bone.balanceOf(this.devBoneDistributorRef.address)).to.equal("150")
      expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("4170")
      expect(await this.bone.balanceOf(this.xShibBoneDistributorRef.address)).to.equal("300")
      expect(await this.bone.balanceOf(this.tBoneBoneDistributorRef.address)).to.equal("300")
      expect(await this.bone.balanceOf(this.xLeashBoneDistributorRef.address)).to.equal("300")
    })

    it("should update reward per block properly", async function () {
      // 100 per block farming rate starting at block 1100 with bonus until block 12000
      this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "100", "1100", "12000")
      await this.bone.transferOwnership(this.topDog.address)
      await this.boneLocker.transferOwnership(this.topDog.address)

      await this.lp.connect(this.alice).approve(this.topDog.address, "1000", { from: this.alice.address })
      await this.topDog.add("1", this.lp.address, true)
      await time.advanceBlockTo("984")
      await this.topDog.updateRewardPerBlock("200");
      await this.topDog.connect(this.alice).deposit(0, "10", { from: this.alice.address })
      await time.advanceBlockTo("1105")
      
      expect(await this.topDog.pendingBone(0, this.alice.address)).to.equal("10000")
      await this.topDog.connect(this.alice).deposit(0, "0", { from: this.alice.address })
      expect(await this.topDog.pendingBone(0, this.alice.address)).to.equal("0")
      expect(await this.bone.balanceOf(this.alice.address)).to.equal("3960")

      expect(await this.bone.balanceOf(this.devBoneDistributorRef.address)).to.equal("600")
      expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("8640")
      expect(await this.bone.balanceOf(this.xShibBoneDistributorRef.address)).to.equal("360")
      expect(await this.bone.balanceOf(this.tBoneBoneDistributorRef.address)).to.equal("120")
      expect(await this.bone.balanceOf(this.xLeashBoneDistributorRef.address)).to.equal("120")
    })

    it("should update reward address properly", async function () {
      // 100 per block farming rate starting at block 1300 with bonus until block 1400
      this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "100", "1300", "1400")
      await this.bone.transferOwnership(this.topDog.address)
      await this.boneLocker.transferOwnership(this.topDog.address)

      await this.lp.connect(this.alice).approve(this.topDog.address, "1000", { from: this.alice.address })
      await this.topDog.add("1", this.lp.address, true)
      await time.advanceBlockTo("1184")
      await this.topDog.updateRewardPerBlock("200");
      await this.topDog.connect(this.alice).deposit(0, "10", { from: this.alice.address })
      await time.advanceBlockTo("1305")
      
      expect(await this.topDog.pendingBone(0, this.alice.address)).to.equal("10000")
      await this.topDog.connect(this.alice).deposit(0, "0", { from: this.alice.address })
      expect(await this.topDog.pendingBone(0, this.alice.address)).to.equal("0")
      expect(await this.bone.balanceOf(this.alice.address)).to.equal("3960")

      expect(await this.bone.balanceOf(this.devBoneDistributorRef.address)).to.equal("600")
      expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("8640")
      expect(await this.bone.balanceOf(this.bob.address)).to.equal("0")
      expect(await this.bone.balanceOf(this.alice.address)).to.equal("3960")
    })
  })
})
