
const { ethers } = require("hardhat");

const { WETH, DAI, USDC, USDT, WBTC } = require("@shibaswap/sdk")

function sleep(miliseconds) {
    var currentTime = new Date().getTime();

    while (currentTime + miliseconds >= new Date().getTime()) {}
}

async function main() {
    console.log("start delploy");
    const chainId = 42;
    const [deployer, user, devAddr] = await ethers.getSigners();
    console.log(`Depoying contracts with the account: ${deployer.address} & ${user.address}`); // usr not used

    const balance = await deployer.getBalance();
    console.log(`Account balance: ${balance.toString()}`);

    const Factory = await ethers.getContractFactory('UniswapV2Factory');
    const factory = await Factory.deploy(deployer.address, [WBTC[chainId].address, USDT[chainId].address, USDC[chainId].address, DAI[chainId].address, WETH[chainId].address]);
    console.log(`Factory contract address: ${factory.address}`);

    console.log(deployer.address, [WBTC[chainId].address, USDT[chainId].address, USDC[chainId].address, DAI[chainId].address, WETH[chainId].address]);
    console.log("Waiting");
    sleep(10000);

    await run("verify:verify", {
        constructorArguments: [
            deployer.address,
            [WBTC[chainId].address, USDT[chainId].address, USDC[chainId].address, DAI[chainId].address, WETH[chainId].address]
          ],
        contract: "contracts/uniswapv2/UniswapV2Factory.sol:UniswapV2Factory",
        address: factory.address
      });
    
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });