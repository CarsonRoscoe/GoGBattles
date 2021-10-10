const { Relayer } = require('defender-relay-client');
const { DefenderRelaySigner, DefenderRelayProvider } = require('defender-relay-client/lib/web3');
const { ethers } = require('ethers');
const Web3 = require('web3');
const ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"playerOne","type":"address"},{"indexed":true,"internalType":"address","name":"playerTwo","type":"address"},{"indexed":false,"internalType":"string","name":"ipfs","type":"string"},{"indexed":false,"internalType":"uint256","name":"matchID","type":"uint256"}],"name":"Match","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"matchID","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"MatchResult","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenID","type":"uint256"}],"name":"RewardPrize","type":"event"},{"inputs":[{"internalType":"address","name":"playerOne","type":"address"},{"internalType":"address","name":"playerTwo","type":"address"},{"internalType":"string","name":"ipfs","type":"string"}],"name":"claimMatchComplete","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"winner","type":"address"},{"internalType":"uint256","name":"matchID","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"prizeID","type":"uint256"}],"name":"confirmMatchResults","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"referee","type":"address"}],"name":"setReferee","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const matchSignature = 'claimMatchComplete(address,address,string)';
const axios = require('axios');
const vm = require('vm');

const simulationIPFS = 'bafkreifucojelb6npgqbkpxmnvet7emnyzcvzfgr2ag47w7fxj2fxsgoza'; // raw func
const contract = '0xaec1f81d61132e3b2afcc24b5a6af6a48eada9f0';

const ipfs_url_from_hash = (ipfsHash) => {
  return "https://ipfs.io/ipfs/" + ipfsHash;
}

exports.handler = async function(payload) {
  const relayer = new Relayer(payload);
  const provider = new DefenderRelayProvider(payload, {speed: 'fast'});
  const web3 = new Web3(provider);
  // const signer = new DefenderRelaySigner(payload, provider, { speed: 'fastest' });
  const [from] = await web3.eth.getAccounts();

  if (payload != null && payload.request != null && payload.request.body != null && payload.request.body.events != null && payload.request.body.events.length == 1) {
    const event = payload.request.body.events[0];
    if (event.matchReasons.length == 1 && event.matchReasons[0].signature == matchSignature && event.transaction.logs.length > 0) {
      const gogBattles = new web3.eth.Contract(ABI, contract, {from});
      let abiCoder = ethers.utils.defaultAbiCoder;
  
      let log = event.transaction.logs[0];

      let decoded = abiCoder.decode(['string', 'uint'], log.data);
      let playerOne = abiCoder.decode(['address'], log.topics[1])[0];
      let playerTwo = abiCoder.decode(['address'], log.topics[2])[0];
      let ipfs = decoded[0];
      let matchID = decoded[1].toNumber();
      
      if (ipfs != null && ipfs.length >= 49) {
        let url = ipfs_url_from_hash(ipfs);
        let result = await axios.get(url);
        if (result.data) {
          let gameData = result.data;

          url = ipfs_url_from_hash(simulationIPFS);
          result = await axios.get(url);
          if (result.data) {
            let simulationFunc = new Function('return ' + result.data)();
            if (simulationFunc && typeof simulationFunc == 'function') {
              if (simulationFunc(gameData)) {
                const tx = await gogBattles.methods.confirmMatchResults(playerOne, matchID, event.timestamp, 0, ).send();
                console.info('Winner won');
              }
              else {
                const tx = await gogBattles.methods.confirmMatchResults(playerTwo, matchID, event.timestamp, 0, ).send();
                console.info('Claimed winner either lost or lied, either way, loser won');
              }
            }
          }
        }
      }
    }
    else {
      console.info('Failed here', event);
    }
  }
  else {
    console.info('Did not hit');
  }
  return true;
}
