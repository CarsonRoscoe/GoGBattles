import React, { useEffect, useState, useReducer, useRef } from 'react';
import { createUseStyles } from 'react-jss';
// reducers
import { adventurersReducer, adventurersInitialState, adventurerActionTypes } from '../../reducers/adventurersReducer';
// hooks
import useWindowDimensions from '../../hooks/useWindowDimensions';
// components
import Deck from '../cards/Deck';
import Adventurer, { adventurerSizes } from '../adventurers/Adventurer';
import TargetIndicator from './TargetIndicator';
import Button from '../inputs/Button';
import { cardSizes } from '../cards/Card';
// test-data
import { getTestCards } from '../../test-data/cards';

const useGameStyles = createUseStyles({
    buttonWrapper: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10
    },
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
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: '100%',
        minWidth: '100%'
    },
    enemyAdventurers: {
        alignItems: 'center',
        backgroundColor: 'rosybrown',
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        maxHeight: '20%',
        minWidth: '80%'
    },
    friendlyAdventurers: {
        backgroundColor: 'palegreen',
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        minWidth: '80%',
        maxHeight: '40%'
    },
    friendlyAdventurersWrapper: {
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '5%',
        minWidth: '100%'
    }
});

const selectionTypes = {
    adventurer: 'adventurer',
    card: 'card'
};

const emptySelection = {
    type: null,
    key: null
};

const getGameSizes = (width) => {
    let cardSize;
    let adventurerSize;

    if (width <= 1280) {
        cardSize = cardSizes.sm;
        adventurerSize = adventurerSizes.sm;
    } else if (width <= 1920) {
        cardSize = cardSizes.md;
        adventurerSize = adventurerSizes.md;
    } else {
        cardSize = cardSizes.lg;
        adventurerSize = adventurerSizes.lg;
    }

    return { cardSize, adventurerSize };
};

const Game = () => {
    const classes = useGameStyles();

    // gets current window dimensions - used to scale cards/adventurers appropriately
    const { width } = useWindowDimensions();
    // player's deck
    const [cards, setCards] = useState(getTestCards());
    // player's selection - key is index in deck when selecting card, adventurer name when selecting a adventurer
    const [selected, setSelected] = useState(emptySelection);
    // attack order
    const [moveOrder, setMoveOrder] = useState([]);
    // adventurer state
    const [adventurerState, adventurerDispatch] = useReducer(adventurersReducer, adventurersInitialState);

    // refs @TODO try and clean up refs
    const adventurer1Ref = useRef(null);
    const adventurer2Ref = useRef(null);
    const adventurer3Ref = useRef(null);
    const adventurer4Ref = useRef(null);
    const adventurer5Ref = useRef(null);
    const enemyAdventurer1Ref = useRef(null);
    const enemyAdventurer2Ref = useRef(null);
    const enemyAdventurer3Ref = useRef(null);
    const enemyAdventurer4Ref = useRef(null);
    const enemyAdventurer5Ref = useRef(null);

    const refMap = {
        adventurer1: adventurer1Ref,
        adventurer2: adventurer2Ref,
        adventurer3: adventurer3Ref,
        adventurer4: adventurer4Ref,
        adventurer5: adventurer5Ref,
        enemyAdventurer1: enemyAdventurer1Ref,
        enemyAdventurer2: enemyAdventurer2Ref,
        enemyAdventurer3: enemyAdventurer3Ref,
        enemyAdventurer4: enemyAdventurer4Ref,
        enemyAdventurer5: enemyAdventurer5Ref
    };

    const { cardSize, adventurerSize } = getGameSizes(width);

    /**
     * Extracts targets from `adventurers` and `moveOrder` and prepares them to be rendered as `TargetIndicator`s
     * @returns {*[]}
     */
    const getTargets = () => {
        let targets = [];

        Object.entries(adventurerState).forEach(([key, value]) => {
            if (!key.startsWith('enemy') && value.target !== null) {
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
     * @param {string} adventurerKey - Adventurer key to equip card
     */
    const equipCard = (adventurerKey) => {
        if (selected.type === selectionTypes.card && selected.key > -1) {
            // remove card from deck
            const card = cards[selected.key];
            const cardsCopy = [...cards];
            cardsCopy.splice(selected.key, 1);

            // if card is equipped in slot put it back in deck
            const cardToUnequip = adventurerState[adventurerKey].cards[card.equipmentType];
            if (cardToUnequip) {
                cardsCopy.push(cardToUnequip);
            }

            adventurerDispatch({
                type: adventurerActionTypes.equip,
                slot: card.equipmentType,
                adventurerKey,
                card
            });

            setCards(cardsCopy);
            setSelected(emptySelection);
        }
    };

    /**
     * Attempt ot unequip a card from an adventurer
     * @param {string} adventurerKey - Adventurer key to unequip card
     * @param {object} cardToUnequip - Card object to be unequipped and placed back in deck
     */
    const unequipCard = (adventurerKey, cardToUnequip) => {
        const card = adventurerState[adventurerKey].cards[cardToUnequip?.equipmentType];

        if (card) {
            const cardsCopy = [...cards];
            cardsCopy.push(card);

            adventurerDispatch({
                type: adventurerActionTypes.equip,
                slot: card.equipmentType,
                adventurerKey,
                card: null
            });

            setCards(cardsCopy);
        }
    };

    /**
     * Attempt to target an adventurer from the one that is actively selected.
     * @param {string} adventurerKeyToTarget - Adventurer key to be targeted
     */
    const setTarget = (adventurerKeyToTarget) => {
        const { type, key } = selected;

        // only allow targeting of enemy adventurers until support/heal is added
        if (type === selectionTypes.adventurer && key && adventurerKeyToTarget.startsWith('enemy')) {
            let newMoveOrder = [...moveOrder];

            const existingMove = newMoveOrder.indexOf(key);
            if (existingMove > -1) {
                newMoveOrder.splice(existingMove, 1);
            }

            adventurerDispatch({
                type: adventurerActionTypes.target,
                adventurerKey: key,
                target: adventurerKeyToTarget
            });

            setMoveOrder([...newMoveOrder, key]);
            setSelected(emptySelection);
        }
    };

    /**
     * Callback function for when an adventurer is clicked to handle equipping cards, targeting, and selecting
     * @param adventurerKey
     */
    const onAdventurerClick = (adventurerKey) => {
        // if card is selected during onAdventurerClick, equip it
        if (selected.type === selectionTypes.card && selected.key > -1) {
            equipCard(adventurerKey);
        }
        // if adventurer is selected during onAdventurerClick, try to target it
        if (selected.type === selectionTypes.adventurer && selected.key) {
            setTarget(adventurerKey);
        }
        // if adventurer being clicked is already selected, clear the selection
        if (selected.type === selectionTypes.adventurer && selected.key === adventurerKey) {
            setSelected(emptySelection);
        }
        // if there is no active selection during onAdventurerClick, then select the adventurer
        if (selected.type === null && !adventurerKey.startsWith('enemy')) {
            setSelected({
                type: selectionTypes.adventurer,
                key: adventurerKey
            });
        }
    };

    /**
     * Dispatches actions to update reducer so that attacking and defending adventurers trigger animation and sets new hp
     * for defending adventurer. After a 2.5s delay the actions are dispatched to stop animation.
     * @param {string} attackingAdventurerKey - Reducer key for adventurer attacking, ie. enemyAdventurer1
     * @param {string} defendingAdventurerKey - Reducer key for adventurer defending, ie. adventurer5
     * @param {number} newHp - New hp value for defending adventurer
     */
    const takeTurn = (attackingAdventurerKey, defendingAdventurerKey, newHp) => {
        adventurerDispatch({
            type: adventurerActionTypes.atk,
            adventurerKey: attackingAdventurerKey,
            isAtk: true
        });

        adventurerDispatch({
            type: adventurerActionTypes.def,
            adventurerKey: defendingAdventurerKey,
            isDef: true
        });

        adventurerDispatch({
            type: adventurerActionTypes.hp,
            adventurerKey: defendingAdventurerKey,
            hp: newHp
        });

        setTimeout(() => {
            adventurerDispatch({
                type: adventurerActionTypes.atk,
                adventurerKey: attackingAdventurerKey,
                isAtk: false
            });

            adventurerDispatch({
                type: adventurerActionTypes.def,
                adventurerKey: defendingAdventurerKey,
                isDef: false
            });
        }, 2500);
    };

    const endTurn = () => {
        const turn = {
            adventurers: {
                adventurer1: {
                    target: adventurerState.adventurer1.target,
                    cards: adventurerState.adventurer1.cards
                },
                adventurer2: {
                    target: adventurerState.adventurer2.target,
                    cards: adventurerState.adventurer2.cards
                },
                adventurer3: {
                    target: adventurerState.adventurer3.target,
                    cards: adventurerState.adventurer3.cards
                },
                adventurer4: {
                    target: adventurerState.adventurer4.target,
                    cards: adventurerState.adventurer4.cards
                },
                adventurer5: {
                    target: adventurerState.adventurer5.target,
                    cards: adventurerState.adventurer5.cards
                }
            },
            moveOrder
        };

        console.log('turn', turn);

        // endTurnCallback(turn);
        setMoveOrder([]);
    };

    //     const turn = {
    //         moveOrder:
    //     };
    //     endTurnCallback()
    //     // @TODO CARSON callback to send move to metamask GOES HERE!
    // }
    //
    // useEffect(() => {
    //     takeTurn('adventurer1', 'enemyAdventurer1', 95);
    // }, []);

    return (
        <div className={classes.container}>
            <div className={classes.enemyAdventurers}>
                <Adventurer
                    adventurerRef={enemyAdventurer1Ref}
                    isAtk={adventurerState.enemyAdventurer1.isAtk}
                    isDef={adventurerState.enemyAdventurer1.isDef}
                    hp={adventurerState.enemyAdventurer1.hp}
                    onClickCallback={() => onAdventurerClick('enemyAdventurer1')}
                    size={adventurerSize}
                />
                <Adventurer
                    adventurerRef={enemyAdventurer2Ref}
                    isAtk={adventurerState.enemyAdventurer2.isAtk}
                    isDef={adventurerState.enemyAdventurer2.isDef}
                    hp={adventurerState.enemyAdventurer2.hp}
                    onClickCallback={() => onAdventurerClick('enemyAdventurer2')}
                    size={adventurerSize}
                />
                <Adventurer
                    adventurerRef={enemyAdventurer3Ref}
                    isAtk={adventurerState.enemyAdventurer3.isAtk}
                    isDef={adventurerState.enemyAdventurer3.isDef}
                    hp={adventurerState.enemyAdventurer3.hp}
                    onClickCallback={() => onAdventurerClick('enemyAdventurer3')}
                    size={adventurerSize}
                />
                <Adventurer
                    adventurerRef={enemyAdventurer4Ref}
                    isAtk={adventurerState.enemyAdventurer4.isAtk}
                    isDef={adventurerState.enemyAdventurer4.isDef}
                    hp={adventurerState.enemyAdventurer4.hp}
                    onClickCallback={() => onAdventurerClick('enemyAdventurer4')}
                    size={adventurerSize}
                />
                <Adventurer
                    adventurerRef={enemyAdventurer5Ref}
                    isAtk={adventurerState.enemyAdventurer5.isAtk}
                    isDef={adventurerState.enemyAdventurer5.isDef}
                    hp={adventurerState.enemyAdventurer5.hp}
                    onClickCallback={() => onAdventurerClick('enemyAdventurer5')}
                    size={adventurerSize}
                />
            </div>
            <div className={classes.friendlyAdventurers}>
                <div className={classes.friendlyAdventurersWrapper}>
                    <Adventurer
                        adventurerRef={adventurer1Ref}
                        disableHover={selected.type !== null}
                        isSelected={selected.key === 'adventurer1'}
                        isAtk={adventurerState.adventurer1.isAtk}
                        isDef={adventurerState.adventurer1.isDef}
                        hp={adventurerState.adventurer1.hp}
                        cards={Object.values(adventurerState.adventurer1.cards).filter((card) => card !== null)}
                        onClickCallback={() => onAdventurerClick('adventurer1')}
                        onUnequipCallback={(card) => unequipCard('adventurer1', card)}
                        size={adventurerSize}
                    />
                    <Adventurer
                        adventurerRef={adventurer2Ref}
                        disableHover={selected.type !== null}
                        isSelected={selected.key === 'adventurer2'}
                        isAtk={adventurerState.adventurer2.isAtk}
                        isDef={adventurerState.adventurer2.isDef}
                        hp={adventurerState.adventurer2.hp}
                        cards={Object.values(adventurerState.adventurer2.cards).filter((card) => card !== null)}
                        onClickCallback={() => onAdventurerClick('adventurer2')}
                        onUnequipCallback={(card) => unequipCard('adventurer2', card)}
                        size={adventurerSize}
                    />
                    <Adventurer
                        adventurerRef={adventurer3Ref}
                        disableHover={selected.type !== null}
                        isAtk={adventurerState.adventurer3.isAtk}
                        isDef={adventurerState.adventurer3.isDef}
                        isSelected={selected.key === 'adventurer3'}
                        hp={adventurerState.adventurer3.hp}
                        cards={Object.values(adventurerState.adventurer3.cards).filter((card) => card !== null)}
                        onClickCallback={() => onAdventurerClick('adventurer3')}
                        onUnequipCallback={(card) => unequipCard('adventurer3', card)}
                        size={adventurerSize}
                    />
                    <Adventurer
                        adventurerRef={adventurer4Ref}
                        disableHover={selected.type !== null}
                        isSelected={selected.key === 'adventurer4'}
                        isAtk={adventurerState.adventurer4.isAtk}
                        isDef={adventurerState.adventurer4.isDef}
                        hp={adventurerState.adventurer4.hp}
                        cards={Object.values(adventurerState.adventurer4.cards).filter((card) => card !== null)}
                        onClickCallback={() => onAdventurerClick('adventurer4')}
                        onUnequipCallback={(card) => unequipCard('adventurer4', card)}
                        size={adventurerSize}
                    />
                    <Adventurer
                        adventurerRef={adventurer5Ref}
                        disableHover={selected.type !== null}
                        isSelected={selected.key === 'adventurer5'}
                        isAtk={adventurerState.adventurer5.isAtk}
                        isDef={adventurerState.adventurer5.isDef}
                        hp={adventurerState.adventurer5.hp}
                        cards={Object.values(adventurerState.adventurer5.cards).filter((card) => card !== null)}
                        onClickCallback={() => onAdventurerClick('adventurer5')}
                        onUnequipCallback={(card) => unequipCard('adventurer5', card)}
                        size={adventurerSize}
                    />
                </div>
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
                <div className={classes.buttonWrapper}>
                    <Button text="End Turn" textColor="white" color="indianred" onClick={endTurn} />
                </div>
            </div>
            {getTargets().map(({ isEnemy, startRef, endRef, order }) => (
                <TargetIndicator isEnemy={isEnemy} startRef={startRef} endRef={endRef} order={order} />
            ))}
        </div>
    );
};

export default Game;
