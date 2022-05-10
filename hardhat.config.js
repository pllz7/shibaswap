// hardhat.config.js
require("dotenv/config")
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-solhint")
// require("@nomiclabs/hardhat-solpp")
require("@tenderly/hardhat-tenderly")
require("@nomiclabs/hardhat-waffle")
require("hardhat-abi-exporter")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("hardhat-gas-reporter")
require("hardhat-spdx-license-identifier")
require("hardhat-watcher")
require("solidity-coverage")

const { task } = require("hardhat/config")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

const { removeConsoleLog } = require("hardhat-preprocessor")

const accounts = {
  mnemonic: process.env.MNEMONIC || "grant teach mosquito harsh noodle local dry robust jacket drastic come soon",
  accountsBalance: "990000000000000000000",
}


module.exports = {
  abiExporter: {
    path: "./build/abi",
    //clear: true,
    flat: true,
    // only: [],
    // except: []
  },
  defaultNetwork: "rinkeby",
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "JVY272BDC2WE7S6SACB1CINDX5UTGSC3UX",
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    excludeContracts: ["contracts/mocks/", "contracts/libraries/"],
  },
  rinkeby: {
    forking: {
      url: `https://eth-mainnet.alchemyapi.io/v2/jqj9gp1jvr-Fi7Hv917xtSpYgVB4JKdt`,
    },
  },
  networks: {
    rinkeby: {
       url: `https://rinkeby.infura.io/v3/5ad28388cd4e423683c7eec76592eb10`,
       chainId: 4,
       accounts,
       generate_validators: true,
       bor_chain_id: 6924,
       live: true,
      saveDeployments: true,
       gasPrice: 20000000000,
     },
  },
  preprocess: {
    eachLine: removeConsoleLog(bre => bre.network.name !== "rinkeby" && bre.network.name !== "localhost"),
  },
  solidity: {
    version: "0.6.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 5000,
      },
    },
  },
  spdxLicenseIdentifier: {
    overwrite: false,
    runOnCompile: true,
  },
  tenderly: {
    project: process.env.TENDERLY_PROJECT,
    username: process.env.TENDERLY_USERNAME,
  },
  watcher: {
    compile: {
      tasks: ["compile"],
      files: ["./contracts"],
      verbose: true,
    },
  },
}
