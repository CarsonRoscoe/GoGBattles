import React, { useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { getTestCards } from '../../test-data/cards';
import Deck from '../cards/Deck';
import Token, { tokenSizes } from '../adventurers/Token';
import TargetIndicator from './TargetIndicator';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { cardSizes } from '../cards/Card';
import ConnectButton from '../web3/ConnectButton';

const useGameStyles = createUseStyles({
    container: {
        alignItems: 'center',
        backgroundColor: 'sandybrown',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw'
    },
    deckWrapper: {
        alignItems: 'center',
        backgroundColor: 'lightgrey',
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        maxWidth: '80%',
        minWidth: '80%'
    },
    enemyTokens: {
        alignItems: 'center',
        backgroundColor: 'rosybrown',
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        maxHeight: '25%',
        minWidth: '80%'
    },
    friendlyTokens: {
        alignItems: 'center',
        backgroundColor: 'palegreen',
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        minWidth: '80%',
        maxHeight: '40%'
    }
});

const selectionTypes = {
    token: 'token',
    card: 'card'
};

const emptySelection = {
    type: null,
    key: null
};

const getGameSizes = (width) => {
    let cardSize;
    let tokenSize;

    if (width <= 1280) {
        cardSize = cardSizes.sm;
        tokenSize = tokenSizes.sm;
    } else if (width <= 1920) {
        cardSize = cardSizes.md;
        tokenSize = tokenSizes.md;
    } else {
        cardSize = cardSizes.lg;
        tokenSize = tokenSizes.lg;
    }

    return { cardSize, tokenSize };
};

const Game = () => {
    const classes = useGameStyles();

    // gets current window dimensions - used to scale cards/tokens appropriately
    const { width } = useWindowDimensions();
    // player's deck
    const [cards, setCards] = useState(getTestCards());
    // player's selection - key is index in deck when selecting card, token name when selecting a token
    const [selected, setSelected] = useState(emptySelection);
    // attack order
    const [moveOrder, setMoveOrder] = useState([]);
    // adventurer state
    const [tokens, setTokens] = useState({
        token1: {
            target: null, // target to attack/support
            cards: [] // equipped cards
        },
        token2: {
            target: null,
            cards: []
        },
        token3: {
            target: null,
            cards: []
        },
        token4: {
            target: null,
            cards: []
        },
        token5: {
            target: null,
            cards: []
        }
    });

    console.log('selected', selected);

    // refs @TODO try and clean up refs
    const token1Ref = useRef(null);
    const token2Ref = useRef(null);
    const token3Ref = useRef(null);
    const token4Ref = useRef(null);
    const token5Ref = useRef(null);
    const enemyToken1Ref = useRef(null);
    const enemyToken2Ref = useRef(null);
    const enemyToken3Ref = useRef(null);
    const enemyToken4Ref = useRef(null);
    const enemyToken5Ref = useRef(null);

    const refMap = {
        token1: token1Ref,
        token2: token2Ref,
        token3: token3Ref,
        token4: token4Ref,
        token5: token5Ref,
        enemyToken1: enemyToken1Ref,
        enemyToken2: enemyToken2Ref,
        enemyToken3: enemyToken3Ref,
        enemyToken4: enemyToken4Ref,
        enemyToken5: enemyToken5Ref
    };

    const { cardSize, tokenSize } = getGameSizes(width);
    console.log('width', width, ' = cardSize', cardSize, ' + tokenSize', tokenSize);

    /**
     * Extracts targets from `tokens` and `moveOrder` and prepares them to be rendered as `TargetIndicator`s
     * @returns {*[]}
     */
    const getTargets = () => {
        let targets = [];

        Object.entries(tokens).forEach(([key, value]) => {
            if (value.target !== null) {
                const isEnemy = value.target.startsWith('enemy');
                const startRef = refMap[key];
                const endRef = refMap[value.target];
                const order = moveOrder.indexOf(key) + 1;

                targets.push({ isEnemy, startRef, endRef, order });
            }
        });

        return targets;
    };

    /**
     * Attempt to attach the selected card from state to the adventurer.
     * @param {string} tokenKey - Adventurer key to equip card
     */
    const equipCard = (tokenKey) => {
        if (selected.type === selectionTypes.card && selected.key > -1) {
            // remove card from deck
            const card = cards[selected.key];
            const cardsCopy = [...cards];
            cardsCopy.splice(selected.key, 1);

            // equip card to token
            const tokensCopy = {
                ...tokens,
                [tokenKey]: {
                    ...tokens[tokenKey],
                    cards: [...tokens[tokenKey].cards, card]
                }
            };

            setTokens(tokensCopy);
            setCards(cardsCopy);
            setSelected(emptySelection);
        }
    };

    /**
     * Attempt to target an adventurer from the one that is actively selected.
     * @param {string} tokenKeyToTarget - Adventurer key to be targeted
     */
    const setTarget = (tokenKeyToTarget) => {
        const { type, key } = selected;

        // only allow targeting of enemy adventurers until support/heal is added
        if (type === selectionTypes.token && key && tokenKeyToTarget.startsWith('enemy')) {
            const tokensCopy = {
                ...tokens,
                [key]: {
                    ...tokens[key],
                    target: tokenKeyToTarget
                }
            };

            let newMoveOrder = [...moveOrder];

            const existingMove = newMoveOrder.indexOf(key);
            if (existingMove > -1) {
                newMoveOrder.splice(existingMove, 1);
            }

            setTokens(tokensCopy);
            setMoveOrder([...newMoveOrder, key]);
            setSelected(emptySelection);
        }
    };

    /**
     * Callback function for when an adventurer is clicked to handle equipping cards, targeting, and selecting
     * @param tokenKey
     */
    const onTokenClick = (tokenKey) => {
        // if card is selected during onTokenClick, equip it
        if (selected.type === selectionTypes.card && selected.key > -1) {
            equipCard(tokenKey);
        }
        // if token is selected during onTokenClick, try to target it
        if (selected.type === selectionTypes.token && selected.key) {
            setTarget(tokenKey);
        }
        // if token being clicked is already selected, clear the selection
        if (selected.type === selectionTypes.token && selected.key === tokenKey) {
            setSelected(emptySelection);
        }
        // if there is no active selection during onTokenClick, then select the token
        if (selected.type === null && !tokenKey.startsWith('enemy')) {
            setSelected({ type: selectionTypes.token, key: tokenKey });
        }
    };

    return (
        <div className={classes.container}>
            <div >
            
            <ConnectButton />
            </div>
            <div className={classes.enemyTokens}>
                <Token
                    tokenRef={enemyToken1Ref}
                    hp={30}
                    onClickCallback={() => onTokenClick('enemyToken1')}
                    size={tokenSize}
                />
                <Token
                    tokenRef={enemyToken2Ref}
                    hp={100}
                    onClickCallback={() => onTokenClick('enemyToken2')}
                    size={tokenSize}
                />
                <Token
                    tokenRef={enemyToken3Ref}
                    hp={100}
                    onClickCallback={() => onTokenClick('enemyToken3')}
                    size={tokenSize}
                />
                <Token
                    tokenRef={enemyToken4Ref}
                    hp={80}
                    onClickCallback={() => onTokenClick('enemyToken4')}
                    size={tokenSize}
                />
                <Token
                    tokenRef={enemyToken5Ref}
                    hp={50}
                    onClickCallback={() => onTokenClick('enemyToken5')}
                    size={tokenSize}
                />
            </div>
            {/* friendly tokens */}
            <div className={classes.friendlyTokens}>
                <Token
                    tokenRef={token1Ref}
                    isSelected={selected.key === 'token1'}
                    disableHover={selected.type !== null}
                    hp={30}
                    cards={tokens.token1.cards}
                    onClickCallback={() => onTokenClick('token1')}
                    size={tokenSize}
                />
                <Token
                    tokenRef={token2Ref}
                    isSelected={selected.key === 'token2'}
                    disableHover={selected.type !== null}
                    hp={100}
                    cards={tokens.token2.cards}
                    onClickCallback={() => onTokenClick('token2')}
                    size={tokenSize}
                />
                <Token
                    tokenRef={token3Ref}
                    isSelected={selected.key === 'token3'}
                    disableHover={selected.type !== null}
                    hp={100}
                    cards={tokens.token3.cards}
                    onClickCallback={() => onTokenClick('token3')}
                    size={tokenSize}
                />
                <Token
                    tokenRef={token4Ref}
                    isSelected={selected.key === 'token4'}
                    disableHover={selected.type !== null}
                    hp={80}
                    cards={tokens.token4.cards}
                    onClickCallback={() => onTokenClick('token4')}
                    size={tokenSize}
                />
                <Token
                    tokenRef={token5Ref}
                    isSelected={selected.key === 'token5'}
                    disableHover={selected.type !== null}
                    hp={50}
                    cards={tokens.token5.cards}
                    onClickCallback={() => onTokenClick('token5')}
                    size={tokenSize}
                />
            </div>
            <div className={classes.deckWrapper}>
                <Deck
                    selected={Number.isInteger(selected.key) ? selected.key : -1}
                    cards={cards}
                    cardSize={cardSize}
                    onSelectedCallback={(i) => {
                        setSelected({ type: selectionTypes.card, key: i });
                    }}
                />
            </div>
            {getTargets().map(({ isEnemy, startRef, endRef, order }) => (
                <TargetIndicator
                    isEnemy={isEnemy}
                    startRef={startRef}
                    endRef={endRef}
                    order={order}
                />
            ))}
        </div>
    );
};

export default Game;
