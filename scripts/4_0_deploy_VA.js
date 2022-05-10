const { ethers } = require("hardhat");

const UNISWAP_ROUTER = new Map()
UNISWAP_ROUTER.set("1", "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
UNISWAP_ROUTER.set("42", "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")

const SUSHISWAP_ROUTER = new Map()
SUSHISWAP_ROUTER.set("1", "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506")
SUSHISWAP_ROUTER.set("42", "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506")

const SHIBASWAP_ROUTER = new Map()
SHIBASWAP_ROUTER.set("1", "")
SHIBASWAP_ROUTER.set("42", "0x9BC53146454a975b3bdF65DB73F83EE64Ec09BD8")

function sleep(miliseconds) {
    var currentTime = new Date().getTime();
    while (currentTime + miliseconds >= new Date().getTime()) {}
}

async function main() {
    console.log("start deploy");
    const chainId = "42";
    const [deployer, user, devAddr] = await ethers.getSigners();
    const SHIBASWAP_ROUTER_ADDRESS = SHIBASWAP_ROUTER.get(chainId);
    const UNISWAP_ROUTER_ADDRESS = UNISWAP_ROUTER.get(chainId)
    const SUSHISWAP_ROUTER_ADDRESS = SUSHISWAP_ROUTER.get(chainId.toString())

    console.log("Deploying ShibaUniFetch");
    const ShibaUniFetch = await ethers.getContractFactory('ShibaUniFetch');
    const ShibaUniFetchDeployed = await ShibaUniFetch.deploy(UNISWAP_ROUTER_ADDRESS, SHIBASWAP_ROUTER_ADDRESS);

    console.log(`ShibaUniFetchDeployed contract address: ${ShibaUniFetchDeployed.address}`);

    sleep(10000);

    console.log("Deploying ShibaSushiFetch");
    const ShibaSushiFetch = await ethers.getContractFactory('ShibaSushiFetch');
    const ShibaSushiFetchDeployed = await ShibaSushiFetch.deploy(SUSHISWAP_ROUTER_ADDRESS, SHIBASWAP_ROUTER_ADDRESS);

    console.log(`ShibaSushiFetchDeployed contract address: ${ShibaSushiFetchDeployed.address}`);
    sleep(10000);

    // await run("verify:verify", {
    //     constructorArguments: [UNISWAP_ROUTER_ADDRESS, SHIBASWAP_ROUTER_ADDRESS],
    //     contract: "contracts/ShibaUniFetch.sol:ShibaUniFetch",
    //     address: ShibaUniFetchDeployed.address
    //   });

    console.log("Verified ShibaUniFetch")

    sleep(10000);

    // await run("verify:verify", {
    //     constructorArguments: [SUSHISWAP_ROUTER_ADDRESS, SHIBASWAP_ROUTER_ADDRESS],
    //     contract: "contracts/ShibaSushiFetch.sol:ShibaSushiFetch",
    //     address: ShibaSushiFetchDeployed.address
    // });

    console.log("Verified ShibaSushiFetch")
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });