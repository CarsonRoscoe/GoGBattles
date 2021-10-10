
import axios from 'axios';
import Web3Manager  from './Web3Manager';
import { BattleLogMessageType } from './game/Constants.js';
import { BattleLog } from './game/BattleManager';


const SERVER_URL = 'http://localhost:3093/';

const headers =  {
    headers : {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }
}


function URLSearchParams(data) {
    const ret = [];
    for (let d in data)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
 }

const createURL = (server, apiExtension,) => {
    return server + apiExtension + '/';
}

const messageReferee = (apiExtension, callback, errorCallback, payload) => {
    if (errorCallback == null) {
        errorCallback = (error) => {
            console.info(error);
        }
    }

    const url = createURL(SERVER_URL, apiExtension );
    // POST
    if (payload != null) {
        let postPromise = axios.post(url, payload, headers);
        postPromise.then((response) => {
            console.log(response);
            // valiadtion checks
            if (callback != null) {
                callback(response.data, payload);
            }
        });
        if (errorCallback != null) {
            postPromise.catch(errorCallback);
        }
    }
    // GET
    else {
        let getPromise = axios.get(url, headers);
        getPromise.then((response) => {
            console.log({ data : response.data, status : response.status,  statusText : response.statusText, headers : response.headers, config : response.config });
            // valiadtion checks
            if (callback != null) {
                callback(response.data);
            }
        });
        if (errorCallback != null) {
            getPromise.catch(errorCallback);
        }
    }
}

let sampleData = {};


class Web2Manager {
    isPlayerInQueueAsync(callback, errorResponse) {
        return messageReferee('isPlayerInQueue', callback, errorResponse);
    }

    createBattle(callback, errorResponse, address) {
        console.info(Web3Manager);
        let battleLog = new BattleLog();
        let data = {
            player1Address: Web3Manager.getSigner().getAddress()
        };
        battleLog.createLog(BattleLogMessageType.CREATE_BATTLE, data);
        Web3Manager.signBattleLog(battleLog, (result) => {
            console.info("Signed!", result);
            return messageReferee('createBattle', callback, errorResponse, result );
        });
    }

    changeBattleTurn( turn, callback, errorResponse) {
        let battleLog = new BattleLog();
        let data = {
            battleTurn : turn
        }
        battleLog.createLog(BattleLogMessageType.CHANGE_BATTLE_TURN, data);
        Web3Manager.signBattleLog(battleLog, (result) => {
            return messageReferee('changeBattleTurn', callback, errorResponse, result );
        });
    }

    claimWin(callback, errorResponse) {
        let battleLog = new BattleLog();
        let data = {
            winnerAddress: "0xeB5A8824c9497bD6536EB86882D8F671E195eEf7"
        };
        battleLog.createLog(BattleLogMessageType.CLAIM_WIN, data);
        Web3Manager.signBattleLog(battleLog, (result) => {
            return messageReferee('claimWin', callback, errorResponse, result);
        });
    }

    changeAdventurerGear(advCards, callback, errorResponse) {
        let battleLog = new BattleLog();
        let data = {
            advCards: advCards
        }
        battleLog.createLog(BattleLogMessageType.SET_CARDS, data);
        Web3Manager.signBattleLog(battleLog, (result) => {
            return messageReferee('changeAdventurerGear', callback, errorResponse, result);
        });
    }

    joinBattle(callback, errorResponse) {
        let battleLog = new BattleLog();
        let data = {
            player2Address: Web3Manager.getSigner().getAddress()
        };
        battleLog.createLog(BattleLogMessageType.JOIN_QUEUE, data);
        Web3Manager.signBattleLog(battleLog, (result) => {
            return messageReferee('joinBattle', callback, errorResponse, result);
        });
    }
}

const i = new Web2Manager();

export default i;

sampleData.createBattle = {
    "signedBattleLog": {
        "messages": [
            {
                "battleLogMessageType": "CREATE_BATTLE",
                "data": {
                    "player1Address": "0xc9d62E210917e662F8a2C5BA38d50773BF7A2398"
                }
            }
        ],
        "address": "0xc9d62E210917e662F8a2C5BA38d50773BF7A2398",
        "signature": "0xf744c48845bd157ac73795a014fdbc64820b8b5cc4a04488194fdb38dbb6d45c2f1fe6042abfe1af45ecd9d6ca430cade000f15577ed784d87eb256de8e381e61b"
    }
};

sampleData.changeBattleTurn = {
    "signedBattleLog": {
        "messages": [
            {
                "battleLogMessageType": "CREATE_BATTLE",
                "data": {
                    "player1Address": "0xc9d62E210917e662F8a2C5BA38d50773BF7A2398"
                },
                "signature": "0xf744c48845bd157ac73795a014fdbc64820b8b5cc4a04488194fdb38dbb6d45c2f1fe6042abfe1af45ecd9d6ca430cade000f15577ed784d87eb256de8e381e61b",
                "address": "0xc9d62E210917e662F8a2C5BA38d50773BF7A2398"
            },
            {
                "battleLogMessageType": "JOIN_BATTLE",
                "data": {
                    "player2Address": "0x96b2929A59eA58fd7195A15bFA582b08d8EcD3ce"
                },
                "signature": "0x9b1e46c28c14df5a4c302344994bddb13813d0a690af2f3c14f6c8702c99fe047f6f0c0749ba538f7555245f393983ee66d1dd6e1583d644ef06079296228d421c",
                "address": "0x96b2929A59eA58fd7195A15bFA582b08d8EcD3ce"
            },
            {
                "battleLogMessageType": "CHANGE_BATTLE_TURN",
                "data": {
                    "battleTurn": {
                        "advOrder": [
                            0,
                            1,
                            2,
                            3,
                            4
                        ],
                        "advMoves": [
                            "ATTACK_ADV0",
                            "ATTACK_ADV1",
                            "ATTACK_ADV2",
                            "ATTACK_ADV3",
                            "ATTACK_ADV4"
                        ],
                        "readyForNextTurn": true
                    }
                },
                "address": "0xc9d62E210917e662F8a2C5BA38d50773BF7A2398",
                "signature": "0xcf9e2eface25d90910e785d6dbbfc834f6dc0e5685c0411390c43cce2e6041c53f87f88227ed2107608d77274ad2fffc69098de470860653c9eb3ba739a987f91c"
            },
            {
                "battleLogMessageType": "CHANGE_BATTLE_TURN",
                "data": {
                    "battleTurn": {
                        "advOrder": [
                            0,
                            1,
                            2,
                            3,
                            4
                        ],
                        "advMoves": [
                            "ATTACK_ADV0",
                            "ATTACK_ADV1",
                            "ATTACK_ADV2",
                            "ATTACK_ADV3",
                            "ATTACK_ADV4"
                        ],
                        "readyForNextTurn": true
                    }
                }
            }
        ],
        "address": "0x96b2929A59eA58fd7195A15bFA582b08d8EcD3ce",
        "signature": "0xc2b73eedf4721c0269515af6b01e23fd5408e27cff1af19055a5576e998afe1301c7e2e7f6bab3db2a364e759e10173dbf71e632dfa9a020fb2d8c3697918e3d1c"
    }
};

sampleData.claimWin = {
    "signedBattleLog": {
        "messages": [
            {
                "battleLogMessageType": "CREATE_BATTLE",
                "data": {
                    "player1Address": "0xeB5A8824c9497bD6536EB86882D8F671E195eEf7"
                },
                "signature": "0x3b3cd59327c2de998a9099f1ff02f823f3a22ef08a9a50a7605d717d31044fde06e9b472b94995e9f4722695d97b34369a913c1f9df17d6a3691e7649878552d1c",
                "address": "0xeB5A8824c9497bD6536EB86882D8F671E195eEf7"
            },
            {
                "battleLogMessageType": "JOIN_BATTLE",
                "data": {
                    "player2Address": "0x080cCE1eb32B38D41Fc322E37f83708Fe26546Dc"
                },
                "signature": "0x5b79d71609ba6d7c88f5c8fa64fc3cbb2d41f20b0de1da1e74fc39dacab4bff21e8628dc6b5744251fc71ac778d873f7802e2faf3c87f80b90478413213ede951c",
                "address": "0x080cCE1eb32B38D41Fc322E37f83708Fe26546Dc"
            },
            {
                "battleLogMessageType": "CHANGE_BATTLE_TURN",
                "data": {
                    "battleTurn": {
                        "advOrder": [
                            4,
                            1,
                            2,
                            3,
                            0
                        ],
                        "advMoves": [
                            "ATTACK_ADV0",
                            "ATTACK_ADV1",
                            "ATTACK_ADV2",
                            "ATTACK_ADV3",
                            "ATTACK_ADV4"
                        ]
                    }
                },
                "signature": "0x5be4b454d124047900da602df918c0c8f22389448c5583da70c7ba8cc8ceaad9354a835cdcb0b402c09f0dee0ddafc75690d6b8d2a0b660da59f5e90ffae05e21c",
                "address": "0xeB5A8824c9497bD6536EB86882D8F671E195eEf7"
            },
            {
                "battleLogMessageType": "SET_CARDS",
                "data": {
                    "advCards": [
                        [],
                        [],
                        [],
                        [],
                        []
                    ]
                },
                "address": "0x080cCE1eb32B38D41Fc322E37f83708Fe26546Dc",
                "signature": "0x131174dd57b9afdc9d29a8fc4b2f04bd6ae0dd77cd0caaca75bf1e1c2e4225cd14271523227a17675435da6ae86d8904617eab4235a40e22f944df58900f38141c"
            },
            {
                "battleLogMessageType": "CLAIM_WIN",
                "data": {
                    "winnerAddress": "0xeB5A8824c9497bD6536EB86882D8F671E195eEf7"
                }
            }
        ],
        "address": "0xeB5A8824c9497bD6536EB86882D8F671E195eEf7",
        "signature": "0x2d60914bc4b9d6ca91b73ac99f8c6e00c0e8d416954192e2a9f823d677e7ea56416631374678e036afc52baa607616a3b3dacd0af158a7d05b89032e0785c92b1b"
    }
};

sampleData.changeAdventurerGear = {
    "signedBattleLog": {
        "messages": [
            {
                "battleLogMessageType": "CREATE_BATTLE",
                "data": {
                    "player1Address": "0xc9d62E210917e662F8a2C5BA38d50773BF7A2398"
                },
                "signature": "0xf744c48845bd157ac73795a014fdbc64820b8b5cc4a04488194fdb38dbb6d45c2f1fe6042abfe1af45ecd9d6ca430cade000f15577ed784d87eb256de8e381e61b",
                "address": "0xc9d62E210917e662F8a2C5BA38d50773BF7A2398"
            },
            {
                "battleLogMessageType": "JOIN_BATTLE",
                "data": {
                    "player2Address": "0x96b2929A59eA58fd7195A15bFA582b08d8EcD3ce"
                },
                "signature": "0x9b1e46c28c14df5a4c302344994bddb13813d0a690af2f3c14f6c8702c99fe047f6f0c0749ba538f7555245f393983ee66d1dd6e1583d644ef06079296228d421c",
                "address": "0x96b2929A59eA58fd7195A15bFA582b08d8EcD3ce"
            },
            {
                "battleLogMessageType": "SET_CARDS",
                "data": {
                    "advCards": [
                        [],
                        [],
                        [],
                        [],
                        []
                    ]
                },
                "address": "0xc9d62E210917e662F8a2C5BA38d50773BF7A2398",
                "signature": "0x54d462c8746444af699dac6fb7eb62770a2aba6bfe3876d286dc7fffcfb766430f5baff29c524a955262a790df24f762dbdb767d88e2723e0999cb5ac52dbe031b"
            },
            {
                "battleLogMessageType": "SET_CARDS",
                "data": {
                    "advCards": [
                        [],
                        [],
                        [],
                        [],
                        []
                    ]
                }
            }
        ],
        "address": "0x96b2929A59eA58fd7195A15bFA582b08d8EcD3ce",
        "signature": "0xebf07bfd9ae853e418801588cce97bc08442551f7425739c816dfc14daf3658a5468dd2b7f9fc594673a3e3b13300724735f842bc5fc32998272961dd90211851b"
    }
};

sampleData.joinBattle = {
    "signedBattleLog": {
        "messages": [
            {
                "battleLogMessageType": "CREATE_BATTLE",
                "data": {
                    "player1Address": "0xc9d62E210917e662F8a2C5BA38d50773BF7A2398"
                },
                "address": "0xc9d62E210917e662F8a2C5BA38d50773BF7A2398",
                "signature": "0xf744c48845bd157ac73795a014fdbc64820b8b5cc4a04488194fdb38dbb6d45c2f1fe6042abfe1af45ecd9d6ca430cade000f15577ed784d87eb256de8e381e61b"
            },
            {
                "battleLogMessageType": "JOIN_BATTLE",
                "data": {
                    "player2Address": "0x96b2929A59eA58fd7195A15bFA582b08d8EcD3ce"
                }
            }
        ],
        "address": "0x96b2929A59eA58fd7195A15bFA582b08d8EcD3ce",
        "signature": "0x9b1e46c28c14df5a4c302344994bddb13813d0a690af2f3c14f6c8702c99fe047f6f0c0749ba538f7555245f393983ee66d1dd6e1583d644ef06079296228d421c"
    }
};