const { ethers } = require("hardhat");

const { WETH, DAI, USDC, USDT, WBTC, LEASH, SHIBA_INU, BONE } = require("@shibaswap/sdk")

function sleep(miliseconds) {
    var currentTime = new Date().getTime();

    while (currentTime + miliseconds >= new Date().getTime()) {}
}

async function main() {
    console.log("start deploy");
    const chainId = 42;
    const [deployer, user, devAddr] = await ethers.getSigners();

    // // deploy xSHIBBoneMerkleDistributor token
    // const xShibBoneMerkleDistributor = await ethers.getContractFactory('xShibBoneMerkleDistributor');
    // const xShibBoneMerkleDistributorDeployed = await xShibBoneMerkleDistributor.deploy(BONE[chainId].address, "0x0000000000000000000000000000000000000000000000000000000000000000");

    // // deploy xLeashBoneMerkleDistributor token
    // const xLeashBoneMerkleDistributor = await ethers.getContractFactory('xLeashBoneMerkleDistributor');
    // const xLeashBoneMerkleDistributorDeployed = await xLeashBoneMerkleDistributor.deploy(BONE[chainId].address, "0x0000000000000000000000000000000000000000000000000000000000000000");

    // deploy wethMerkleDistributor token
    const wethMerkleDistributor = await ethers.getContractFactory('wethMerkleDistributor');
    const wethMerkleDistributorDeployed = await wethMerkleDistributor.deploy(WETH[chainId].address, "0x0000000000000000000000000000000000000000000000000000000000000000");

    // deploy wbtcMerkleDistributor token
    const wbtcMerkleDistributor = await ethers.getContractFactory('wbtcMerkleDistributor');
    const wbtcMerkleDistributorDeployed = await wbtcMerkleDistributor.deploy(WBTC[chainId].address, "0x0000000000000000000000000000000000000000000000000000000000000000");

    // deploy usdtMerkleDistributor token
    const usdtMerkleDistributor = await ethers.getContractFactory('usdtMerkleDistributor');
    const usdtMerkleDistributorDeployed = await usdtMerkleDistributor.deploy(USDT[chainId].address, "0x0000000000000000000000000000000000000000000000000000000000000000");

    // deploy usdcMerkleDistributor token
    const usdcMerkleDistributor = await ethers.getContractFactory('usdcMerkleDistributor');
    const usdcMerkleDistributorDeployed = await usdcMerkleDistributor.deploy(USDC[chainId].address, "0x0000000000000000000000000000000000000000000000000000000000000000");

    // deploy daiMerkleDistributor token
    const daiMerkleDistributor = await ethers.getContractFactory('daiMerkleDistributor');
    const daiMerkleDistributorDeployed = await daiMerkleDistributor.deploy(DAI[chainId].address, "0x0000000000000000000000000000000000000000000000000000000000000000");

    // // deploy tBoneBoneMerkleDistributor token
    // const tBoneBoneMerkleDistributor = await ethers.getContractFactory('tBoneBoneMerkleDistributor');
    // const tBoneBoneMerkleDistributorDeployed = await tBoneBoneMerkleDistributor.deploy(BONE[chainId].address, "0x0000000000000000000000000000000000000000000000000000000000000000");

    // console.log(`xShibBoneMerkleDistributorDeployed contract address: ${xShibBoneMerkleDistributorDeployed.address}`);
    // console.log(`xLeashBoneMerkleDistributorDeployed contract address: ${xLeashBoneMerkleDistributorDeployed.address}`);
    console.log(`wethMerkleDistributorDeployed contract address: ${wethMerkleDistributorDeployed.address}`);
    console.log(`wbtcMerkleDistributorDeployed contract address: ${wbtcMerkleDistributorDeployed.address}`);
    console.log(`usdtMerkleDistributorDeployed contract address: ${usdtMerkleDistributorDeployed.address}`);
    console.log(`usdcMerkleDistributorDeployed contract address: ${usdcMerkleDistributorDeployed.address}`);
    console.log(`daiMerkleDistributorDeployed contract address: ${daiMerkleDistributorDeployed.address}`);
    // console.log(`tBoneBoneMerkleDistributorDeployed contract address: ${tBoneBoneMerkleDistributorDeployed.address}`);
    sleep(10000);
    // await run("verify:verify", {
    //     constructorArguments: [
    //         BONE[chainId].address,
    //         "0x0000000000000000000000000000000000000000000000000000000000000000"
    //       ],
    //     contract: "contracts/merkleDistributors/xShibBoneMerkleDistributor.sol:xShibBoneMerkleDistributor",
    //     address: xShibBoneMerkleDistributorDeployed.address
    //   });

    // await run("verify:verify", {
    //     constructorArguments: [
    //         BONE[chainId].address,
    //         "0x0000000000000000000000000000000000000000000000000000000000000000"
    //     ],
    //     contract: "contracts/merkleDistributors/xLeashBoneMerkleDistributor.sol:xLeashBoneMerkleDistributor",
    //     address: xLeashBoneMerkleDistributorDeployed.address
    // });

    // await run("verify:verify", {
    //     constructorArguments: [
    //         WETH[chainId].address,
    //         "0x0000000000000000000000000000000000000000000000000000000000000000"
    //     ],
    //     contract: "contracts/merkleDistributors/wethMerkleDistributor.sol:wethMerkleDistributor",
    //     address: wethMerkleDistributorDeployed.address
    // });

    // await run("verify:verify", {
    //     constructorArguments: [
    //         WBTC[chainId].address,
    //         "0x0000000000000000000000000000000000000000000000000000000000000000"
    //     ],
    //     contract: "contracts/merkleDistributors/wbtcMerkleDistributor.sol:wbtcMerkleDistributor",
    //     address: wbtcMerkleDistributorDeployed.address
    // });

    // await run("verify:verify", {
    //     constructorArguments: [
    //         USDC[chainId].address,
    //         "0x0000000000000000000000000000000000000000000000000000000000000000"
    //     ],
    //     contract: "contracts/merkleDistributors/usdcMerkleDistributor.sol:usdcMerkleDistributor",
    //     address: usdcMerkleDistributorDeployed.address
    // });

    // await run("verify:verify", {
    //     constructorArguments: [
    //         USDT[chainId].address,
    //         "0x0000000000000000000000000000000000000000000000000000000000000000"
    //     ],
    //     contract: "contracts/merkleDistributors/usdtMerkleDistributor.sol:usdtMerkleDistributor",
    //     address: usdtMerkleDistributorDeployed.address
    // });

    // await run("verify:verify", {
    //     constructorArguments: [
    //         BONE[chainId].address,
    //         "0x0000000000000000000000000000000000000000000000000000000000000000"
    //     ],
    //     contract: "contracts/merkleDistributors/tBoneBoneMerkleDistributor.sol:tBoneBoneMerkleDistributor",
    //     address: tBoneBoneMerkleDistributorDeployed.address
    // });

    // await run("verify:verify", {
    //     constructorArguments: [
    //         DAI[chainId].address,
    //         "0x0000000000000000000000000000000000000000000000000000000000000000"
    //     ],
    //     contract: "contracts/merkleDistributors/daiMerkleDistributor.sol:daiMerkleDistributor",
    //     address: daiMerkleDistributorDeployed.address
    // });
    
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });