import React from 'react';
import PropTypes from 'prop-types';
import { createUseStyles } from 'react-jss';
import Card, {
    cardWidths,
    cardSizes,
    cardHeightMultiplier,
    cardPropTypes
} from './Card';

const useDeckStyles = createUseStyles({
    container: {
        width: '80vw', // @TODO make 100% work with scroll
        overflowX: 'scroll',
        overflowY: 'none',
        whiteSpace: 'nowrap',
        display: 'flex',
        flexDirection: 'row'
    }
});

/**
 * @param {number} selected - Index of the selected card in the deck
 * @param {object[]} cards - Array of card objects
 * @param {string} cardSize - Size of cards in deck
 * @param {function} onSelectedCallback - Callback function for selecting a card
 * @returns {JSX.Element}
 * @constructor
 */
const Deck = ({ selected, cards, cardSize, onSelectedCallback }) => {
    const classes = useDeckStyles();

    const onScroll = () => {
        // @TODO magnification effect using containerCoords
    };

    return (
        <div
            className={classes.container}
            onScroll={onScroll}
            style={{
                height:
                    cardWidths[cardSize] * cardHeightMultiplier[cardSize] + 50
            }}
        >
            {cards.map((card, i) => (
                <Card
                    key={card.name}
                    isSelected={selected === i}
                    name={card.name}
                    image={card.image}
                    modifier={card.modifier}
                    equipmentType={card.equipmentType}
                    equipmentClass={card.equipmentClass}
                    totalStats={card.totalStats}
                    tokenValue={card.GOGTokenValue}
                    rarityTier={card.rarityTier}
                    size={cardSize}
                    onSelectedCallback={() => onSelectedCallback(i)}
                />
            ))}
        </div>
    );
};

Deck.propTypes = {
    selected: PropTypes.number.isRequired,
    cards: PropTypes.arrayOf(PropTypes.shape(cardPropTypes)),
    cardSize: PropTypes.oneOf(Object.values(cardSizes)),
    onSelectedCallback: PropTypes.func.isRequired
};

export default Deck;
