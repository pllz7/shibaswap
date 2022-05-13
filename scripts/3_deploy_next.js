
const { ethers } = require("hardhat");

const { WETH, DAI, USDC, USDT, WBTC, LEASH, SHIBA_INU } = require("@shibaswap/sdk")

function sleep(miliseconds) {
    var currentTime = new Date().getTime();

    while (currentTime + miliseconds >= new Date().getTime()) {}
}

async function main() {
    console.log("start delploy");
    const factoryAddress = "0x0faaBD8108bF8eC46A147087aAe907458aCA6073"; // TODO - CHANGETHIS - factory contract address
    const bonePerBlock = "100000000000000000000", startBlock =  "25424809", bonusEndBlock = "25469167";
    const lockingPeriodInBoneLocker = 3, devLockingPeriodInBoneLocker = 1;
    const devWallet = "0x3370CeC87C20D67a2695ceA90D7247031928F9Ca", marketingWallet = "0x97325b5E3de52877B16327ECD625678Ed37AcC30", adminWallet = "0xc1B422ba76726fBC6e3ad9BDAF5cB626d5FC84EE";

    const chainId = 42;
    const [deployer, user, devAddr] = await ethers.getSigners();

    // const UniswapV2Factory = await ethers.getContract("UniswapV2Factory")

    // deploy bone token
    const BoneToken = await ethers.getContractFactory('BoneToken');
    const boneToken = await BoneToken.deploy();

    console.log(`BONE contract address: ${boneToken.address}`);
    sleep(10000);
    // // deploy burry bone
    // const BuryBone = await ethers.getContractFactory('BuryBone');
    // const buryBone = await BuryBone.deploy(boneToken.address);

    // console.log(`BuryBone contract address: ${buryBone.address}`);
    // sleep(10000);
    // // deploy burry leash
    // const BuryLeash = await ethers.getContractFactory('BuryLeash');
    // const buryLeash = await BuryLeash.deploy(LEASH[chainId].address);

    // console.log(`BuryLeash contract address: ${buryLeash.address}`);
    // sleep(10000);
    // // deploy burry shib
    // const BuryShib = await ethers.getContractFactory('BuryShib');
    // const buryShib = await BuryShib.deploy(SHIBA_INU[chainId].address);

    // console.log(`BuryShib contract address: ${buryShib.address}`);
    // sleep(10000);
    // deploy swapRewardDistributor
    const SwapRewardDistributor = await ethers.getContractFactory('SwapRewardDistributor');
    const swapRewardDistributor = await SwapRewardDistributor.deploy();

    console.log(`SwapRewardDistributor contract address: ${swapRewardDistributor.address}`);
    sleep(10000);
    // deploy Treasure Finder
    const TreasureFinder = await ethers.getContractFactory('TreasureFinder');
    const treasureFinder = await TreasureFinder.deploy(factoryAddress,
        swapRewardDistributor.address,
        // buryBone.address,
        // buryLeash.address,
        // buryShib.address,
        boneToken.address,
        SHIBA_INU[chainId].address,
        LEASH[chainId].address,
        WETH[chainId].address);

    console.log(`TreasureFinder contract address: ${treasureFinder.address}`);
    sleep(10000);
    // deploy tBoneBoneDistributor
    // const tBoneBoneDistributor = await ethers.getContractFactory('tBoneBoneDistributor');
    // const tboneBoneDistributor = await tBoneBoneDistributor.deploy(boneToken.address);

    // console.log(`tboneBoneDistributor contract address: ${tboneBoneDistributor.address}`);
    // sleep(10000);
    // // deploy xShibBoneDistributor
    // const xShibBoneDistributor = await ethers.getContractFactory('xShibBoneDistributor');
    // const xshibBoneDistributor = await xShibBoneDistributor.deploy(boneToken.address);

    // console.log(`xshibBoneDistributor contract address: ${xshibBoneDistributor.address}`);
    // sleep(10000);
    // // deploy xLeashBoneDistributor
    // const xLeashBoneDistributor = await ethers.getContractFactory('xLeashBoneDistributor');
    // const xleashBoneDistributor = await xLeashBoneDistributor.deploy(boneToken.address);

    // console.log(`xleashBoneDistributor contract address: ${xleashBoneDistributor.address}`);
    // sleep(10000);
    // // deploy boneLocker
    // const BoneLocker = await ethers.getContractFactory('BoneLocker');
    // const boneLocker = await BoneLocker.deploy(boneToken.address, devAddr.address, lockingPeriodInBoneLocker, devLockingPeriodInBoneLocker);
    // console.log(`BoneLocker contract address: ${boneLocker.address}`);
    // sleep(10000);
    // deploy devBoneDistributor
    const DevBoneDistributor = await ethers.getContractFactory('DevBoneDistributor');
    const devBoneDistributor = await DevBoneDistributor.deploy(boneToken.address,
        boneLocker.address,
        devWallet,
        marketingWallet,
        adminWallet);

    console.log(`DevBoneDistributor contract address: ${devBoneDistributor.address}`);
    sleep(10000);

    // deploy topDog
    const TopDog = await ethers.getContractFactory('TopDog');
    const topDog = await TopDog.deploy(boneToken.address,
        boneLocker.address,
        devBoneDistributor.address,
        // tboneBoneDistributor.address,
        // xshibBoneDistributor.address,
        // xleashBoneDistributor.address,
        bonePerBlock,
        startBlock,
        bonusEndBlock);
    console.log(`TopDog contract address: ${topDog.address}`);
    sleep(10000);
    // sleep(10000);

    // await run("verify:verify", {
    //     contract: "contracts/BoneToken.sol:BoneToken",
    //     address: boneToken.address
    // });
    console.log("Verified BoneToken")
    sleep(10000);

    // await run("verify:verify", {
    //     constructorArguments: [
    //         boneToken.address
    //     ],
    //     contract: "contracts/BuryBone.sol:BuryBone",
    //     address: buryBone.address
    // });
    // console.log("Verified BuryBone")
    // sleep(10000);

    // await run("verify:verify", {
    //     constructorArguments: [
    //         LEASH[chainId].address
    //     ],
    //     contract: "contracts/BuryLeash.sol:BuryLeash",
    //     address: buryLeash.address
    // });
    // console.log("Verified BuryLeash")
    // sleep(10000);

    // await run("verify:verify", {
    //     constructorArguments: [
    //         SHIBA_INU[chainId].address
    //     ],
    //     contract: "contracts/BuryShib.sol:BuryShib",
    //     address: buryShib.address
    // });
    // console.log("Verified BuryShib")
    // sleep(10000);

    // await run("verify:verify", {
    //     contract: "contracts/SwapRewardDistributor.sol:SwapRewardDistributor",
    //     address: swapRewardDistributor.address
    // });
    console.log("Verified SwapRewardDistributor")
    sleep(10000);

    // await run("verify:verify", {
    //     constructorArguments: [
    //         factoryAddress,
    //         swapRewardDistributor.address,
    //         buryBone.address,
    //         buryLeash.address,
    //         buryShib.address,
    //         boneToken.address,
    //         SHIBA_INU[chainId].address,
    //         LEASH[chainId].address,
    //         WETH[chainId].address
    //     ],
    //     contract: "contracts/TreasureFinder.sol:TreasureFinder",
    //     address: treasureFinder.address
    // });

    console.log("Verified Treasure finder")
    sleep(10000);

    // await run("verify:verify", {
    //     constructorArguments: [
    //         boneToken.address
    //     ],
    //     contract: "contracts/tBoneBoneDistributor.sol:tBoneBoneDistributor",
    //     address: tboneBoneDistributor.address
    // });

    // console.log("Verified tBoneBoneDistributor")
    // sleep(10000);

    // await run("verify:verify", {
    //     constructorArguments: [
    //         boneToken.address
    //     ],
    //     contract: "contracts/xShibBoneDistributor.sol:xShibBoneDistributor",
    //     address: xshibBoneDistributor.address
    // });

    // console.log("Verified xShibBoneDistributor")
    // sleep(10000);

    // await run("verify:verify", {
    //     constructorArguments: [
    //         boneToken.address
    //     ],
    //     contract: "contracts/xLeashBoneDistributor.sol:xLeashBoneDistributor",
    //     address: xleashBoneDistributor.address
    // });

    // console.log("Verified xLeashBoneDistributor")
    // sleep(10000);

    // await run("verify:verify", {
    //     constructorArguments: [
    //         boneToken.address, boneLocker.address, devWallet, marketingWallet, adminWallet
    //     ],
    //     contract: "contracts/DevBoneDistributor.sol:DevBoneDistributor",
    //     address: devBoneDistributor.address
    // });

    console.log("Verified DevBoneDistributor")
    sleep(10000);

    // await run("verify:verify", {
    //     constructorArguments: [
    //         boneToken.address, devAddr.address, lockingPeriodInBoneLocker, devLockingPeriodInBoneLocker
    //     ],
    //     contract: "contracts/BoneLocker.sol:BoneLocker",
    //     address: boneLocker.address
    // });

    console.log("Verified BoneLocker")
    sleep(10000);

    // await run("verify:verify", {
    //     constructorArguments: [
    //         boneToken.address,
    //         boneLocker.address,
    //         devBoneDistributor.address,
    //         tboneBoneDistributor.address,
    //         xshibBoneDistributor.address,
    //         xleashBoneDistributor.address,
    //         bonePerBlock,
    //         startBlock,
    //         bonusEndBlock
    //     ],
    //     contract: "contracts/TopDog.sol:TopDog",
    //     address: topDog.address
    // });

    console.log("Verified TopDog")
    sleep(10000);


    const UniswapV2FactoryAddress = factoryAddress
    const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
    const factoryInstance = await UniswapV2Factory.attach(UniswapV2FactoryAddress);
    await factoryInstance.connect(deployer).setFeeTo(treasureFinder.address);

    if (await boneToken.owner() !== topDog.address) {
        // Transfer Bone Ownership to Chef
        console.log("Transfer Bone token Ownership to TopDog")
        await (await boneToken.transferOwnership(topDog.address)).wait()
    }

    if (await boneLocker.owner() !== topDog.address) {
        // Transfer Bone Ownership to Chef
        console.log("Transfer Bone Locker Ownership to TopDog")
        await (await boneLocker.transferOwnership(topDog.address)).wait()
    }

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });