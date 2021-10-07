import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { createUseStyles } from 'react-jss';
import { Shake } from 'reshake';
import Card, { cardPropTypes, cardSizes } from '../cards/Card';

export const tokenSizes = {
    sm: 'sm',
    md: 'md',
    lg: 'lg'
};

export const tokenWidths = {
    [tokenSizes.sm]: 80,
    [tokenSizes.md]: 100,
    [tokenSizes.lg]: 140
};

export const equippedCardSize = {
    [tokenSizes.sm]: cardSizes.sm,
    [tokenSizes.md]: cardSizes.sm,
    [tokenSizes.lg]: cardSizes.md,
}

const useTokenStyles = createUseStyles({
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
    tokenStats: {
        backgroundColor: 'grey',
        minWidth: '80%'
    },
    tokenWrapper: {
        backgroundColor: 'orange',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        position: 'absolute'
    }
});

/**
 * @param {ref} tokenRef - useRef for this Token
 * @param {boolean} isSelected - If this token is selected render a glowing border
 * @param {boolean} isAtk - If this token is attacking this turn, then do a small animation
 * @param {boolean} isHit - If this token is being hit this turn, then do a small animation
 * @param {boolean} disableHover - If the card zIndex hover should be disabled
 * @param {number} hp - Token's hp%
 * @param {object[]} cards - Equipped cards
 * @param stats // @TODO
 * @param {string} size - The token size
 * @param {function} onClickCallback - Callback function for when the Token is clicked
 * @returns {JSX.Element}
 * @constructor
 */
const Token = ({
    tokenRef,
    isSelected,
    isAtk,
    isHit,
    disableHover,
    hp,
    cards,
    stats,
    size,
    onClickCallback
}) => {
    const classes = useTokenStyles();
    const [isTakingDamageEffectActive, setIsTakingDamageEffectActive] = useState(isHit);
    const [isAttackingEffectActive, setIsAttackingEffectActive] = useState(isAtk);

    useEffect(() => {
        if (isTakingDamageEffectActive) {
            setTimeout(() => {
                setIsTakingDamageEffectActive(false);
            }, 1000);
        }

        if (isAttackingEffectActive) {
            setTimeout(() => {
                setIsAttackingEffectActive(false);
            }, 1000);
        }
    }, [isAttackingEffectActive, isTakingDamageEffectActive]);

    const width = tokenWidths[size];
    const height = tokenWidths[size];

    return (
        <div
            ref={tokenRef}
            className={classes.container}
            onClick={onClickCallback}
            style={{ width, height }}
        >
            <Shake
                active={isTakingDamageEffectActive || isAttackingEffectActive}
                h={isAttackingEffectActive ? 0 : 30}
                v={isAttackingEffectActive ? 100 : 0}
                r={isAttackingEffectActive ? 0 : 0}
                dur={1000}
                int={isTakingDamageEffectActive ? 10 : 50}
                max={100}
                freez={false}
                fixedStop={false}
                fixed
            >
                {cards.length > 0 && (
                    <div
                        className={classes.cardsContainer}
                        style={{ width, height }}
                    >
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
                                    size={equippedCardSize[size]}
                                />
                            </div>
                        ))}
                    </div>
                )}
                <div
                    className={classes.tokenWrapper}
                    style={{
                        boxShadow: isSelected ? '0 0 20px red' : 'initial',
                        zIndex: cards.length + 1,
                        width,
                        height
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
    isAtk: PropTypes.bool,
    isHit: PropTypes.bool,
    disableHover: PropTypes.bool,
    hp: PropTypes.number.isRequired,
    cards: PropTypes.arrayOf(PropTypes.shape(cardPropTypes)),
    stats: PropTypes.array,
    size: PropTypes.oneOf(Object.values(tokenSizes)),
    onClickCallback: PropTypes.func
};

Token.defaultProps = {
    isSelected: false,
    isAtk: false,
    isHit: false,
    disableHover: false,
    cards: [],
    stats: [],
    size: tokenSizes.md,
    onClickCallback: () => undefined
};

export default Token;
