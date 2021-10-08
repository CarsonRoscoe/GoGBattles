import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Textfit } from 'react-textfit';
import { createUseStyles } from 'react-jss';

export const cardSizes = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl'
};

export const cardWidths = {
    [cardSizes.sm]: 100,
    [cardSizes.md]: 150,
    [cardSizes.lg]: 200,
    [cardSizes.xl]: 400
};

// this is here because small cards were originally supposed to be square(1:1) with condensed detail, still might
// explore this idea later
export const cardHeightMultiplier = {
    [cardSizes.sm]: 1.4,
    [cardSizes.md]: 1.4,
    [cardSizes.lg]: 1.4,
    [cardSizes.lg]: 1.4
};

const useNameStyles = createUseStyles({
    container: {
        alignItems: 'center',
        display: 'flex',
        fontSize: 17,
        fontWeight: 600,
        justifyContent: 'flex-start',
        marginLeft: 2.5,
        marginRight: 2.5
    }
});

/**
 * @param {string} name - Card name
 * @param {number} height - Height of name line
 * @returns {JSX.Element}
 * @constructor
 */
const Name = ({ name, height }) => {
    const classes = useNameStyles();

    return (
        <Textfit
            mode="single"
            max={17}
            className={classes.container}
            style={{ height }}
        >
            {name}
        </Textfit>
    );
};

Name.propTypes = {
    name: PropTypes.string.isRequired
};

const useImageStyles = createUseStyles({
    container: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center'
    },
    wrapper: {
        alignItems: 'center',
        backgroundColor: 'lightgray',
        borderRadius: 6,
        boxShadow: '0 0 20px white',
        display: 'flex',
        height: '95%',
        justifyContent: 'center',
        width: '50%'
    }
});

/**
 * @param {string} image - Image URL
 * @param {number} height - Height of the image container
 * @returns {JSX.Element}
 * @constructor
 */
const Image = ({ image, height }) => {
    const classes = useImageStyles();

    return (
        <div className={classes.container} style={{ height }}>
            <div className={classes.wrapper}>
                {/* @TODO image */}
                {/*{image}*/}
            </div>
        </div>
    );
};

Image.propTypes = {
    image: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired
};

const useModifierStyles = createUseStyles({
    container: {
        alignItems: 'center',
        display: 'flex',
        fontSize: 14,
        justifyContent: 'center',
        width: '100%'
    }
});

/**
 * @param {string} modifier - Modifier string below Image
 * @param {number} height - Height of the modifier line
 * @returns {JSX.Element}
 * @constructor
 */
const Modifier = ({ modifier, height }) => {
    const classes = useModifierStyles();

    return (
        <Textfit
            mode="single"
            max={14}
            className={classes.container}
            style={{ height }}
        >
            {modifier}
        </Textfit>
    );
};

Modifier.propTypes = {
    modifier: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired
};

const useStatsStyles = createUseStyles({
    container: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%'
    },
    td: {
        textAlign: 'center'
    }
});

/**
 * @param {number[]} offense - Array of offense stats [melee, mage, range]
 * @param {number[]} defensive - Array of defensive stats [melee, mage, range]
 * @param {number} height - Height of the stats section
 * @returns {JSX.Element}
 * @constructor
 */
const Stats = ({ offense, defensive, height }) => {
    const classes = useStatsStyles();

    const cellWidth = `${90 / 6}%`;
    const cellPadding = `${10 / 6}%`;

    const Stat = ({ stat, value }) => (
        <>
            <td
                className={classes.td}
                style={{ width: cellWidth, paddingLeft: cellPadding }}
            >
                <img
                    src={`card-icons/${stat}.png`}
                    alt={stat}
                    height={height * 0.3}
                    width="auto"
                />
            </td>
            <td
                className={classes.td}
                style={{ width: cellWidth, paddingRight: cellPadding }}
            >
                <Textfit mode="single" max={20}>
                    {value}
                </Textfit>
            </td>
        </>
    );

    return (
        <div className={classes.container} style={{ height }}>
            <table>
                <tbody>
                    <tr>
                        <Stat stat="atkmelee" value={offense[0]} />
                        <Stat stat="atkmage" value={offense[1]} />
                        <Stat stat="atkrange" value={offense[2]} />
                    </tr>
                    <tr>
                        <Stat stat="defmelee" value={defensive[0]} />
                        <Stat stat="defmage" value={defensive[1]} />
                        <Stat stat="defrange" value={defensive[2]} />
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

Stats.propTypes = {
    offense: PropTypes.arrayOf(PropTypes.number).isRequired,
    defensive: PropTypes.arrayOf(PropTypes.number).isRequired,
    height: PropTypes.number.isRequired
};

const useBottomStyles = createUseStyles({
    container: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        fontSize: 14,
        fontStyle: 'italic',
        justifyContent: 'space-between',
        width: '100%'
    },
    equipment: {
        marginLeft: 2.5,
        width: '75%'
    },
    token: {
        marginRight: 3.5,
        textAlign: 'right',
        width: '25%'
    }
});

/**
 * @param {string} equipmentClass - Card's equipment class
 * @param {string} equipmentType - Card's equipment type
 * @param {number} tokenValue - Card value
 * @param {number} height - Height of the bottom line
 * @returns {JSX.Element}
 * @constructor
 */
const Bottom = ({ equipmentClass, equipmentType, tokenValue, height }) => {
    const classes = useBottomStyles();

    return (
        <div className={classes.container}>
            <Textfit mode="single" max={17} className={classes.equipment}>
                {equipmentClass} ({equipmentType})
            </Textfit>
            <Textfit mode="single" max={14} className={classes.token}>
                {tokenValue}
            </Textfit>
        </div>
    );
};

Bottom.propTypes = {
    equipmentClass: PropTypes.string.isRequired,
    equipmentType: PropTypes.string.isRequired,
    tokenValue: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
};

const useCardStyles = createUseStyles({
    container: {
        border: '2px solid black',
        // borderRadius: 10, @TODO custom border styles
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        overflow: 'hidden',
        margin: 10
    },
    wrapper: {
        padding: 2.5
    }
});

/**
 * @param {boolean} isSelected - If the Card is selected, add a glowing border
 * @param {string} name - Name of the card
 * @param {string} image - URL of the card's Image
 * @param {string} modifier - Modifier to display below the Image
 * @param {string} equipmentType - Card's equipment type
 * @param {string} equipmentClass - Card's equipment class
 * @param {object} stats - Object containing offense (number[]) and defensive (number[]) stats
 * @param {number} tokenValue - Card's value
 * @param {string} rarityTier - Card's rarity type
 * @param {string} size - Size to render the card (sm, md, lg)
 * @param {function} onSelectedCallback - Callback function for when a card is selected/clicked
 * @returns {JSX.Element}
 * @constructor
 */
const Card = ({
    isSelected,
    name,
    image,
    modifier,
    equipmentType,
    equipmentClass,
    totalStats,
    tokenValue,
    rarityTier,
    size,
    onSelectedCallback
}) => {
    const classes = useCardStyles();
    const ref = useRef();

    const CARD_WIDTH = cardWidths[size];
    const CARD_HEIGHT = CARD_WIDTH * cardHeightMultiplier[size];

    const TITLE_HEIGHT = CARD_HEIGHT * 0.1;
    const IMAGE_HEIGHT = CARD_HEIGHT * 0.3;
    const MODIFIER_HEIGHT = CARD_HEIGHT * 0.1;
    const STATS_HEIGHT = CARD_HEIGHT * 0.4;
    const BOTTOM_HEIGHT = CARD_HEIGHT * 0.1;

    const getRarityColor = () => {
        switch (rarityTier) {
            case 'COMMON':
                return 'radial-gradient(circle, rgba(129,190,255,1) 0%, rgba(0,123,255,1) 100%)'; // #007bff
            case 'UNCOMMON':
                return 'radial-gradient(circle, rgba(144,226,145,1) 0%, rgba(0,227,3,1) 100%)'; // 00e303
            case 'RARE':
                return 'radial-gradient(circle, rgba(255,248,156,1) 0%, rgba(255,238,0,1) 100%)'; // ffee00
            case 'MYTHICAL':
                return 'radial-gradient(circle, rgba(157,101,171,1) 0%, rgba(140,12,173,1) 100%)'; // 8c0cad
            case 'ROYAL':
                return 'radial-gradient(circle, rgba(255,131,131,1) 0%, rgba(252,0,0,1) 100%)'; // fc0000
            case 'GODLY':
                return 'radial-gradient(circle, rgba(255,169,245,1) 0%, rgba(255,99,237,1) 100%)'; // ff63ed
            case 'ULTIMATE':
                return 'radial-gradient(circle, rgba(255,213,130,1) 0%, rgba(255,169,0,1) 25%)'; // orange
            default:
                return 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)'; // white
        }
    };

    return (
        <div
            ref={ref}
            onClick={onSelectedCallback}
            className={classes.container}
            style={{
                height: CARD_HEIGHT + 5,
                minHeight: CARD_HEIGHT + 5,
                maxHeight: CARD_HEIGHT + 5,
                width: CARD_WIDTH + 5,
                minWidth: CARD_WIDTH + 5,
                maxWidth: CARD_WIDTH + 5,
                background: getRarityColor(),
                boxShadow: isSelected ? '0 0 20px red' : 'initial'
            }}
        >
            <div className={classes.wrapper}>
                <Name name={name} height={TITLE_HEIGHT} />
                <Image image={image} height={IMAGE_HEIGHT} />
                <Modifier modifier={modifier} height={MODIFIER_HEIGHT} />
                <Stats
                    offense={totalStats.offense}
                    defensive={totalStats.defense}
                    height={STATS_HEIGHT}
                />
                <Bottom
                    equipmentClass={equipmentClass}
                    equipmentType={equipmentType}
                    tokenValue={tokenValue}
                    height={BOTTOM_HEIGHT}
                />
            </div>
        </div>
    );
};

export const cardPropTypes = {
    isSelected: PropTypes.bool,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    modifier: PropTypes.string.isRequired,
    equipmentType: PropTypes.string.isRequired,
    equipmentClass: PropTypes.string.isRequired,
    totalStats: PropTypes.shape({
        offense: PropTypes.arrayOf(PropTypes.number),
        defense: PropTypes.arrayOf(PropTypes.number)
    }),
    tokenValue: PropTypes.number.isRequired,
    rarityTier: PropTypes.string.isRequired,
    size: PropTypes.oneOf([...Object.values(cardSizes)]),
    onSelectedCallback: PropTypes.func
};

Card.propTypes = cardPropTypes;

Card.defaultProps = {
    isSelected: false,
    onSelectedCallback: () => undefined
};

export default Card;
