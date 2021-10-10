import * as C from './Constants.js';

/*
Array of [ModifierID]

this.modifierArray = [C.Modifiers.POWER.id];
*/

export default class ModifierRollTable {
    constructor(...modifierArray) {
        this.modifierArray = modifierArray;
    }

    rollModifier() {
        let roll = Math.floor(Math.random() * 1000000);
        for (let i = 0; i < this.modifierArray.length; ++i) {
            let modifierDef = C.Modifiers[this.modifierArray[i]];
            if (modifierDef.rollChances[0] >= roll) {
                for (let i = 0; i < modifierDef.rollChances.length; ++i) {
                    if (modifierDef.rollChances[i] < roll) {
                        
                    }
                }
            }
            let rollWeight = this.modifierArray[i][1];
            roll -= rollWeight;
            if (roll <= 0) {
                return this.modifierArray[i][0];
            }
        }
        return C.Modifiers.NONE.id;
    }
}