import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy-ethers";
import "hardhat-deploy";
//import "@symfoni/hardhat-react";
import "hardhat-typechain";
import "@typechain/ethers-v5";
import "hardhat-gas-reporter";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-etherscan";
import * as dotenv from "dotenv";
import * as _ from "lodash";

// Load `.env` file as configuration.
const envResult = dotenv.config();
//console.log(envResult);
if (envResult.error) {
  throw envResult.error;
}
const env = envResult.parsed;

function createAccountsConfig(text: string) {
  if (_.startsWith(text, "0x")) {
    // as private keys
    return _.map(_.split(text, " "), (key) => ({
      privateKey: key,
      balance: "10000000000000000000000000",
    }));
  }
  // as mnemonic
  return { mnemonic: text };
}

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  // react: {
  //   providerPriority: ["web3modal", "hardhat"],
  // },
  paths: {
    //react: "./frontend/src/hardhat",
    deployments: "./frontend/src/hardhat/deployments",
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  typechain: {
    outDir: "./frontend/src/hardhat/typechain",
    target: "ethers-v5",
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 100,
  },
  networks: {
    hardhat: {
      //inject: false, // optional. If true, it will EXPOSE your mnemonic in your frontend code. Then it would be available as an "in-page browser wallet" / signer which can sign without confirmation.
      chainId: 1337,
      accounts: createAccountsConfig(env.HARDHAT_ACCOUNTS),
    },
    // ropsten: {
    //   url: env.ROPSTEN_URL,
    //   accounts: [env.ROPSTEN_PRIVATE_KEY],
    // },
    // mainnet: {
    //   url: env.MAINNET_URL,
    //   accounts: [env.MAINNET_PRIVATE_KEY],
    // },
    //rinkeby: {
    //  url: env.RINKEBY_URL,
    //  accounts: [env.RINKEBY_PRIVATE_KEY],
    //  gas: 10000000,
    //},
  },
  solidity: {
    compilers: [
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 50,
          },
        },
      },
    ],
  },
  etherscan: {
    apiKey: env.ETHERSCAN_API_KEY,
  },
};
export default config;
