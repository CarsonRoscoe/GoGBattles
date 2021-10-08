import Web3 from 'web3';
import Web3Modal from 'web3modal';
import contractsRaw from './contracts/contracts';

const providerOptions = {
    /* See Provider Options Section */
};

const web3Modal = new Web3Modal({
    network: 'mumbai', // optional
    cacheProvider: true, // optional
    providerOptions // required
});

let provider = {};
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
}

const token = {
    methods: {
        transferAsync: async (to, amount) => {
            if (Contracts.Token != null) {
                console.info(Contracts);
                let transfer = Contracts.Token.methods.transfer(to, amount);
                let result = transfer.send({
                    from: provider.selectedAddress,
                    gasPrice: 5
                });
                console.info(transfer, result);
            } else {
                console.info('Connect first');
            }
        }
    }
};

const cards = {
    burnForToken: (callback) => {
        window.alert('Open modal');
        return callback('burnForToken payload');
    },
    burnForStablecoins: (callback) => {
        window.alert('Open modal');
        return callback('burnForMoney payload');
    }
};

const helpers = {
    connectAsync: async (then) => {
        console.info('Connecting');
        provider = await web3Modal.connect();
        web3 = new Web3(provider);
        console.info('Already done');
        await initializeContractsAsync();

        if (provider.chainId == 137) {
            window.alert('Go on mumbai you idiot');
        }
        then({ provider, web3 });
    },
    getWeb3: () => web3,
    getProvider: () => provider,
    getLoginState: () => {
        if (provider.selectedAddress == null) {
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
    },
    token,
    cards
};

export default helpers;
