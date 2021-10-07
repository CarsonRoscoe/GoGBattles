import Web3 from "web3";
import Web3Modal from "web3modal";

const providerOptions = {
  /* See Provider Options Section */
};

const web3Modal = new Web3Modal({
  network: "polygon", // optional
  cacheProvider: true, // optional
  providerOptions // required
});

let provider = {};
let web3 = {};


const helpers = {
  connectAsync: async () => {
      provider = await web3Modal.connect();;
      web3 = new Web3(provider);
      return { provider, web3 };
  },
  getWeb3: () => web3,
  getProvider: () => provider
}

export default helpers