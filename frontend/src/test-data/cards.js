/* Example card data
--------------------
    name="Greater Amulet of Power"
    image="* image of amulet *"
    modifier="Power x3"
    equipmentType="Neck"
    equipmentClass="Magic"
    totalStats={{
        offense: [0, 1, 2],
            defensive: [1, -20, 5]
    }}
    tokenValue={1000}
    rarityTier="UNCOMMON"
 */

import cards from "./cards.json";

const toolName = {
    COPPER_HELMET : 'Copper Helmet',
}

export const getTestCards = () => {
    let testCards = [];
    
const rarityTiers = [
        'COMMON',
        'UNCOMMON',
        'RARE',
        'MYTHICAL',
        'ROYAL',
        'GODLY',
        'ULTIMATE'
    ];
    const classes = ['Magic', 'Archery', 'Melee'];
    const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    const getRandomElement = (array) =>
        cards[Math.floor(Math.random() * cards.length)];

    for(let i = 0; i < 20; ++i) {
        const card = getRandomElement(classes);

        let type = card.name;
        let suffix = '{}';

        console.info(card);

        testCards.push({
            name: card.name,
            image: `image of ${type}`,
            modifier: `${card.modifier.modifierID}`,
            equipmentType: type,
            equipmentClass: card.equipmentClass,
            totalStats: card.totalStats,
            tokenValue: card.GoGTokenValue,
            rarityTier: card.rarityTier
        });
    }

    return testCards;
};
