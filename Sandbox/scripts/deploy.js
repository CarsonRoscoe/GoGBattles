// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const web3 = require('web3');

async function main() {

  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await hre.run('compile');

  // We get the contract to deploy

  let config = {
    contractParams: {
      Token : [],
      Cards : [],
      CardFactory : [],
      MatchHistory : [],
      Vault : [],
      Coordinator : [],
    },
    roles: {
      COORDINATOR_ROLE : web3.utils.keccak256('COORDINATOR_ROLE'),
    },
    isUpgradeable : false,
    stablePairs: {
      DAI : ['0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F', '0x639cB7b21ee2161DF9c882483C9D55c90c20Ca3e', 18],
      USDC : ['0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e', '0x2271e3Fef9e15046d09E1d78a8FF038c691E9Cf9', 6]
    },
  }

  let dapp = {};
  let addresses = {}

  let contractIdentifiers = Object.keys(config.contractParams); 
  for(let i = 0; i < contractIdentifiers.length; ++i) {
    let identifier = contractIdentifiers[i];
    let params = config.contractParams[identifier];
    let contractName = 'GoGBattles' + identifier;

    if (config.isUpgradeable) {
      contractName += 'Upgradeable';
      // Empty constructors, call initialize. API for it
    }
    else {
      console.info('Attempting to deploy ' + contractName);

      const GoGBattlesContract = await hre.ethers.getContractFactory(contractName);
      const gogBattlesContract = await GoGBattlesContract.deploy(params.length > 0 ?{ arguments : params } : null);
      await gogBattlesContract.deployed();
      
      dapp[contractName] = gogBattlesContract;
      addresses[contractName] = gogBattlesContract.address;

      console.info('Deployed ' + contractName);
    }
  }

  let contractNames = Object.keys(dapp);
  for(let i = 0; i < contractNames.length; ++i) {
    let instance = dapp[contractNames[i]];
    console.info('Setup ' + contractNames[i]);
    switch(contractNames[i]) {
      case'GoGBattlesToken':
        await instance.functions.grantRole(config.roles.COORDINATOR_ROLE, dapp['GoGBattlesCoordinator'].address);
        break;
      case'GoGBattlesCards':
      await instance.functions.grantRole(config.roles.COORDINATOR_ROLE, dapp['GoGBattlesCoordinator'].address);
      await instance.functions.setGoGBattlesTokenAndCardFactory(dapp['GoGBattlesToken'].address, dapp['GoGBattlesCardFactory'].address);
        break;
      case'GoGBattlesCardFactory':
      await instance.functions.grantRole(config.roles.COORDINATOR_ROLE, dapp['GoGBattlesCoordinator'].address);
        break;
      case'GoGBattlesMatchHistory':
      await instance.functions.grantRole(config.roles.COORDINATOR_ROLE, dapp['GoGBattlesCoordinator'].address);
        break;
      case'GoGBattlesVault':
      await instance.functions.grantRole(config.roles.COORDINATOR_ROLE, dapp['GoGBattlesCoordinator'].address);
      await instance.functions.setPoolToken(dapp['GoGBattlesToken'].address);
      await instance.functions.authorizeAToken( ... config.stablePairs.DAI );
      await instance.functions.authorizeAToken( ... config.stablePairs.USDC );
        break;
      case'GoGBattlesCoordinator':
      await instance.functions.SetGoGBattlesContracts(dapp['GoGBattlesToken'].address, dapp['GoGBattlesCards'].address, dapp['GoGBattlesVault'].address, dapp['GoGBattlesMatchHistory'].address);
        break;
    }
  }

  console.log("Contracts deployed to:", addresses);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
