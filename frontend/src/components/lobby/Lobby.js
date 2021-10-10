import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import { getTestCards } from '../../test-data/cards';
import Deck from '../cards/Deck';
import Card from '../cards/Card';
import Button from '../inputs/Button';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { cardSizes } from '../cards/Card';
import Web3Manager from '../../Web3Manager';
import Web2Manager from '../../Web2Manager';
import { TransferTokenModalContent, TransferCardModalContent, BurnTokenForStablecoinModalContent, BurnCardForTokenModalContent, MintCardPackModalContent } from './Modals';
import battleManagerInstance, { BattleLog, BattleLogSimulator } from '../../game/BattleManager';

import Modal from '@mui/material/Modal';
import { BattleLogMessageType } from '../../game/Constants';

const useLobbyStyles = createUseStyles({
    container: {
        alignItems: 'center',
        backgroundColor: 'sandybrown',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw'
    },
    bottom: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        height: '30%',
        width: '100%'
    },
    left: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        width: '20%'
    },
    middle: {
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        width: '40%'
    },
    right: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        width: '20%'
    },
    selectedCardOptions: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 25
    },
    selectedCardOptionsHeader: {
        marginLeft: 5
    },
    top: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '70%',
        width: '100%'
    }
});

const getLobbySizes = (width) => {
    let cardSize;

    if (width <= 1280) {
        cardSize = cardSizes.md;
    } else if (width <= 1920) {
        cardSize = cardSizes.lg;
    } else {
        cardSize = cardSizes.xl;
    }

    return { cardSize };
};

const testCards = getTestCards();

const Lobby = () => {
    const classes = useLobbyStyles();
    const history = useHistory();
    const { width } = useWindowDimensions();

    const cards = testCards; // @TODO fetch from account
    const [selectedCardIndex, setSelectedCardIndex] = useState(-1);
    const [isTransferCardModalOpen, setIsTransferCardModalOpen] = useState(false);
    const [isTransferTokenModalOpen, setIsTransferTokenModalOpen] = useState(false);
    const [isBurnTokenForStablecoinModalOpen, setIsBurnTokenForStablecoinModalOpen] = useState(false);
    const [isBurnCardForTokenModalOpen, setIsBurnCardForTokenModalOpen] = useState(false);
    const [isMintCardPackModalOpen, setIsMintCardPackModalOpen] = useState(false);
    const [metaMaskButtonText, setMetaMaskButtonText] = useState(Web3Manager.getLoginState());
    const [tokenBalance, setTokenBalance] = useState(0);
    const [backedBalance, setBackedBalance] = useState(0);

    const [isInGame, setIsInGame] = useState(false);
    const [isWaitingForGame, setIsWaitingForGame] = useState(false);
    const [enemyName, setEnemyName] = useState('Waiting for a player to connect...');
    const [startBattleText, setStartBattleText] = useState('Start Battle');
    

    Web2Manager.isPlayerInQueueAsync((isPlayerInQueueResult) => {
        if (isPlayerInQueueResult) {
            setStartBattleText('Join Battle');
        }
        else {
            setStartBattleText('Create Battle');
        }
    });

    let refreshBalances = () => {
        Web3Manager.contracts.Token.methods.balanceOf(Web3Manager.getSigner().getAddress()).call().then((balanceStr) => {
            let balance = Number.parseFloat(balanceStr);
            setTokenBalance(balance);
            Web3Manager.contracts.Cards.methods.backingBalanceOf(Web3Manager.getSigner().getAddress()).call().then((cardValueStr) => {
                let cardValue = Number.parseFloat(cardValueStr);
                setBackedBalance(balance + cardValue);
            }).catch((e) => {
                console.info(e);
            });
        }).catch((e) => {
            console.info(e);
        });
    }

    const { cardSize } = getLobbySizes(width);

      const onPlay = () => {
        console.info('[Start Battle]');
        Web2Manager.isPlayerInQueueAsync((isPlayerInQueueResult) => {
            console.info('isPlayerInQueueAsync: ', isPlayerInQueueResult);
            if (isPlayerInQueueResult) {
                Web2Manager.joinBattle((joinBattleResult) => {
                    console.info('joinBattle: ', joinBattleResult);
                    setIsInGame(true);
                    setEnemyName(joinBattleResult);
                    battleManagerInstance.createBattleSimulator(joinBattleResult);
                    history.push('/play');
                });
            } else {
                Web2Manager.createBattle(((createBattleResult) => {
                    console.info('createBattle: ', createBattleResult);
                    console.info(createBattleResult);
                    setIsWaitingForGame(true);
                    battleManagerInstance.createBattleSimulator(createBattleResult);
                    history.push('/play');
                }));
            }
        });
    }

    return (
        <div className={classes.container}>
            <div className={classes.top}>
                <div className={classes.left}>
                    <Button color="indianred" textColor="white" text={startBattleText} onClick={onPlay} />
                </div>
                <div className={classes.middle}>
                    {selectedCardIndex >= 0 && (
                        <>
                            <Card isSelected size={cardSize} {...cards[selectedCardIndex]} />
                            <div className={classes.selectedCardOptions}>
                                <h3
                                    className={
                                        classes.selectedCardOptionsHeader
                                    }
                                >
                                    Backed Value:{' '}
                                    {cards[selectedCardIndex].GOGTokenValue}
                                </h3>
                                <Button
                                    color="cadetblue"
                                    textColor="white"
                                    text="Send to User"
                                    onClick={() => setIsTransferCardModalOpen(true)}
                                />
                                <Button
                                    color="cadetblue"
                                    textColor="white"
                                    text="Burn for Token"
                                    onClick={() => setIsBurnCardForTokenModalOpen(true)}
                                />
                            </div>
                        </>
                    )}
                </div>
                <div className={classes.right}>
                    <Button
                        color="indianred"
                        textColor="white"
                        text={metaMaskButtonText}
                        onClick={() => {
                            Web3Manager.connectAsync((res) => {
                                setMetaMaskButtonText(
                                    Web3Manager.getLoginState()
                                );
                                refreshBalances();
                            });
                        }}
                    />
                    <h3>Token Balance: {tokenBalance}</h3>
                    <h3>Token Backed: {backedBalance}</h3>
                    <Button
                        color="cadetblue"
                        textColor="white"
                        text="Transfer Token"
                        onClick={() => setIsTransferTokenModalOpen(true)}
                    >
                        Transfer
                    </Button>
                    <Button
                        color="cadetblue"
                        textColor="white"
                        text="Mint Pack"
                        onClick={() => setIsMintCardPackModalOpen(true)}
                    >
                        Mint Pack
                    </Button>
                    <Button
                        color="cadetblue"
                        textColor="white"
                        text="Burn for Stablecoins"
                        onClick={() => setIsBurnTokenForStablecoinModalOpen(true)}
                    >
                        Withdraw
                    </Button>
                </div>
            </div>
            <div className={classes.bottom}>
                <Deck
                    selected={selectedCardIndex}
                    cards={cards}
                    cardSize="md"
                    onSelectedCallback={(i) => setSelectedCardIndex(i)}
                />
            </div>
            <Modal
                open={isTransferCardModalOpen}
                onClose={() => setIsTransferCardModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <TransferCardModalContent />
            </Modal>
            <Modal
                open={isBurnTokenForStablecoinModalOpen}
                onClose={() => setIsBurnTokenForStablecoinModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <BurnTokenForStablecoinModalContent />
            </Modal>
            <Modal
                open={isBurnCardForTokenModalOpen}
                onClose={() => setIsBurnCardForTokenModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <BurnCardForTokenModalContent />
            </Modal>
            <Modal
                open={isTransferTokenModalOpen}
                onClose={() => setIsTransferTokenModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <TransferTokenModalContent />
            </Modal>
            <Modal
                open={isMintCardPackModalOpen}
                onClose={() => setIsMintCardPackModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <MintCardPackModalContent />
            </Modal>
        </div>
    );
};

export default Lobby;


let battleTurn = () => {
    return {
        battleTurn : {
            advOrder : [
                0,
                1,
                2,
                3,
                4
            ],
            advMoves: [
                "ATTACK_ADV0",
                "ATTACK_ADV1",
                "ATTACK_ADV2",
                "ATTACK_ADV3",
                "ATTACK_ADV4"
            ],
            readyForNextTurn: true
        }
    }
};

setTimeout(() => {
    let simulator = new BattleLogSimulator();
    Web2Manager.createBattle((success, result) => {
        console.info(success, result);
        let battleLog = result.battleLog;
        
        console.info('Created battle.', success, battleLog);
        simulator.addMessage(battleLog.message, battleLog.address, battleLog.signature );

        // P2 joins P1 battle
        Web2Manager.joinBattle((success, battleLog) => {
            console.info('Joined battle.');
            simulator.addMessage(battleLog.message, battleLog.address, battleLog.signature );

            // P1 picks his moves
            Web2Manager.changeAdventurerGear({}, (success, battleLog) => {
                console.info('Set gear');
                simulator.addMessage(battleLog.message, battleLog.address, battleLog.signature );

                // P2 picks his moves
                Web2Manager.changeAdventurerGear({}, (success, battleLog) => {
                    console.info('Set gear 2');
                    simulator.addMessage(battleLog.message, battleLog.address, battleLog.signature );

                    // P1 picks his moves
                    Web2Manager.changeBattleTurn(battleTurn(), (success, battleLog) => {
                        console.info('Picked moves');
                        simulator.addMessage(battleLog.message, battleLog.address, battleLog.signature );

                        // P2 picks his moves
                        Web2Manager.changeBattleTurn(battleTurn(), (success, battleLog) => {
                            console.info('Picked moves')
                            simulator.addMessage(battleLog.message, battleLog.address, battleLog.signature );


                            // P2 picks his moves
                            Web2Manager.claimWin((success, battleLog) => {
                                simulator.addMessage(battleLog.message, battleLog.address, battleLog.signature );

                                console.info(simulator);


                            })

                        })
                    });

                })
            });
        });

    }, (error) => {
        console.info("HELLO?");
    }, Web3Manager.getProvider().selectedAddress);
}, 10_000);