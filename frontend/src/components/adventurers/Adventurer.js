import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { createUseStyles } from 'react-jss';
import { Shake } from 'reshake';
import Card, { cardPropTypes, cardSizes } from '../cards/Card';

export const adventurerSizes = {
    sm: 'sm',
    md: 'md',
    lg: 'lg'
};

export const adventurerWidths = {
    [adventurerSizes.sm]: 80,
    [adventurerSizes.md]: 100,
    [adventurerSizes.lg]: 140
};

export const equippedCardSize = {
    [adventurerSizes.sm]: cardSizes.sm,
    [adventurerSizes.md]: cardSizes.sm,
    [adventurerSizes.lg]: cardSizes.md
};

const useAdventurerStyles = createUseStyles({
    cardsContainer: {
        position: 'absolute',
        right: -15,
        top: -25
    },
    cardHover: {
        '&:hover': {
            zIndex: '9999 !important'
        }
    },
    cardWrapper: {
        position: 'absolute'
    },
    container: {
        position: 'relative'
    },
    hpBar: {
        backgroundColor: 'black',
        display: 'flex',
        flexDirection: 'column-reverse',
        height: '100%',
        width: '20%'
    },
    hpValue: {
        backgroundColor: 'green',
        width: '100%'
    },
    adventurerStats: {
        backgroundColor: 'grey',
        minWidth: '80%'
    },
    adventurerWrapper: {
        backgroundColor: 'orange',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        position: 'absolute'
    }
});

/**
 * @param {ref} adventurerRef - useRef for this Adventurer
 * @param {boolean} isSelected - If this adventurer is selected render a glowing border
 * @param {boolean} isAtk - If this adventurer is attacking this turn, then do a small animation
 * @param {boolean} isDef - If this adventurer is being hit this turn, then do a small animation
 * @param {boolean} disableHover - If the card zIndex hover should be disabled
 * @param {number} hp - Adventurer's hp%
 * @param {object[]} cards - Equipped cards
 * @param stats // @TODO
 * @param {string} size - The adventurer size
 * @param {function} onClickCallback - Callback function for when the Adventurer is clicked
 * @param {function} onClickCallback - Callback function for when an equipped card is clicked
 * @returns {JSX.Element}
 * @constructor
 */
const Adventurer = ({
    adventurerRef,
    isSelected,
    isAtk,
    isDef,
    disableHover,
    hp,
    cards,
    stats,
    size,
    onClickCallback,
    onUnequipCallback
}) => {
    const classes = useAdventurerStyles();

    const width = adventurerWidths[size];
    const height = adventurerWidths[size];

    // @TODO make a better fan out effect when adventurer is focusde
    const topOffset = isSelected ? 25 : 25;
    const rightOffset = isSelected ? 15 : 15;

    return (
        <div ref={adventurerRef} className={classes.container} style={{ width, height }}>
            <Shake
                active={isDef || isAtk}
                h={isAtk ? 0 : 30}
                v={isAtk ? 100 : 0}
                r={isAtk ? 0 : 0}
                dur={1000}
                int={isAtk ? 10 : 50}
                max={100}
                freez={false}
                fixedStop={false}
                fixed
            >
                {cards.length > 0 && (
                    <div className={classes.cardsContainer} style={{ width, height }}>
                        {cards.map((card, i) => (
                            <div
                                key={card.name}
                                className={`${classes.cardWrapper} ${
                                    disableHover ? '' : classes.cardHover
                                }`}
                                style={{
                                    top: topOffset * (i + 1),
                                    right: rightOffset * (i + 1),
                                    zIndex: cards.length - i
                                }}
                            >
                                <Card
                                    key={card.name}
                                    name={card.name}
                                    image={card.image}
                                    modifier={card.modifier}
                                    equipmentType={card.equipmentType}
                                    equipmentClass={card.equipmentClass}
                                    totalStats={card.totalStats}
                                    tokenValue={card.GOGTokenValue}
                                    rarityTier={card.rarityTier}
                                    size={equippedCardSize[size]}
                                    onSelectedCallback={() => onUnequipCallback(card)}
                                />
                            </div>
                        ))}
                    </div>
                )}
                <div
                    onClick={onClickCallback}
                    className={classes.adventurerWrapper}
                    style={{
                        boxShadow: isSelected ? '0 0 20px red' : 'initial',
                        zIndex: cards.length + 1,
                        width,
                        height
                    }}
                >
                    <div className={classes.adventurerStats}>
                        {stats.map((stat) => (
                            <>
                                {stat}
                                <br />
                            </>
                        ))}
                    </div>
                    <div className={classes.hpBar}>
                        <div className={classes.hpValue} style={{ height: `${hp}%` }} />
                    </div>
                </div>
            </Shake>
        </div>
    );
};

Adventurer.propTypes = {
    adventurerRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    isSelected: PropTypes.bool,
    isAtk: PropTypes.bool,
    isDef: PropTypes.bool,
    disableHover: PropTypes.bool,
    hp: PropTypes.number.isRequired,
    cards: PropTypes.arrayOf(PropTypes.shape(cardPropTypes)),
    stats: PropTypes.array,
    size: PropTypes.oneOf(Object.values(adventurerSizes)),
    onClickCallback: PropTypes.func,
    onUnequipCallback: PropTypes.func
};

Adventurer.defaultProps = {
    isSelected: false,
    isAtk: false,
    isDef: false,
    disableHover: false,
    cards: [],
    stats: [],
    size: adventurerSizes.md,
    onClickCallback: () => undefined,
    onUnequipCallback: () => undefined
};

export default Adventurer;
