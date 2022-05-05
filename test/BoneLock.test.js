const { ethers } = require("hardhat")
const { expect } = require("chai")
const { time } = require("./utilities")

describe("BoneLocker", function () {
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
    this.tBoneBoneDistributorRef = await this.tBoneBoneDistributor.deploy(this.bone.address);
    this.xShibBoneDistributorRef = await this.xShibBoneDistributor.deploy(this.bone.address);
    this.xLeashBoneDistributorRef = await this.xLeashBoneDistributor.deploy(this.bone.address);

    await this.bone.deployed()
    await this.tBoneBoneDistributorRef.deployed()
    await this.xShibBoneDistributorRef.deployed()
    await this.xLeashBoneDistributorRef.deployed()
  })

  it("should set correct state variables", async function () {
    this.boneLocker = await this.BoneLocker.deploy(this.bone.address, this.emergencyWallet.address, 10, 5);
    await this.boneLocker.deployed()
    this.devBoneDistributorRef = await this.DevBoneDistributor.deploy(this.bone.address, this.boneLocker.address, this.devWallet.address, this.marketingWallet.address, this.adminWallet.address);
    await this.devBoneDistributorRef.deployed()
    this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "1000", "0", "1000")
    await this.topDog.deployed()

    await this.bone.transferOwnership(this.topDog.address)
    await this.boneLocker.transferOwnership(this.topDog.address)

    const bone = await this.topDog.bone()
    const boneLocker = await this.topDog.boneLocker()
    const boneOwner = await this.bone.owner()
    const boneLockerOwner = await this.boneLocker.owner()

    expect(bone).to.equal(this.bone.address)
    expect(boneLocker).to.equal(this.boneLocker.address)
    expect(boneOwner).to.equal(this.topDog.address)
    expect(boneLockerOwner).to.equal(this.topDog.address)
    expect(await this.boneLocker.lockingPeriod()).to.equal(864000)
    expect(await this.boneLocker.devLockingPeriod()).to.equal(432000)
  })

  it("update locking period", async function () {
    this.boneLocker = await this.BoneLocker.deploy(this.bone.address, this.emergencyWallet.address, 10, 5);
    await this.boneLocker.deployed()
    this.devBoneDistributorRef = await this.DevBoneDistributor.deploy(this.bone.address, this.boneLocker.address, this.devWallet.address, this.marketingWallet.address, this.adminWallet.address);
    await this.devBoneDistributorRef.deployed()
    this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "1000", "0", "1000")
    await this.topDog.deployed()

    await this.bone.transferOwnership(this.topDog.address)
    await this.boneLocker.transferOwnership(this.topDog.address)

    expect(await this.boneLocker.lockingPeriod()).to.equal(864000)
    expect(await this.boneLocker.devLockingPeriod()).to.equal(432000)


    await expect(this.boneLocker.connect(this.bob).setLockingPeriod(1200,600, { from: this.bob.address })).to.be.revertedWith("Ownable: caller is not the owner")

    await this.topDog.setLockingPeriod(2400, 1200)

    expect(await this.boneLocker.lockingPeriod()).to.equal(2400)
    expect(await this.boneLocker.devLockingPeriod()).to.equal(1200)

  })


  it("should allow owner and only owner to add lock/emergencyWithdraw", async function () {
    this.boneLocker = await this.BoneLocker.deploy(this.bone.address, this.emergencyWallet.address, 10, 5);
    await this.boneLocker.deployed()
    this.devBoneDistributorRef = await this.DevBoneDistributor.deploy(this.bone.address, this.boneLocker.address, this.devWallet.address, this.marketingWallet.address, this.adminWallet.address);
    await this.devBoneDistributorRef.deployed()
    this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "1000", "0", "1000")
    await this.topDog.deployed()

    await this.bone.transferOwnership(this.topDog.address)
    await this.boneLocker.transferOwnership(this.topDog.address)

    await expect(this.boneLocker.connect(this.bob).lock(this.bob.address, 10000000000, false, { from: this.bob.address })).to.be.revertedWith("Ownable: caller is not the owner")
    await expect(this.boneLocker.connect(this.bob).emergencyWithdrawOwner(this.bob.address, { from: this.bob.address })).to.be.revertedWith("Ownable: caller is not the owner")
  })

  context("With LP tokens added and user deposit/harvest", function () {
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

    it("should lock certain percent of BONE", async function () {
      this.boneLocker = await this.BoneLocker.deploy(this.bone.address, this.emergencyWallet.address, 10, 5);
      await this.boneLocker.deployed()
      this.devBoneDistributorRef = await this.DevBoneDistributor.deploy(this.bone.address, this.boneLocker.address, this.devWallet.address, this.marketingWallet.address, this.adminWallet.address);
    await this.devBoneDistributorRef.deployed()
      // 100 per block farming rate starting at block 100 with bonus until block 1000
      this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "1000", "0", "1000")
      await this.topDog.deployed()
      await this.bone.transferOwnership(this.topDog.address)
      await this.boneLocker.transferOwnership(this.topDog.address)

      await this.topDog.add("100", this.lp.address, true)

      await this.lp.connect(this.bob).approve(this.topDog.address, "1000", { from: this.bob.address })

      await this.topDog.connect(this.bob).deposit(0, "100", { from: this.bob.address })

    
      await time.advanceBlockTo("20")
      expect(await this.topDog.pendingBone(0, this.bob.address)).to.equal("0")
      await this.topDog.connect(this.bob).deposit(0, "0", { from: this.bob.address })
      expect(await this.bone.balanceOf(this.bob.address)).to.equal("330")
      expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("720")
      expect(await this.boneLocker.unclaimedTokensByUser(this.bob.address)).to.equal("670")


    })

    it("should lock several times locked BONEs", async function () {
        this.boneLocker = await this.BoneLocker.deploy(this.bone.address, this.emergencyWallet.address, 10, 5);
        await this.boneLocker.deployed()
        this.devBoneDistributorRef = await this.DevBoneDistributor.deploy(this.bone.address, this.boneLocker.address, this.devWallet.address, this.marketingWallet.address, this.adminWallet.address);
    await this.devBoneDistributorRef.deployed()
        // 100 per block farming rate starting at block 100 with bonus until block 1000
        this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "1000", "0", "1000")
        await this.topDog.deployed()
        await this.bone.transferOwnership(this.topDog.address)
        await this.boneLocker.transferOwnership(this.topDog.address)
  
        await this.topDog.add("100", this.lp.address, true)
  
        await this.lp.connect(this.bob).approve(this.topDog.address, "1000", { from: this.bob.address })
  
        await this.topDog.connect(this.bob).deposit(0, "100", { from: this.bob.address })
  
        // aftrer 20 blocks
        await time.advanceBlockTo("20")
        expect(await this.topDog.pendingBone(0, this.bob.address)).to.equal("0")
        await this.topDog.connect(this.bob).deposit(0, "0", { from: this.bob.address })
        expect(await this.bone.balanceOf(this.bob.address)).to.equal("330")
        expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("720")
        expect(await this.boneLocker.unclaimedTokensByUser(this.bob.address)).to.equal("670")

        // again after 20 blocks
        await time.advanceBlockTo("20")
        expect(await this.topDog.pendingBone(0, this.bob.address)).to.equal("0")
        await this.topDog.connect(this.bob).deposit(0, "0", { from: this.bob.address })
        expect(await this.bone.balanceOf(this.bob.address)).to.equal("660")
        expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("1440")
        expect(await this.boneLocker.unclaimedTokensByUser(this.bob.address)).to.equal("1340")

        // now after 30 blocks
        await time.advanceBlockTo("30")
        expect(await this.topDog.pendingBone(0, this.bob.address)).to.equal("0")
        await this.topDog.connect(this.bob).deposit(0, "0", { from: this.bob.address })
        expect(await this.bone.balanceOf(this.bob.address)).to.equal("990")
        expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("2160")
        expect(await this.boneLocker.unclaimedTokensByUser(this.bob.address)).to.equal("2010")
    })

    it("should unlock users locked BONEs when claimable", async function () {
      this.boneLocker = await this.BoneLocker.deploy(this.bone.address, this.emergencyWallet.address, 10, 5);
      await this.boneLocker.deployed()
      this.devBoneDistributorRef = await this.DevBoneDistributor.deploy(this.bone.address, this.boneLocker.address, this.devWallet.address, this.marketingWallet.address, this.adminWallet.address);
    await this.devBoneDistributorRef.deployed()
      // 100 per block farming rate starting at block 100 with bonus until block 1000
      this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "1000", "0", "1000")
      await this.topDog.deployed()
      await this.bone.transferOwnership(this.topDog.address)
      await this.boneLocker.transferOwnership(this.topDog.address)

      await this.topDog.add("100", this.lp.address, true)

      await this.lp.connect(this.bob).approve(this.topDog.address, "1000", { from: this.bob.address })

      await this.topDog.connect(this.bob).deposit(0, "100", { from: this.bob.address })

      // aftrer 20 blocks
      await time.advanceBlockTo("20")
      expect(await this.topDog.pendingBone(0, this.bob.address)).to.equal("0")
      await this.topDog.connect(this.bob).deposit(0, "0", { from: this.bob.address })
      expect(await this.bone.balanceOf(this.bob.address)).to.equal("330")
      expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("720")
      expect(await this.boneLocker.unclaimedTokensByUser(this.bob.address)).to.equal("670")
      expect(await this.boneLocker.getClaimableAmount(this.bob.address)).to.equal("0")

      // again after 20 blocks
      await time.advanceBlockTo("20")
      expect(await this.topDog.pendingBone(0, this.bob.address)).to.equal("0")
      await this.topDog.connect(this.bob).deposit(0, "0", { from: this.bob.address })
      expect(await this.bone.balanceOf(this.bob.address)).to.equal("660")
      expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("1440")
      expect(await this.boneLocker.unclaimedTokensByUser(this.bob.address)).to.equal("1340")
      expect(await this.boneLocker.getClaimableAmount(this.bob.address)).to.equal("0")

      // now after 30 blocks
      await time.advanceBlockTo("30")
      expect(await this.topDog.pendingBone(0, this.bob.address)).to.equal("0")
      await this.topDog.connect(this.bob).deposit(0, "0", { from: this.bob.address })
      expect(await this.bone.balanceOf(this.bob.address)).to.equal("990")
      expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("2160")
      expect(await this.boneLocker.unclaimedTokensByUser(this.bob.address)).to.equal("2010")
      expect(await this.boneLocker.getClaimableAmount(this.bob.address)).to.equal("0")
      // after 10 dyas
      await time.advanceTimestampTo(864000)
      expect(await this.boneLocker.getClaimableAmount(this.bob.address)).to.equal("2010")
      
      expect((await this.boneLocker.getLeftRightCounters(this.bob.address))[0]).to.equal("0")
      expect((await this.boneLocker.getLeftRightCounters(this.bob.address))[1]).to.equal("3")
      
      await this.boneLocker.connect(this.bob).claimAll(3,{ from: this.bob.address })
      expect(await this.bone.balanceOf(this.bob.address)).to.equal("3000")
      expect(await this.boneLocker.getClaimableAmount(this.bob.address)).to.equal("0")

    })

    it("should unlock those tokens which are now claimable", async function () {
        this.boneLocker = await this.BoneLocker.deploy(this.bone.address, this.emergencyWallet.address, 10, 5);
        await this.boneLocker.deployed()
        this.devBoneDistributorRef = await this.DevBoneDistributor.deploy(this.bone.address, this.boneLocker.address, this.devWallet.address, this.marketingWallet.address, this.adminWallet.address);
    await this.devBoneDistributorRef.deployed()
        // 100 per block farming rate starting at block 100 with bonus until block 1000
        this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "1000", "0", "1000")
        await this.topDog.deployed()
        await this.bone.transferOwnership(this.topDog.address)
        await this.boneLocker.transferOwnership(this.topDog.address)
  
        await this.topDog.add("100", this.lp.address, true)
  
        await this.lp.connect(this.bob).approve(this.topDog.address, "1000", { from: this.bob.address })
  
        await this.topDog.connect(this.bob).deposit(0, "100", { from: this.bob.address })
  
        // aftrer 20 blocks
        await time.advanceBlockTo("20")
        expect(await this.topDog.pendingBone(0, this.bob.address)).to.equal("0")
        await this.topDog.connect(this.bob).deposit(0, "0", { from: this.bob.address })
        expect(await this.bone.balanceOf(this.bob.address)).to.equal("330")
        expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("720")
        expect(await this.boneLocker.unclaimedTokensByUser(this.bob.address)).to.equal("670")
        expect(await this.boneLocker.getClaimableAmount(this.bob.address)).to.equal("0")
  
        // again after 20 blocks
        await time.advanceBlockTo("20")
        expect(await this.topDog.pendingBone(0, this.bob.address)).to.equal("0")
        await this.topDog.connect(this.bob).deposit(0, "0", { from: this.bob.address })
        expect(await this.bone.balanceOf(this.bob.address)).to.equal("660")
        expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("1440")
        expect(await this.boneLocker.unclaimedTokensByUser(this.bob.address)).to.equal("1340")
        expect(await this.boneLocker.getClaimableAmount(this.bob.address)).to.equal("0")
        // after 5 days
        await time.advanceTimestampTo(432000)
        // now after 30 blocks
        await time.advanceBlockTo("30")
        expect(await this.topDog.pendingBone(0, this.bob.address)).to.equal("1000")
        await this.topDog.connect(this.bob).deposit(0, "0", { from: this.bob.address })
        expect(await this.bone.balanceOf(this.bob.address)).to.equal("1320")
        expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("2880")
        expect(await this.boneLocker.unclaimedTokensByUser(this.bob.address)).to.equal("2680")
        expect(await this.boneLocker.getClaimableAmount(this.bob.address)).to.equal("0")
        // after 5 dyas
        await time.advanceTimestampTo(432000)
        expect(await this.boneLocker.getClaimableAmount(this.bob.address)).to.equal("1340")
        
        expect((await this.boneLocker.getLeftRightCounters(this.bob.address))[0]).to.equal("0")
        expect((await this.boneLocker.getLeftRightCounters(this.bob.address))[1]).to.equal("3")
        
        await this.boneLocker.connect(this.bob).claimAll(3,{ from: this.bob.address })
        expect(await this.bone.balanceOf(this.bob.address)).to.equal("2660")
        expect(await this.boneLocker.unclaimedTokensByUser(this.bob.address)).to.equal("1340")
        expect(await this.boneLocker.getClaimableAmount(this.bob.address)).to.equal("0")

        //after 5 days
        await time.advanceTimestampTo(432000)
        expect(await this.boneLocker.getClaimableAmount(this.bob.address)).to.equal("1340")
        
        expect((await this.boneLocker.getLeftRightCounters(this.bob.address))[0]).to.equal("2")
        expect((await this.boneLocker.getLeftRightCounters(this.bob.address))[1]).to.equal("3")
        
        await this.boneLocker.connect(this.bob).claimAll(3,{ from: this.bob.address })
        expect(await this.bone.balanceOf(this.bob.address)).to.equal("4000")
        expect(await this.boneLocker.unclaimedTokensByUser(this.bob.address)).to.equal("0")
        expect(await this.boneLocker.getClaimableAmount(this.bob.address)).to.equal("0")
    })

    it("emergency withdraw by user, set emergency flag by owner", async function () {
        this.boneLocker = await this.BoneLocker.deploy(this.bone.address, this.emergencyWallet.address, 10, 5);
        await this.boneLocker.deployed()
        this.devBoneDistributorRef = await this.DevBoneDistributor.deploy(this.bone.address, this.boneLocker.address, this.devWallet.address, this.marketingWallet.address, this.adminWallet.address);
    await this.devBoneDistributorRef.deployed()
        // 100 per block farming rate starting at block 100 with bonus until block 1000
        this.topDog = await this.TopDog.deploy(this.bone.address, this.boneLocker.address, this.devBoneDistributorRef.address, this.tBoneBoneDistributorRef.address, this.xShibBoneDistributorRef.address, this.xLeashBoneDistributorRef.address, "1000", "0", "1000")
        await this.topDog.deployed()
        await this.bone.transferOwnership(this.topDog.address)
        await this.boneLocker.transferOwnership(this.topDog.address)
  
        await this.topDog.add("100", this.lp.address, true)
  
        await this.lp.connect(this.bob).approve(this.topDog.address, "1000", { from: this.bob.address })
  
        await this.topDog.connect(this.bob).deposit(0, "100", { from: this.bob.address })
  
        // aftrer 20 blocks
        await time.advanceBlockTo("20")
        expect(await this.topDog.pendingBone(0, this.bob.address)).to.equal("0")
        await this.topDog.connect(this.bob).deposit(0, "0", { from: this.bob.address })
        expect(await this.bone.balanceOf(this.bob.address)).to.equal("330")
        expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("720")
        expect(await this.boneLocker.unclaimedTokensByUser(this.bob.address)).to.equal("670")

        // again after 20 blocks
        await time.advanceBlockTo("20")
        expect(await this.topDog.pendingBone(0, this.bob.address)).to.equal("0")
        await this.topDog.connect(this.bob).deposit(0, "0", { from: this.bob.address })
        expect(await this.bone.balanceOf(this.bob.address)).to.equal("660")
        expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("1440")
        expect(await this.boneLocker.unclaimedTokensByUser(this.bob.address)).to.equal("1340")

        // now after 30 blocks
        await time.advanceBlockTo("30")
        expect(await this.topDog.pendingBone(0, this.bob.address)).to.equal("0")
        await this.topDog.connect(this.bob).deposit(0, "0", { from: this.bob.address })
        expect(await this.bone.balanceOf(this.bob.address)).to.equal("990")
        expect(await this.bone.balanceOf(this.boneLocker.address)).to.equal("2160")
        expect(await this.boneLocker.unclaimedTokensByUser(this.bob.address)).to.equal("2010")

        expect(await this.boneLocker.getClaimableAmount(this.bob.address)).to.equal("0")    //user cannot claim right not
        await this.boneLocker.connect(this.bob).claimAll(3,{ from: this.bob.address })
        expect(await this.bone.balanceOf(this.bob.address)).to.equal("990")
        expect(await this.boneLocker.unclaimedTokensByUser(this.bob.address)).to.equal("2010")

        await expect(this.boneLocker.connect(this.bob).setEmergencyFlag(true, { from: this.bob.address })).to.be.revertedWith("This function can only be called by emergencyAddress")

        await this.boneLocker.connect(this.emergencyWallet).setEmergencyFlag(true, { from: this.emergencyWallet.address })

        await this.boneLocker.connect(this.bob).emergencyWithdraw({ from: this.bob.address })
        expect(await this.bone.balanceOf(this.bob.address)).to.equal("3000")
        expect(await this.boneLocker.unclaimedTokensByUser(this.bob.address)).to.equal("0")
    })
  })
})
