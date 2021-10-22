const { Contract, ContractFactory } = require('@ethersproject/contracts');
const { SignerWithAddress } = require('@nomiclabs/hardhat-ethers/signers');
const { arrayify } = require('@ethersproject/bytes');
const { expect } = require('chai');
const { Wallet } = require('ethers');
const { ethers } = require('hardhat');

const Contracts = ['GoGBattlesToken', 'GoGBattlesCoordinator', 'GoGBattlesCards', 'GoGBattlesCardFactory', 'GoGBattlesVault'];
const Version = 'V1';
const Users = ['Deployer', 'Jane', 'Bob', 'Chris'];

let fullNames = {};
let dappFactory = {};
let dapp = {};
let user = {}

const resetScenarioAsync = async () => {
  fullNames = {};
  dappFactory = {};
  dapp = {};
  user = {};

  // populate contractIdentifier, dappFactory and dapp mapings, keyable via strings in the Contracts const
  for(let i = 0; i < Contracts.length; ++i) {
    try {
      let nameWithoutVersion = Contracts[i];
      fullNames[nameWithoutVersion] = nameWithoutVersion + '_' + Version;
      dappFactory[nameWithoutVersion] = await ethers.getContractFactory(fullNames[nameWithoutVersion]);
      dapp[nameWithoutVersion] = await dappFactory[nameWithoutVersion].deploy();
    }
    catch (e) {
      console.warn('Contracts at ' + i + ' was ' + Contracts[i] + ' and failed to instantiate because ' + e.message);
      break;
    }
  }
  // populates user mapping keyable via strings in the Users const
  let signers = await ethers.getSigners();
  for(let i = 0; i < Users.length && i < signers.length; ++i) {
    user[Users[i]] = signers[i];
  }
};

before(resetScenarioAsync);

module.exports.getScenario = () => {
  return {
    Contracts,
    Version,
    Users,
    fullNames,
    dappFactory,
    dapp,
    user
  };
}
module.exports.resetScenarioAsync = async () => {
  await resetScenarioAsync();
}