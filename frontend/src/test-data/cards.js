/* Example card data
--------------------
    name="Greater Amulet of Power"
    image="* image of amulet *"
    modifier="Power x3"
    equipmentType="Neck"
    equipmentClass="Magic"
    stats={{
        offensive: [0, 1, 2],
            defensive: [1, -20, 5]
    }}
    tokenValue={1000}
    rarityType="UNCOMMON"
 */

export const getTestCards = () => {
    let testCards = [];
    const prefixes = ['', '', '', '', 'Greater', 'Lesser'];
    const types = [
        'Sword',
        'Dagger',
        'Amulet',
        'Chest',
        'Legs',
        'Trinket',
        'Wand',
        'Bow'
    ];
    const suffixes = [
        'Dancing',
        'Prancing',
        'Fighting',
        'Kiting',
        'Killing',
        'Healing',
        'Stealing'
    ];
    const rarityTypes = [
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
        array[Math.floor(Math.random() * array.length)];

    for (let i = 0; i < 20; i++) {
        const prefix = getRandomElement(prefixes);
        const type = getRandomElement(types);
        const suffix = getRandomElement(suffixes);
        const eclass = getRandomElement(classes);

        testCards.push({
            name: `${prefix} ${type} of ${suffix}`,
            image: `image of ${type}`,
            modifier: `${suffix} x${getRandomElement(nums)}`,
            equipmentType: type,
            equipmentClass: eclass,
            stats: {
                offensive: [
                    getRandomElement(nums),
                    getRandomElement(nums),
                    getRandomElement(nums)
                ],
                defensive: [
                    getRandomElement(nums),
                    getRandomElement(nums),
                    getRandomElement(nums)
                ]
            },
            tokenValue: getRandomElement(nums) * 1000,
            rarityType: getRandomElement(rarityTypes)
        });
    }

    return testCards;
};
