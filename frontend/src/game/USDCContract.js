import cardGeneratorInstance from "./CardGenerator";

export default class USDCContract {
    constructor() {
        this.APYRate = 0.07; //7%
        this.accounts = {};
        this.totalUSDCDeposited = 0;
    }

    depositUSDC(address, USDC) {
        if (this.accounts[address] == null) {
            this.accounts[address] = {
                USDCDeposited: 0,
            };
        }
        this.accounts[address].USDCDeposited += USDC;
        this.totalUSDCDeposited += USDC;

        return cardGeneratorInstance.rollCards(USDC);
    }

    withdrawUSDC(address, USDC) {
        if (this.accounts[address] == null) {
            return;
        }
        let amtToRemove = Math.min(Math.max(0, USDC), this.accounts[address].USDCDeposited);
        this.accounts[address].USDCDeposited -= amtToRemove;
        this.totalUSDCDeposited -= amtToRemove;
    }

    addDayInterest() {
        let dailyRate = 1 + (this.APYRate * 1/365);
        this.totalUSDCDeposited = 0;
        let accKeys = Object.keys(this.accounts);
        for (let i = 0; i < accKeys.length; ++i) {
            this.accounts[accKeys[i]].USDCDeposited *= dailyRate;
            this.totalUSDCDeposited += this.accounts[accKeys[i]].USDCDeposited;
        }
    }
}