
const { ethers } = require("hardhat");

const { WETH, DAI, USDC, USDT, WBTC } = require("@shibaswap/sdk")

function sleep(miliseconds) {
    var currentTime = new Date().getTime();

    while (currentTime + miliseconds >= new Date().getTime()) {}
}

async function main() {
    console.log("start delploy");
    const factoryAddress = "0x0faaBD8108bF8eC46A147087aAe907458aCA6073"; // TODO - CHANGETHIS - factory contract address
    const chainId = 42;
    const [deployer, user, devAddr] = await ethers.getSigners();

    const Router = await ethers.getContractFactory('UniswapV2Router02');
    const router = await Router.deploy(factoryAddress, WETH[chainId].address);
    console.log(`router contract address: ${router.address}`);

    console.log(factoryAddress, WETH[chainId].address);
    sleep(15000);

    // await run("verify:verify", {
    //     constructorArguments: [
    //         factoryAddress,
    //         WETH[chainId].address
    //     ],
    //     contract: "contracts/uniswapv2/UniswapV2Router02.sol:UniswapV2Router02",
    //     address: router.address
    // });

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });