import * as C from './Constants.js';
import ModifierRollTable from './ModifierRollTable.js';
import Stats from './Stats.js';

// Auto updated
var smallestTokenValue = 10000000;

export const GetSmallestCardTokenValue = () => {
    return smallestTokenValue;
};

class ModifierData {
    constructor(modifierID, modifierTier) {
        let modifierDef = C.Modifiers[modifierID];
        this.modifierID = modifierID;
        this.modifierTier = modifierTier;
        this.modifierQuality = (modifierTier + 1);
        this.rarityPoints = modifierDef.rarityPoints[modifierTier];
        this.rollChance = modifierDef.rollChances[modifierTier];
        this.stats = Stats.multiply(modifierDef.stats, this.modifierQuality);
    }
}

class CardDef {
    constructor(equipmentType, equipmentClass, subType, baseStats, rarityBasePoints, GOGTokenBaseValue) {
        this.equipmentType = equipmentType;
        this.equipmentClass = equipmentClass;
        this.subType = subType;
        this.baseStats = baseStats;
        this.rarityBasePoints = rarityBasePoints;
        this.GOGTokenBaseValue = GOGTokenBaseValue;
        this.modifierRollTable = this._getApplicableModifierRollTable(this.equipmentType);
    }

    _getApplicableModifierRollTable(equipmentType) {
        if (equipmentType == C.EquipmentType.WEAPON || equipmentType == C.EquipmentType.SHIELD) {
            return ModifierRollTables.WEAPON;
        } else if (equipmentType == C.EquipmentType.AMULET) {
            return ModifierRollTables.ALL;
        } else {
            return ModifierRollTables.ARMOR;
        }
    }

    createValidCardsFromDef(cardKeyName) {
        let cards = [];
        let cardWords = cardKeyName.split('_');
        let cardName = '';
        for (let i = 0; i < cardWords.length; ++i) {
            cardName += cardWords[i].charAt(0).toUpperCase() + cardWords[i].substr(1).toLowerCase();
            if (i < cardWords.length - 1) {
                cardName += ' ';
            }
        }
        for (let i = 0; i < this.modifierRollTable.modifierArray.length; ++i) {
            let modifierID = this.modifierRollTable.modifierArray[i];
            let modifierDef = C.Modifiers[modifierID];
            for (let j = 0; j < modifierDef.rollChances.length; ++j) {
                let rarityPoints = this.rarityBasePoints + modifierDef.rarityPoints[j];
                let rarityTier = C.RarityPointToTier(rarityPoints);
                let modifierData = new ModifierData(modifierID, j);
                let modifierFullName = C.Modifiers[modifierID].name + (modifierData.modifierQuality > 1 ? ' (x' + modifierData.modifierQuality + ')' : '');
                let fullCardName = cardName + (modifierID == 'NONE' ? '' : ' of ' + modifierFullName);
                if (this.GOGTokenBaseValue < smallestTokenValue) {
                    smallestTokenValue = this.GOGTokenBaseValue;
                }
                let card = new Card(fullCardName, this.equipmentType, this.equipmentClass, this.subType, this.baseStats, rarityTier, modifierData, this.GOGTokenBaseValue, cardKeyName.toLowerCase());
                cards.push(card);
            }
        }
        return cards;
    }
}

var cardIDCounter = 0;

class Card {
    constructor(cardName, equipmentType, equipmentClass, subType, baseStats, rarityTier, modifer, GOGTokenValue, assetName) {
        this.name = cardName;
        this.cardID = cardIDCounter++;
        this.equipmentType = equipmentType;
        this.equipmentClass = equipmentClass;
        this.subType = subType;
        this.rarityTier = rarityTier;
        this.modifier = modifer;
        this.GOGTokenValue = GOGTokenValue;
        this.baseStats = baseStats;
        this.assetName = assetName;
        this.totalStats = Stats.combine(this.baseStats, this.modifier.stats);
        this.rollChance = C.CalculateRollChance(C.RarityTierToPoint[this.rarityTier], this.modifier.rarityPoints);
    }
}

const ModifierRollTables = {
    WEAPON: new ModifierRollTable(C.Modifiers.NONE.id, C.Modifiers.POWER.id, C.Modifiers.REFORGED.id, C.Modifiers.INTELLECT.id, C.Modifiers.ELEMENTAL.id, C.Modifiers.EAGLE_EYE.id, C.Modifiers.ASSASSIN.id, C.Modifiers.BERSERK.id, C.Modifiers.DIVINE.id),
    ARMOR: new ModifierRollTable(C.Modifiers.NONE.id, C.Modifiers.PARRY.id, C.Modifiers.REFORGED.id, C.Modifiers.AURA.id, C.Modifiers.ELEMENTAL.id, C.Modifiers.AGILE.id, C.Modifiers.ASSASSIN.id, C.Modifiers.TANK.id, C.Modifiers.DIVINE.id),
    ALL: new ModifierRollTable(C.Modifiers.NONE.id, C.Modifiers.POWER.id, C.Modifiers.PARRY.id, C.Modifiers.REFORGED.id, C.Modifiers.INTELLECT.id, C.Modifiers.AURA.id, C.Modifiers.ELEMENTAL.id, C.Modifiers.EAGLE_EYE.id, C.Modifiers.AGILE.id, C.Modifiers.ASSASSIN.id, C.Modifiers.BERSERK.id, C.Modifiers.TANK.id, C.Modifiers.DIVINE.id),
};


const CardDefCatalog = {
    COPPER_HELMET: new CardDef(C.EquipmentType.HELMET, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [1, -17, 0]), C.RarityTierToPoint.COMMON, 10),
    IRON_HELMET: new CardDef(C.EquipmentType.HELMET, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [2, -11, 0]), C.RarityTierToPoint.COMMON, 25),
    STEEL_HELMET: new CardDef(C.EquipmentType.HELMET, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [4, -7, 0]), C.RarityTierToPoint.UNCOMMON, 50),
    NELENITE_HELMET: new CardDef(C.EquipmentType.HELMET, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [7, -4, 0]), C.RarityTierToPoint.RARE, 100),
    GOTHITE_HELMET: new CardDef(C.EquipmentType.HELMET, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [11, -2, 0]), C.RarityTierToPoint.MYTHICAL, 250),
    OSMIUM_HELMET: new CardDef(C.EquipmentType.HELMET, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [17, -1, 0]), C.RarityTierToPoint.ROYAL, 500),
    COPPER_CHESTPLATE: new CardDef(C.EquipmentType.CHEST, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [1, -17, 0]), C.RarityTierToPoint.COMMON, 10),
    IRON_CHESTPLATE: new CardDef(C.EquipmentType.CHEST, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [2, -11, 0]), C.RarityTierToPoint.COMMON, 25),
    STEEL_CHESTPLATE: new CardDef(C.EquipmentType.CHEST, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [4, -7, 0]), C.RarityTierToPoint.UNCOMMON, 50),
    NELENITE_CHESTPLATE: new CardDef(C.EquipmentType.CHEST, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [7, -4, 0]), C.RarityTierToPoint.RARE, 100),
    GOTHITE_CHESTPLATE: new CardDef(C.EquipmentType.CHEST, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [11, -2, 0]), C.RarityTierToPoint.MYTHICAL, 250),
    OSMIUM_CHESTPLATE: new CardDef(C.EquipmentType.CHEST, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [17, -1, 0]), C.RarityTierToPoint.ROYAL, 500),
    COPPER_PLATELEGS: new CardDef(C.EquipmentType.LEGS, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [1, -17, 0]), C.RarityTierToPoint.COMMON, 10),
    IRON_PLATELEGS: new CardDef(C.EquipmentType.LEGS, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [2, -11, 0]), C.RarityTierToPoint.COMMON, 25),
    STEEL_PLATELEGS: new CardDef(C.EquipmentType.LEGS, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [4, -7, 0]), C.RarityTierToPoint.UNCOMMON, 50),
    NELENITE_PLATELEGS: new CardDef(C.EquipmentType.LEGS, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [7, -4, 0]), C.RarityTierToPoint.RARE, 100),
    GOTHITE_PLATELEGS: new CardDef(C.EquipmentType.LEGS, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [11, -2, 0]), C.RarityTierToPoint.MYTHICAL, 250),
    OSMIUM_PLATELEGS: new CardDef(C.EquipmentType.LEGS, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [17, -1, 0]), C.RarityTierToPoint.ROYAL, 500),
    COPPER_SWORD: new CardDef(C.EquipmentType.WEAPON, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, -17, 1]), C.RarityTierToPoint.COMMON, 10),
    IRON_SWORD: new CardDef(C.EquipmentType.WEAPON, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, -11, 2]), C.RarityTierToPoint.COMMON, 25),
    STEEL_SWORD: new CardDef(C.EquipmentType.WEAPON, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, -7, 4]), C.RarityTierToPoint.UNCOMMON, 50),
    NELENITE_SWORD: new CardDef(C.EquipmentType.WEAPON, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, -4, 7]), C.RarityTierToPoint.RARE, 100),
    GOTHITE_SWORD: new CardDef(C.EquipmentType.WEAPON, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, -2, 11]), C.RarityTierToPoint.MYTHICAL, 250),
    OSMIUM_SWORD: new CardDef(C.EquipmentType.WEAPON, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, -1, 17]), C.RarityTierToPoint.ROYAL, 500),
    COPPER_SWORD_OFFHAND: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, -17, 1]), C.RarityTierToPoint.COMMON, 10),
    IRON_SWORD_OFFHAND: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, -11, 2]), C.RarityTierToPoint.COMMON, 25),
    STEEL_SWORD_OFFHAND: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, -7, 4]), C.RarityTierToPoint.UNCOMMON, 50),
    NELENITE_SWORD_OFFHAND: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, -4, 7]), C.RarityTierToPoint.RARE, 100),
    GOTHITE_SWORD_OFFHAND: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, -2, 11]), C.RarityTierToPoint.MYTHICAL, 250),
    OSMIUM_SWORD_OFFHAND: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, -1, 17]), C.RarityTierToPoint.ROYAL, 500),
    COPPER_SHIELD: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [1, -17, 0]), C.RarityTierToPoint.COMMON, 10),
    IRON_SHIELD: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [2, -11, 0]), C.RarityTierToPoint.COMMON, 25),
    STEEL_SHIELD: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [4, -7, 0]), C.RarityTierToPoint.UNCOMMON, 50),
    NELENITE_SHIELD: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [7, -4, 0]), C.RarityTierToPoint.RARE, 100),
    GOTHITE_SHIELD: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [11, -2, 0]), C.RarityTierToPoint.MYTHICAL, 250),
    OSMIUM_SHIELD: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MELEE, C.SubType.NONE, new Stats([0, 0, 0], [17, -1, 0]), C.RarityTierToPoint.ROYAL, 500),

    BLUE_WIZARD_HAT: new CardDef(C.EquipmentType.HELMET, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 1, -17]), C.RarityTierToPoint.COMMON, 10),
    GREEN_WIZARD_HAT: new CardDef(C.EquipmentType.HELMET, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 2, -11]), C.RarityTierToPoint.COMMON, 25),
    PURPLE_WIZARD_HAT: new CardDef(C.EquipmentType.HELMET, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 4, -7]), C.RarityTierToPoint.UNCOMMON, 50),
    BURGUNDY_WIZARD_HAT: new CardDef(C.EquipmentType.HELMET, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 7, -4]), C.RarityTierToPoint.RARE, 100),
    RED_WIZARD_HAT: new CardDef(C.EquipmentType.HELMET, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 11, -2]), C.RarityTierToPoint.MYTHICAL, 250),
    WHITE_WIZARD_HAT: new CardDef(C.EquipmentType.HELMET, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 17, -1]), C.RarityTierToPoint.ROYAL, 500),
    BLUE_WIZARD_ROBE_TOP: new CardDef(C.EquipmentType.CHEST, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 1, -17]), C.RarityTierToPoint.COMMON, 10),
    GREEN_WIZARD_ROBE_TOP: new CardDef(C.EquipmentType.CHEST, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 2, -11]), C.RarityTierToPoint.COMMON, 25),
    PURPLE_WIZARD_ROBE_TOP: new CardDef(C.EquipmentType.CHEST, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 4, -7]), C.RarityTierToPoint.UNCOMMON, 50),
    BURGUNDY_WIZARD_ROBE_TOP: new CardDef(C.EquipmentType.CHEST, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 7, -4]), C.RarityTierToPoint.RARE, 100),
    RED_WIZARD_ROBE_TOP: new CardDef(C.EquipmentType.CHEST, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 11, -2]), C.RarityTierToPoint.MYTHICAL, 250),
    WHITE_WIZARD_ROBE_TOP: new CardDef(C.EquipmentType.CHEST, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 17, -1]), C.RarityTierToPoint.ROYAL, 500),
    BLUE_WIZARD_ROBE_BOTTOM: new CardDef(C.EquipmentType.LEGS, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 1, -17]), C.RarityTierToPoint.COMMON, 10),
    GREEN_WIZARD_ROBE_BOTTOM: new CardDef(C.EquipmentType.LEGS, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 2, -11]), C.RarityTierToPoint.COMMON, 25),
    PURPLE_WIZARD_ROBE_BOTTOM: new CardDef(C.EquipmentType.LEGS, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 4, -7]), C.RarityTierToPoint.UNCOMMON, 50),
    BURGUNDY_WIZARD_ROBE_BOTTOM: new CardDef(C.EquipmentType.LEGS, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 7, -4]), C.RarityTierToPoint.RARE, 100),
    RED_WIZARD_ROBE_BOTTOM: new CardDef(C.EquipmentType.LEGS, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 11, -2]), C.RarityTierToPoint.MYTHICAL, 250),
    WHITE_WIZARD_ROBE_BOTTOM: new CardDef(C.EquipmentType.LEGS, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 17, -1]), C.RarityTierToPoint.ROYAL, 500),
    BLUE_WIZARD_STAFF: new CardDef(C.EquipmentType.WEAPON, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([1, 0, -17]), C.RarityTierToPoint.COMMON, 10),
    GREEN_WIZARD_STAFF: new CardDef(C.EquipmentType.WEAPON, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([2, 0, -11]), C.RarityTierToPoint.COMMON, 25),
    PURPLE_WIZARD_STAFF: new CardDef(C.EquipmentType.WEAPON, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([4, 0, -7]), C.RarityTierToPoint.UNCOMMON, 50),
    BURGUNDY_WIZARD_STAFF: new CardDef(C.EquipmentType.WEAPON, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([7, 0, -4]), C.RarityTierToPoint.RARE, 100),
    RED_WIZARD_STAFF: new CardDef(C.EquipmentType.WEAPON, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([11, 0, -2]), C.RarityTierToPoint.MYTHICAL, 250),
    WHITE_WIZARD_STAFF: new CardDef(C.EquipmentType.WEAPON, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([17, 0, -1]), C.RarityTierToPoint.ROYAL, 500),
    BLUE_WIZARD_WAND: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([1, 0, -17]), C.RarityTierToPoint.COMMON, 10),
    GREEN_WIZARD_WAND: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([2, 0, -11]), C.RarityTierToPoint.COMMON, 25),
    PURPLE_WIZARD_WAND: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([4, 0, -7]), C.RarityTierToPoint.UNCOMMON, 50),
    BURGUNDY_WIZARD_WAND: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([7, 0, -4]), C.RarityTierToPoint.RARE, 100),
    RED_WIZARD_WAND: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([11, 0, -2]), C.RarityTierToPoint.MYTHICAL, 250),
    WHITE_WIZARD_WAND: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([17, 0, -1]), C.RarityTierToPoint.ROYAL, 500),
    BLUE_WIZARD_ORB: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 1, -17]), C.RarityTierToPoint.COMMON, 10),
    GREEN_WIZARD_ORB: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 2, -11]), C.RarityTierToPoint.COMMON, 25),
    PURPLE_WIZARD_ORB: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 4, -7]), C.RarityTierToPoint.UNCOMMON, 50),
    BURGUNDY_WIZARD_ORB: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 7, -4]), C.RarityTierToPoint.RARE, 100),
    RED_WIZARD_ORB: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 11, -2]), C.RarityTierToPoint.MYTHICAL, 250),
    WHITE_WIZARD_ORB: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.MAGIC, C.SubType.NONE, new Stats([0, 0, 0], [0, 17, -1]), C.RarityTierToPoint.ROYAL, 500),

    COPPER_CHAIN_HELMET: new CardDef(C.EquipmentType.HELMET, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-17, 0, 1]), C.RarityTierToPoint.COMMON, 10),
    IRON_CHAIN_HELMET: new CardDef(C.EquipmentType.HELMET, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-11, 0, 2]), C.RarityTierToPoint.COMMON, 25),
    STEEL_CHAIN_HELMET: new CardDef(C.EquipmentType.HELMET, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-7, 0, 4]), C.RarityTierToPoint.UNCOMMON, 50),
    NELENITE_CHAIN_HELMET: new CardDef(C.EquipmentType.HELMET, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-4, 0, 7]), C.RarityTierToPoint.RARE, 100),
    GOTHITE_CHAIN_HELMET: new CardDef(C.EquipmentType.HELMET, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-2, 0, 11]), C.RarityTierToPoint.MYTHICAL, 250),
    OSMIUM_CHAIN_HELMET: new CardDef(C.EquipmentType.HELMET, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-1, 0, 17]), C.RarityTierToPoint.ROYAL, 500),
    COPPER_CHAINBODY: new CardDef(C.EquipmentType.CHEST, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-17, 0, 1]), C.RarityTierToPoint.COMMON, 10),
    IRON_CHAINBODY: new CardDef(C.EquipmentType.CHEST, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-11, 0, 2]), C.RarityTierToPoint.COMMON, 25),
    STEEL_CHAINBODY: new CardDef(C.EquipmentType.CHEST, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-7, 0, 4]), C.RarityTierToPoint.UNCOMMON, 50),
    NELENITE_CHAINBODY: new CardDef(C.EquipmentType.CHEST, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-4, 0, 7]), C.RarityTierToPoint.RARE, 100),
    GOTHITE_CHAINBODY: new CardDef(C.EquipmentType.CHEST, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-2, 0, 11]), C.RarityTierToPoint.MYTHICAL, 250),
    OSMIUM_CHAINBODY: new CardDef(C.EquipmentType.CHEST, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-1, 0, 17]), C.RarityTierToPoint.ROYAL, 500),
    COPPER_CHAINLEGS: new CardDef(C.EquipmentType.LEGS, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-17, 0, 1]), C.RarityTierToPoint.COMMON, 10),
    IRON_CHAINLEGS: new CardDef(C.EquipmentType.LEGS, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-11, 0, 2]), C.RarityTierToPoint.COMMON, 25),
    STEEL_CHAINLEGS: new CardDef(C.EquipmentType.LEGS, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-7, 0, 4]), C.RarityTierToPoint.UNCOMMON, 50),
    NELENITE_CHAINLEGS: new CardDef(C.EquipmentType.LEGS, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-4, 0, 7]), C.RarityTierToPoint.RARE, 100),
    GOTHITE_CHAINLEGS: new CardDef(C.EquipmentType.LEGS, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-2, 0, 11]), C.RarityTierToPoint.MYTHICAL, 250),
    OSMIUM_CHAINLEGS: new CardDef(C.EquipmentType.LEGS, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-1, 0, 17]), C.RarityTierToPoint.ROYAL, 500),
    COPPER_CROSSBOW: new CardDef(C.EquipmentType.WEAPON, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([-17, 1, 0]), C.RarityTierToPoint.COMMON, 10),
    IRON_CROSSBOW: new CardDef(C.EquipmentType.WEAPON, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([-11, 2, 0]), C.RarityTierToPoint.COMMON, 25),
    STEEL_CROSSBOW: new CardDef(C.EquipmentType.WEAPON, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([-7, 4, 0]), C.RarityTierToPoint.UNCOMMON, 50),
    NELENITE_CROSSBOW: new CardDef(C.EquipmentType.WEAPON, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([-4, 7, 0]), C.RarityTierToPoint.RARE, 100),
    GOTHITE_CROSSBOW: new CardDef(C.EquipmentType.WEAPON, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([-2, 11, 0]), C.RarityTierToPoint.MYTHICAL, 250),
    OSMIUM_CROSSBOW: new CardDef(C.EquipmentType.WEAPON, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([-1, 17, 0]), C.RarityTierToPoint.ROYAL, 500),
    COPPER_DARTS: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([-17, 1, 0]), C.RarityTierToPoint.COMMON, 10),
    IRON_DARTS: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([-11, 2, 0]), C.RarityTierToPoint.COMMON, 25),
    STEEL_DARTS: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([-7, 4, 0]), C.RarityTierToPoint.UNCOMMON, 50),
    NELENITE_DARTS: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([-4, 7, 0]), C.RarityTierToPoint.RARE, 100),
    GOTHITE_DARTS: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([-2, 11, 0]), C.RarityTierToPoint.MYTHICAL, 250),
    OSMIUM_DARTS: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([-1, 17, 0]), C.RarityTierToPoint.ROYAL, 500),
    COPPER_ROUNDSHIELD: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-17, 0, 1]), C.RarityTierToPoint.COMMON, 10),
    IRON_ROUNDSHIELD: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-11, 0, 2]), C.RarityTierToPoint.COMMON, 25),
    STEEL_ROUNDSHIELD: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-7, 0, 4]), C.RarityTierToPoint.UNCOMMON, 50),
    NELENITE_ROUNDSHIELD: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-4, 0, 7]), C.RarityTierToPoint.RARE, 100),
    GOTHITE_ROUNDSHIELD: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-2, 0, 11]), C.RarityTierToPoint.MYTHICAL, 250),
    OSMIUM_ROUNDSHIELD: new CardDef(C.EquipmentType.SHIELD, C.EquipmentClass.RANGED, C.SubType.NONE, new Stats([0, 0, 0], [-1, 0, 17]), C.RarityTierToPoint.ROYAL, 500),

    AMULET_OF_FOCUS: new CardDef(C.EquipmentType.AMULET, C.EquipmentClass.ALL, C.SubType.FOCUS, new Stats([1, 1, 1]), C.RarityTierToPoint.UNCOMMON, 100),
    AMULET_OF_POWER: new CardDef(C.EquipmentType.AMULET, C.EquipmentClass.ALL, C.SubType.POWER, new Stats([3, 0, -1], [1, 0, 0]), C.RarityTierToPoint.UNCOMMON, 100),
    AMULET_OF_DEFENSE: new CardDef(C.EquipmentType.AMULET, C.EquipmentClass.ALL, C.SubType.DEFENSE, new Stats([0, 0, 0], [2, 2, 2]), C.RarityTierToPoint.RARE, 250),
    AMULET_OF_MAGIC: new CardDef(C.EquipmentType.AMULET, C.EquipmentClass.ALL, C.SubType.MAGIC, new Stats([-1, 3, 0], [0, 1, 0]), C.RarityTierToPoint.UNCOMMON, 100),
    AMULET_OF_RANGED: new CardDef(C.EquipmentType.AMULET, C.EquipmentClass.ALL, C.SubType.RANGED, new Stats([0, -1, 3], [0, 0, 1]), C.RarityTierToPoint.UNCOMMON, 100),
    AMULET_OF_HEALTH: new CardDef(C.EquipmentType.AMULET, C.EquipmentClass.ALL, C.SubType.HEALTH, new Stats([0, 0, 0], [0, 0, 0], 10), C.RarityTierToPoint.RARE, 250),
    AMULET_OF_INCREASED_FOCUS: new CardDef(C.EquipmentType.AMULET, C.EquipmentClass.ALL, C.SubType.FOCUS, new Stats([2, 2, 2]), C.RarityTierToPoint.RARE, 250),
    AMULET_OF_INCREASED_POWER: new CardDef(C.EquipmentType.AMULET, C.EquipmentClass.ALL, C.SubType.POWER, new Stats([6, 0, -2], [2, 0, 0]), C.RarityTierToPoint.RARE, 250),
    AMULET_OF_INCREASED_DEFENSE: new CardDef(C.EquipmentType.AMULET, C.EquipmentClass.ALL, C.SubType.DEFENSE, new Stats([0, 0, 0], [4, 4, 4]), C.RarityTierToPoint.MYTHICAL, 500),
    AMULET_OF_INCREASED_MAGIC: new CardDef(C.EquipmentType.AMULET, C.EquipmentClass.ALL, C.SubType.MAGIC, new Stats([-2, 6, 0], [0, 2, 0]), C.RarityTierToPoint.RARE, 250),
    AMULET_OF_INCREASED_RANGED: new CardDef(C.EquipmentType.AMULET, C.EquipmentClass.ALL, C.SubType.RANGED, new Stats([0, -2, 6], [0, 0, 2]), C.RarityTierToPoint.RARE, 250),
    AMULET_OF_INCREASED_HEALTH: new CardDef(C.EquipmentType.AMULET, C.EquipmentClass.ALL, C.SubType.HEALTH, new Stats([0, 0, 0], [0, 0, 0], 20), C.RarityTierToPoint.MYTHICAL, 500),
    AMULET_OF_MAXIMUM_FOCUS: new CardDef(C.EquipmentType.AMULET, C.EquipmentClass.ALL, C.SubType.FOCUS, new Stats([3, 3, 3]), C.RarityTierToPoint.MYTHICAL, 500),
    AMULET_OF_MAXIMUM_POWER: new CardDef(C.EquipmentType.AMULET, C.EquipmentClass.ALL, C.SubType.POWER, new Stats([9, 0, -3], [3, 0, 0]), C.RarityTierToPoint.MYTHICAL, 500),
    AMULET_OF_MAXIMUM_DEFENSE: new CardDef(C.EquipmentType.AMULET, C.EquipmentClass.ALL, C.SubType.DEFENSE, new Stats([0, 0, 0], [6, 6, 6]), C.RarityTierToPoint.ROYAL, 1000),
    AMULET_OF_MAXIMUM_MAGIC: new CardDef(C.EquipmentType.AMULET, C.EquipmentClass.ALL, C.SubType.MAGIC, new Stats([-3, 9, 0], [0, 3, 0]), C.RarityTierToPoint.MYTHICAL, 500),
    AMULET_OF_MAXIMUM_RANGED: new CardDef(C.EquipmentType.AMULET, C.EquipmentClass.ALL, C.SubType.RANGED, new Stats([0, -3, 9], [0, 0, 3]), C.RarityTierToPoint.MYTHICAL, 500),
    AMULET_OF_MAXIMUM_HEALTH: new CardDef(C.EquipmentType.AMULET, C.EquipmentClass.ALL, C.SubType.HEALTH, new Stats([0, 0, 0], [0, 0, 0], 30), C.RarityTierToPoint.ROYAL, 1000),
};

export const CardCatalog = [

];

const BuildCardCatalog = () => {
    let cardDefKeys = Object.keys(CardDefCatalog);
    for (let i = 0; i < cardDefKeys.length; ++i) {
        let validCardsFromDef = CardDefCatalog[cardDefKeys[i]].createValidCardsFromDef(cardDefKeys[i]);
        for (let c = 0; c < validCardsFromDef.length; ++c) {
            CardCatalog.push(validCardsFromDef[c]);
        }
    }
};

//BuildCardCatalog();