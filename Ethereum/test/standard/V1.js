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

before(async () => {
  // populate contractIdentifier, dappFactory and dapp mapings, keyable via strings in the Contracts const
  for(let i = 0; i < Contracts.length; ++i) {
    try {
      let nameWithoutVersion = Contracts[i];
      fullNames[nameWithoutVersion] = nameWithoutVersion + '_' + Version;
      dappFactory[nameWithoutVersion] = await ethers.getContractFactory(fullNames[nameWithoutVersion]);
      dapp[nameWithoutVersion] = await dappFactory[nameWithoutVersion].deploy();
    }
    catch (e) {
      console.warn('Contracts at ' + i + ' was ' + Contracts[i] + ' and failed to instantiate because ' + JSON.stringify(e));
      break;
    }
  }
  // populates user mapping keyable via strings in the Users const
  let signers = await ethers.getSigners();
  for(let i = 0; i < Users.length && i < signers.length; ++i) {
    user[Users[i]] = signers[i];
  }

  console.info('fullNames', fullNames);
  console.info('dappFactory', dappFactory);
  console.info('dapp', dapp);
  console.info('as', user);
});

describe('', () => {
  it("GoGBattlesToken\'s instantiation was a success. It should have the \'Symbol\' GOGB, name \'\', and initial supply of 0.", async () => {
    await expect(await dapp.GoGBattlesToken.totalSupply()).to.equal(0);
    await expect(await dapp.GoGBattlesToken.name()).to.equal('GoG: Battles\' Token');
    await expect(await dapp.GoGBattlesToken.symbol()).to.equal('GOGB');
  });
  it("Should have setup the deployer with the DEFAULT_ADMIN_ROLE for access control.", async () => {
  });
  it("Should have setup the deployer with the DEFAULT_ADMIN_ROLE for access control.", async () => {
  });
  it("Should have setup the deployer with the DEFAULT_ADMIN_ROLE for access control.", async () => {
  });
  it("Should have setup the deployer with the DEFAULT_ADMIN_ROLE for access control.", async () => {
  });
  it("Should have setup the deployer with the DEFAULT_ADMIN_ROLE for access control.", async () => {
  });
  it("Should have setup the deployer with the DEFAULT_ADMIN_ROLE for access control.", async () => {
  });
  it("Should have setup the deployer with the DEFAULT_ADMIN_ROLE for access control.", async () => {
  });
});


exports.module.scenario = () => {
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