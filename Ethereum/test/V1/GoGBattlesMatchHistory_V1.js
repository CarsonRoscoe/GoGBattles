const { Contract, ContractFactory } = require('@ethersproject/contracts');
const { SignerWithAddress } = require('@nomiclabs/hardhat-ethers/signers');
const { arrayify } = require('@ethersproject/bytes');
const { expect } = require('chai');
const { Wallet } = require('ethers');
const { ethers } = require('hardhat');

const Scenario_V1 = require('./V1.js');

let fullNames = {};
let dappFactory = {};
let dapp = {};
let user = {}
let roles = {};

async function resetScenario() {
  await Scenario_V1.resetScenarioAsync();
  let scenario = Scenario_V1.getScenario();
  fullNames = scenario.fullNames;
  dappFactory = scenario.dappFactory;
  dapp = scenario.dapp;
  user = scenario.user;
  roles = scenario.roles;
}

describe('GoG: Battles\' Match History Test Suite', () => {
  it('Scenario_V1 Loaded', async () => { await resetScenario(); });

  it("Deployer is setup with the proper roles for access control.", async () => {
    await expect(await dapp.GoGBattlesMatchHistory.hasRole(roles.DEFAULT_ADMIN_ROLE, user.Deployer.address));
    await expect(await dapp.GoGBattlesMatchHistory.hasRole(roles.COORDINATOR_ROLE, user.Deployer.address));
  });

  it("Deployer can assign COORDINATOR_ROLE and restrict itself.", async () => {
    await expect(await dapp.GoGBattlesMatchHistory.grantRole(roles.COORDINATOR_ROLE, user.Coordinator.address));
    await expect(await dapp.GoGBattlesMatchHistory.renounceRole(roles.COORDINATOR_ROLE, user.Deployer.address));

    await expect(await dapp.GoGBattlesMatchHistory.hasRole(roles.COORDINATOR_ROLE, user.Coordinator.address));
    await expect(await dapp.GoGBattlesMatchHistory.hasRole(roles.COORDINATOR_ROLE, user.Deployer.address)).to.equal(false);
  });
  it("Only the coordinator can call publishMatch", async () => {
    let deployedPublished = null;
    let bobPublished = null;

    try {
      await dapp.GoGBattlesMatchHistory.connect(user.Deployer).publishMatch(user.Deployer.address, user.Jane.address, 0, '0x0');
      deployedPublished = true;
    }
    catch(e) {
      deployedPublished = false;
    }

    try {
      await dapp.GoGBattlesMatchHistory.connect(user.Bob).publishMatch(user.Bob.address, user.Jane.address, 0, '0x0');
      bobPublished = true;
    }
    catch(e) {
      bobPublished = false;
    }
    await dapp.GoGBattlesMatchHistory.connect(user.Coordinator).publishMatch(user.Jane.address, user.Bob.address, 0, '0x0');

    await expect(deployedPublished).to.equal(false);
    await expect(bobPublished).to.equal(false);
  });
});
