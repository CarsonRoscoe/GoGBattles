import Web3 from 'web3';
import {ethers} from 'ethers';
import Web3Modal from 'web3modal';
import contractsRaw from './contracts/contracts';
import sortDeepObjectArrays from 'sort-deep-object-arrays';

const providerOptions = {
    /* See Provider Options Section */
};

const web3Modal = new Web3Modal({
    network: 'mumbai', // optional
    cacheProvider: true, // optional
    providerOptions // required
});

let provider = {};
let signer = {};
let web3 = {};

const Contracts = {};

const initializeContract = (identifier) => {
    Contracts[identifier] = new web3.eth.Contract(
        contractsRaw[identifier].ABI,
        contractsRaw[identifier].address
    );
};
async function initializeContractsAsync() {
    const accounts = await web3.eth.getAccounts();
    initializeContract('Token');
    initializeContract('Cards');
    initializeContract('CardFactory');
    initializeContract('Vault');
    initializeContract('MatchHistory');
    initializeContract('Coordinator');
    initializeContract('USDC');
    initializeContract('aUSDC');
    initializeContract('DAI');
    initializeContract('aDAI');
}

// const ContractHelper = {
//   Token : {
//     transferAsync: async (to, amount) => {
//       if (Contracts.Token != null) {
//           console.info(Contracts);
//           let transfer = Contracts.Token.methods.transfer(to, amount);
//           let result = transfer.send({
//               from: provider.signer.getAddress(),
//               gasPrice: 5
//           });
//           console.info(transfer, result);
//       } else {
//           console.info('Connect first');
//       } 
//     },
//     mintAsync: async(amount, to) => {

//     },
//   },
// }


class ObjectOrderer {
    constructor() {
    }

    getOrdered(objIn) {
        let dataOut = {};
        return this._orderObj(objIn, dataOut);
        //return dataOut;
    }

    _orderObj(objectIn) {
        return sortDeepObjectArrays(objectIn);
    }
}

let accounts = [];
let selectedAccountID = 0;
let signaturePromise = null;

class Helpers {
    async connectAsync(then) {
        console.info('Connecting');
        web3Modal.connect().then((__provider) => {
            provider = new ethers.providers.Web3Provider(__provider);
            signer = provider.getSigner();
            web3 = new Web3(provider);
            signer.getAddress().then((address) => {
                provider.selectedAddress = address;
            });

            console.info(provider, signer);

            if (provider.chainId == 137) {
                window.alert('Go on mumbai you idiot');
            }
            then({ provider, web3 });

            console.info('Already done');
            initializeContractsAsync().then(() => {
                console.info('Heh');
            }).catch( (error) => {
                console.info('Failed to intiialize contracts', error);
            });
        }).catch((error) => {
            console.info(error);
        });
        console.info('End method');
    }

    getWeb3() {
        return web3;
    }

    getProvider() {
        return provider;
    }

    getSigner() {
        return signer;
    }

    getSendOptions() { 
        return {
            from : provider.selectedAddress
        }
    }

    getLoginState() {
        if (signer == {}) {
            return 'Connect to MetaMask';
        } else if (provider.selectedAddress != null) {
            let address = provider.selectedAddress;
            return (
                'Connected to ' +
                address.substring(0, 6) +
                '...' +
                address.substring(address.length - 4, address.length)
            );
        }
        return '<unknown state>';
    }

    getContracts() {
        return Contracts;
    }

    isReady() {
        return web3 != null;
    }

    loadAccountFromPrivateKey(privateKey) {
        accounts.push(web3.eth.accounts.privateKeyToAccount(privateKey));
    }

    sign(message, callback) {
        if (signer != null) {
            signer.getAddress().then((address) => {
                let messageCleaned = this.sanitizeMessage(message);
                signer.signMessage(messageCleaned).then((result) => {
                    callback({
                        address:  address,
                        message: messageCleaned,
                        signature: result,
                    });
                }).catch((error) => {
                    console.info(error);
                });
            });
        }
        else {
            callback(null);
        }
    }

    signBattleLog(battleLog, callback) {
        this.sign(battleLog.messages, (signatureObj) => {
            let result = false;
            if (signatureObj != null) {
                result = battleLog.signLog(signatureObj.address, signatureObj.signature);
            }
            callback({result, signatureObj, battleLog});
        });
    }

    sanitizeMessage(message) {
        let ordered = new ObjectOrderer().getOrdered(message);
        let msg = JSON.stringify(ordered, (key, value) => {
            if (value != null) 
                return value;
        });
        console.info(msg);
        return msg;
    }

    verifySignature(message, address, signature) {
        return web3.eth.accounts.recover(this.sanitizeMessage(message), signature) == address;
    }

    verifyBattleLog(battleLog) {
        return this.verifySignature(battleLog.messages, battleLog.address, battleLog.signature);
    }
}

const helper = new Helpers();


export default helper;
