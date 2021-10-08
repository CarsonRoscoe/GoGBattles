export const adventurerActionTypes = {
    atk: 'atk',
    def: 'def',
    target: 'target',
    equip: 'equip',
    hp: 'hp'
};

export const adventurersInitialState = {
    enemyAdventurer1: {
        isAtk: false, // showing attack animation
        isDef: false, // showing taking damage animation
        hp: 100, // current hp
        target: null, // target to attack/support
        cards: {
            // equipped cards
            HELMET: null,
            CHEST: null,
            LEGS: null,
            WEAPON: null,
            SHIELD: null,
            AMULET: null
        }
    },
    enemyAdventurer2: {
        isAtk: false,
        isDef: false,
        hp: 100,
        target: null,
        cards: {
            HELMET: null,
            CHEST: null,
            LEGS: null,
            WEAPON: null,
            SHIELD: null,
            AMULET: null
        }
    },
    enemyAdventurer3: {
        isAtk: false,
        isDef: false,
        hp: 100,
        target: null,
        cards: {
            HELMET: null,
            CHEST: null,
            LEGS: null,
            WEAPON: null,
            SHIELD: null,
            AMULET: null
        }
    },
    enemyAdventurer4: {
        isAtk: false,
        isDef: false,
        hp: 100,
        target: null,
        cards: {
            HELMET: null,
            CHEST: null,
            LEGS: null,
            WEAPON: null,
            SHIELD: null,
            AMULET: null
        }
    },
    enemyAdventurer5: {
        isAtk: false,
        isDef: false,
        hp: 100,
        target: null,
        cards: {
            HELMET: null,
            CHEST: null,
            LEGS: null,
            WEAPON: null,
            SHIELD: null,
            AMULET: null
        }
    },
    adventurer1: {
        isAtk: false,
        isDef: false,
        hp: 100,
        target: null,
        cards: {
            HELMET: null,
            CHEST: null,
            LEGS: null,
            WEAPON: null,
            SHIELD: null,
            AMULET: null
        }
    },
    adventurer2: {
        isAtk: false,
        isDef: false,
        hp: 100,
        target: null,
        cards: {
            HELMET: null,
            CHEST: null,
            LEGS: null,
            WEAPON: null,
            SHIELD: null,
            AMULET: null
        }
    },
    adventurer3: {
        isAtk: false,
        isDef: false,
        hp: 100,
        target: null,
        cards: {
            HELMET: null,
            CHEST: null,
            LEGS: null,
            WEAPON: null,
            SHIELD: null,
            AMULET: null
        }
    },
    adventurer4: {
        isAtk: false,
        isDef: false,
        hp: 100,
        target: null,
        cards: {
            HELMET: null,
            CHEST: null,
            LEGS: null,
            WEAPON: null,
            SHIELD: null,
            AMULET: null
        }
    },
    adventurer5: {
        isAtk: false,
        isDef: false,
        hp: 100,
        target: null,
        cards: {
            HELMET: null,
            CHEST: null,
            LEGS: null,
            WEAPON: null,
            SHIELD: null,
            AMULET: null
        }
    }
};

export const adventurersReducer = (state, action) => {
    switch (action.type) {
        case adventurerActionTypes.atk: // { type, adventurerKey, isAtk }
            return {
                ...state,
                [action.adventurerKey]: {
                    ...state[action.adventurerKey],
                    isAtk: action.isAtk
                }
            };
        case adventurerActionTypes.def: // { type, adventurerKey, isDef }
            return {
                ...state,
                [action.adventurerKey]: {
                    ...state[action.adventurerKey],
                    isDef: action.isDef
                }
            };
        case adventurerActionTypes.target: // { type, adventurerKey, target }
            return {
                ...state,
                [action.adventurerKey]: {
                    ...state[action.adventurerKey],
                    target: action.target
                }
            };
        case adventurerActionTypes.equip: // { type, adventurerKey, slot, card }
            return {
                ...state,
                [action.adventurerKey]: {
                    ...state[action.adventurerKey],
                    cards: {
                        ...state[action.adventurerKey].cards,
                        [action.slot]: action.card
                    }
                }
            };
        case adventurerActionTypes.hp: // { type, adventurerKey, hp }
            return {
                ...state,
                [action.adventurerKey]: {
                    ...state[action.adventurerKey],
                    hp: action.hp
                }
            };
        default:
            return state;
    }
};
