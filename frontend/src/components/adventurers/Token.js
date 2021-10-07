import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { createUseStyles } from 'react-jss';
import { Shake } from 'reshake';
import Card, { cardPropTypes, cardSizes } from '../cards/Card';

const useTokenStyles = createUseStyles({
    cardsContainer: {
        height: 175,
        position: 'absolute',
        right: -15,
        top: -25,
        width: 175
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
        height: 175,
        position: 'relative',
        width: 175
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
    tokenStats: {
        backgroundColor: 'grey',
        minWidth: '80%'
    },
    tokenWrapper: {
        backgroundColor: 'orange',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'row',
        height: 175,
        overflow: 'hidden',
        position: 'absolute',
        width: 175
    }
});

/**
 * @param {ref} tokenRef - useRef for this Token
 * @param {boolean} isSelected - If this token is selected render a glowing border
 * @param {boolean} disableHover - If the card zIndex hover should be disabled
 * @param {number} hp - Token's hp%
 * @param {object[]} cards - Equipped cards
 * @param stats // @TODO
 * @param {function} onClickCallback - Callback function for when the Token is clicked
 * @returns {JSX.Element}
 * @constructor
 */
const Token = ({ tokenRef, isSelected, disableHover, hp, cards, stats, onClickCallback }) => {
    const classes = useTokenStyles();
    const [isTakingDamageEffectActive, setIsTakingDamageEffectActive] = useState(false);
    const [isAttackingEffectActive, setIsAttackingEffectActive] = useState(false);

    useEffect(() => {
        // @TODO trigger isTakingDamageEffectActive or isAttackingEffectActive for 2 seconds when component receives
        // isHit or isAtk prop
    }, [/* @TODO isHit, isAtk props */]);

    return (
        <div
            ref={tokenRef}
            className={classes.container}
            onClick={onClickCallback}
        >
            <Shake
                active={isTakingDamageEffectActive || isAttackingEffectActive}
                h={isAttackingEffectActive ? 0 : 30}
                v={isAttackingEffectActive ? 100 : 0}
                r={isAttackingEffectActive ? 0 : 0}
                dur={1000}
                int={10}
                max={100}
                freez={false}
                fixedStop={false}
                fixed
            >
                {cards.length > 0 && (
                    <div className={classes.cardsContainer}>
                        {cards.map((card, i) => (
                            <div
                                key={card.name}
                                className={`${classes.cardWrapper} ${disableHover ? '' : classes.cardHover}`}
                                style={{
                                    top: 25 * (i + 1),
                                    right: 15 * (i + 1),
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
                                    stats={card.stats}
                                    tokenValue={card.tokenValue}
                                    rarityType={card.rarityType}
                                    size={cardSizes.md}
                                />
                            </div>
                        ))}
                    </div>
                )}
                <div
                    className={classes.tokenWrapper}
                    style={{
                        boxShadow: isSelected ? '0 0 20px red' : 'initial',
                        zIndex: cards.length + 1
                    }}
                >
                    <div className={classes.tokenStats}>
                        {stats.map((stat) => (
                            <>
                                {stat}
                                <br />
                            </>
                        ))}
                    </div>
                    <div className={classes.hpBar}>
                        <div
                            className={classes.hpValue}
                            style={{ height: `${hp}%` }}
                        />
                    </div>
                </div>
            </Shake>
        </div>
    );
};

Token.propTypes = {
    tokenRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    isSelected: PropTypes.bool,
    disableHover: PropTypes.bool,
    hp: PropTypes.number.isRequired,
    cards: PropTypes.arrayOf(PropTypes.shape(cardPropTypes)),
    stats: PropTypes.array,
    onClickCallback: PropTypes.func
};

Token.defaultProps = {
    isSelected: false,
    disableHover: false,
    cards: [],
    stats: [],
    onClickCallback: () => undefined
};

export default Token;
