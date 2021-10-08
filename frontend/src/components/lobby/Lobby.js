import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { getTestCards } from '../../test-data/cards';
import Deck from '../cards/Deck';
import Card from '../cards/Card';
import Button from '../inputs/Button';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { cardSizes } from '../cards/Card';
import web3Helpers from '../../web3Helpers';
import Modals from './Modals';

import Modal from '@mui/material/Modal';

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
    const { width } = useWindowDimensions();

    const cards = testCards; // @TODO fetch from account
    const [selectedCardIndex, setSelectedCardIndex] = useState(-1);
    const [metaMaskButtonText, setMetaMaskButtonText] = useState(web3Helpers.getLoginState());
    const [modal, setModal] = useState(<Button></Button>);
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalContent, setModalContent] = React.useState(<div>I am a modal</div>);
    const [modalStyle, setModalStyle] = React.useState(<div>I am a modal</div>);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const { cardSize } = getLobbySizes(width);

    return (
        <div className={classes.container}>
            <div className={classes.top}>
                <div className={classes.left}>
                    <Button
                        color="indianred"
                        textColor="white"
                        text="Find Game"
                        onClick={undefined}
                    />
                </div>
                <div className={classes.middle}>
                    {selectedCardIndex >= 0 && (
                        <>
                            <Card
                                isSelected
                                size={cardSize}
                                {...cards[selectedCardIndex]}
                            />
                            <div className={classes.selectedCardOptions}>
                                <h3 className={classes.selectedCardOptionsHeader}>
                                    Backed Value: {cards[selectedCardIndex].tokenValue}
                                </h3>
                                <Button
                                    color="cadetblue"
                                    textColor="white"
                                    text="Send to User"
                                    onClick={() => {
                                        setModalContent(Modals.transfer.content);
                                        setModalStyle(Modals.transfer.style);
                                        openModal();
                                    }}
                                />
                                <Button
                                    color="cadetblue"
                                    textColor="white"
                                    text="Burn for Token"
                                    onClick={() => {
                                        web3Helpers.cards.burnForToken((res) => {
                                            setMetaMaskButtonText(web3Helpers.getLoginState());
                                        });
                                    }}
                                />
                                <Button
                                    color="cadetblue"
                                    textColor="white"
                                    text="Burn for Stablecoins"
                                    onClick={() => {
                                        web3Helpers.cards.burnForStablecoins((res) => {
                                            setMetaMaskButtonText(web3Helpers.getLoginState());
                                        });
                                    }}
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
                        onClick= {() => {
                            web3Helpers.connectAsync((res) => {
                                setMetaMaskButtonText(web3Helpers.getLoginState());
                            });
                        }}
                    >
                        
                    </Button>
                    <h3>Token Balance: [tokenBalance]</h3>
                    <h3>Token Backed: [tokenBacked]</h3>
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
                open={modalIsOpen}
                onClose={closeModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                {modalContent}
            </Modal>
        </div>
    )

};

export default Lobby;
