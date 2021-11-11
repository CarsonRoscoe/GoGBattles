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

  dapp.USDC = await (await ethers.getContractFactory('DummyUSDC')).deploy();
  dapp.aUSDC = await (await ethers.getContractFactory('DummyaUSDC')).deploy();
  dapp.DAI = await (await ethers.getContractFactory('DummyDAI')).deploy();
  dapp.aDAI = await (await ethers.getContractFactory('DummyaDAI')).deploy();
  dapp.LendingPoolAddressesProvider = await(await ethers.getContractFactory('DummyLendingPoolAddressesProvider')).deploy(dapp.USDC.address, dapp.aUSDC.address, dapp.DAI.address, dapp.aDAI.address);
}

describe('GoG: Battles\' Vault Test Suite', () => {
  it('Scenario_V1 Loaded', async () => { await resetScenario(); });

  it("setPoolToken can set GoGBattlesToken", async () => {
    let publicSettingFailed = false;
    try {
      await expect(await dapp.GoGBattlesVault.connect(user.Chris).setPoolToken(dapp.GoGBattlesToken.address));
    } catch{
      publicSettingFailed = true;
    }
    await expect(publicSettingFailed);
    await expect(await dapp.GoGBattlesVault.connect(user.Deployer).setPoolToken(dapp.GoGBattlesToken.address));
  });

  it("setLendingPoolAddressesProvider can set AAVE lending pool addresses provider", async () => {
    let publicSettingFailed = false;
    try {
      await expect(await dapp.GoGBattlesVault.connect(user.Chris).setLendingPoolAddressesProvider(dapp.LendingPoolAddressesProvider.address));
    } catch{
      publicSettingFailed = true;
    }
    await expect(publicSettingFailed);
    await expect(await dapp.GoGBattlesVault.connect(user.Deployer).setLendingPoolAddressesProvider(dapp.LendingPoolAddressesProvider.address));
  });

  it("Deployer is setup with the proper roles for access control.", async () => {
    await expect(await dapp.GoGBattlesVault.hasRole(roles.DEFAULT_ADMIN_ROLE, user.Deployer.address));
    await expect(await dapp.GoGBattlesVault.hasRole(roles.COORDINATOR_ROLE, user.Deployer.address));
    await expect(await dapp.GoGBattlesVault.hasRole(roles.TOKEN_GATEKEEPER_ROLE, user.Deployer.address));
  });

  it("Deployer can assign COORDINATOR_ROLE and restrict itself.", async () => {
    await expect(await dapp.GoGBattlesVault.grantRole(roles.COORDINATOR_ROLE, user.Coordinator.address));
    await expect(await dapp.GoGBattlesVault.renounceRole(roles.COORDINATOR_ROLE, user.Deployer.address));

    await expect(await dapp.GoGBattlesVault.hasRole(roles.COORDINATOR_ROLE, user.Coordinator.address));
    await expect(await dapp.GoGBattlesVault.hasRole(roles.COORDINATOR_ROLE, user.Deployer.address)).to.equal(false);
  });

  it("authorizeAToken can authorize USDC and DAI & handle differing decimals", async () => {
    let publicSettingFailed = false;
    try {
      await expect(await dapp.GoGBattlesVault.connect(user.Chris).authorizeAToken(dapp.USDC.address, dapp.aUSDC.address));
    } catch{
      publicSettingFailed = true;
    }
    await expect(publicSettingFailed);
    await expect(await dapp.GoGBattlesVault.connect(user.Deployer).authorizeAToken(dapp.USDC.address, dapp.aUSDC.address));
    await expect(await dapp.GoGBattlesVault.connect(user.Deployer).authorizeAToken(dapp.DAI.address, dapp.aDAI.address));
  });
  
  it("doesVaultTypeExist can detect USDC and DAI", async () => {
    let nonVaultTokenIsNotVaultType = false;
    try {
    await expect(await dapp.GoGBattlesVault.doesVaultTypeExist(dapp.GoGBattlesToken.address));
    } catch {
      nonVaultTokenIsNotVaultType = true;
    }
    await expect(nonVaultTokenIsNotVaultType);
    await expect(await dapp.GoGBattlesVault.doesVaultTypeExist(dapp.USDC.address));
    await expect(await dapp.GoGBattlesVault.doesVaultTypeExist(dapp.DAI.address));
  });

  it("convert can properly convert decimals", async () => {
    await expect(await dapp.GoGBattlesVault.convertAmount(dapp.USDC.address, 1, dapp.DAI.address)).to.equal(1_000_000_000_000);
    await expect(await dapp.GoGBattlesVault.convertAmount(dapp.DAI.address, 1_000_000_000_000, dapp.USDC.address)).to.equal(1);
  });
  
  it("deposit can deposit USDC and DAI & handle differing decimals", async () => {
    await dapp.GoGBattlesToken.connect(user.Deployer).mint(user.Coordinator.address, 1_000_000);
    await dapp.GoGBattlesToken.connect(user.Deployer).approve(dapp.GoGBattlesVault.address, 1_000_000);
    let nonVaultTokenCannotBeDeposited = false;
    try {
    await expect(await dapp.GoGBattlesVault.connect(user.Coordinator).deposit( user.Chris.address, 1_000_000, dapp.GoGBattlesToken.address ));
    } catch {
      nonVaultTokenCannotBeDeposited = true;
    }

    let balanceBefore = {
      Coordinator : {
        USDC : (await dapp.USDC.balanceOf(user.Coordinator.address)).toNumber(),
        aUSDC : (await dapp.aUSDC.balanceOf(user.Coordinator.address)).toNumber(),
      },
      Vault : {
        USDC : (await dapp.USDC.balanceOf(dapp.GoGBattlesVault.address)).toNumber(),
        aUSDC : (await dapp.aUSDC.balanceOf(dapp.GoGBattlesVault.address)).toNumber(),
      },
    }

    // Deposit 1000 USDC
    await dapp.USDC.connect(user.Coordinator).mint(user.Coordinator.address, 1);
    await dapp.USDC.connect(user.Coordinator).approve(dapp.GoGBattlesVault.address, 1);
    await expect(await dapp.GoGBattlesVault.connect(user.Coordinator).deposit( user.Chris.address, 1000_000_000_000, dapp.USDC.address ));
    
    let balanceAfter = {
      Coordinator : {
        USDC : (await dapp.USDC.balanceOf(user.Coordinator.address)).toNumber(),
        aUSDC : (await dapp.aUSDC.balanceOf(user.Coordinator.address)).toNumber(),
      },
      Vault : {
        USDC : (await dapp.USDC.balanceOf(dapp.GoGBattlesVault.address)).toNumber(),
        aUSDC : (await dapp.aUSDC.balanceOf(dapp.GoGBattlesVault.address)).toNumber(),
      },
    }

    await expect(balanceAfter.Coordinator.USDC - balanceBefore.Coordinator.USDC == -1000_000_000);
    await expect(balanceAfter.Coordinator.aUSDC - balanceBefore.Coordinator.aUSDC == 1000_000_000);
    await expect(balanceAfter.Vault.USDC - balanceBefore.Vault.USDC == 1000_000_000);
    await expect(balanceAfter.Vault.aUSDC - balanceBefore.Vault.aUSDC == -1000_000_000);

  });
  
  it("balanceofVaultsNormalizedDecimals can get the balances in e18 form", async () => {
    
  });
  
  it("balanceofVaultNormalizedDecimals can get the balances in e18 form", async () => {

  });
  
  
  it("withdrawNormalizedDecimals withdraws USDC & DAI in their unnormalized decimals form", async () => {

  });
  
  it("poolSize can accurately determine the size of the pool", async () => {

  });
  
  it("accruePendingInterest will claim interest and allocated to appropriate pools", async () => {

  });
});
