import Web3 from 'web3';
import Web3Modal from 'web3modal';

const providerOptions = {
    /* See Provider Options Section */
};

const web3Modal = new Web3Modal({
    network: 'polygon', // optional
    cacheProvider: true, // optional
    providerOptions // required
});

let provider = {};
let web3 = {};

const token = {
    methods: {
        transfer: (to, amount) => {
            console.info('transfer ', to, amount);
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
