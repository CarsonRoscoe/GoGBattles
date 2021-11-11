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
  dapp.DummyLendingPoolAddressesProvider = await(await ethers.getContractFactory('DummyLendingPoolAddressesProvider')).deploy();
}

/**
 * 
    function setPoolToken(address tokenAddress) external;
    function authorizeAToken(address token, address aToken, uint decimals) external;
    function depositUnnormalizedDecimals(address owner, uint256 amountNormalized, address stable) external returns(bool);
    function withdrawNormalizedDecimals(address owner, uint256 amountNormalized, address stable) external returns(bool);
    function poolSize() external view returns(uint256);
    function accruePendingInterest() external returns(uint256);    
    function doesVaultTypeExist(address erc20Address) external view returns(bool);
    function balanceOfVaultsNormalizedDecimals() external view returns(uint256);
    function balanceOfVaultNormalizedDecimals(address erc20Address) external view returns(uint256);
 * 
 */

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
  
  it("depositUnnormalizedDecimals can deposit USDC and DAI & handle differing decimals", async () => {
    // let nonVaultTokenCannotBeDeposited = false;
    // try {
    //   await dapp.GoGBattlesToken.connect(user.Coordinator).mint(user.Coordinator.address, 1_000_000);
    // await expect(await dapp.GoGBattlesVault.connect(user.Coordinator).depositUnnormalizedDecimals());
    // } catch {
    //   nonVaultTokenCannotBeDeposited = true;
    // }
    
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
