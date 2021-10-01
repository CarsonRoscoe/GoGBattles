const RefereeAutoTask = require('./RefereeJustMatch');
const matchSignature = 'claimMatchComplete(address,address,string)';

console.info(JSON.stringify(require('./SampleSimulation')));

let event = {
    transaction : {
        logs : [
            {
                address: '0xaec1f81d61132e3b2afcc24b5a6af6a48eada9f0',
                topics: [
                  '0x1310d39a4147ffba5cca8e094b4972ec519b60b4a3452695cd29d43b2c3592dc',
                  '0x000000000000000000000000afdc4cb1ce640ffb3e1250e0b5c7baf496fefe54',
                  '0x00000000000000000000000043a37b93b5930a978f325c426d38233bc464cb5a'
                ],
                data: '0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000b000000000000000000000000000000000000000000000000000000000000000849576f6e48616861000000000000000000000000000000000000000000000000',
                blockNumber: '0x12cf2df',
                transactionHash: '0x88eab1fdbfec9b4d99a2a0ff1e59eb306ae1c310b34468997f003e55d07d845b',
                transactionIndex: '0xe9',
                blockHash: '0xc5ab74684c3a4bde795f0eeb98a84b27b2e67ec5c8ec1ee3ec3bc64e5c2fc80e',
                logIndex: '0x1dd',
                removed: false
              }
        ]
    },
    matchReasons : [
        {
            signature : matchSignature
        }
    ],
    timestamp : 1000
}

let payload = {
    request : {
        body : {
            events : [
                event
            ]
        }
    },
    apiKey : 'J5KKk4DRohLECas2ZgaASJjHGRZ1hwWr',
    apiSecret : '2C7ERBhBcHnDTrRAUpy9FNBwgAuGV6LWc7CLE1dwxgcJbmET4hqFdA6zwrd5JsDB'
};

RefereeAutoTask.handler(payload).then((r) => {
    console.info(r);
})