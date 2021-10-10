import { EquipmentClass } from "./Constants.js";

export default class Stats {
    constructor(offenseStats = [0, 0, 0], defenseStats = [0, 0, 0], hp = 0) {
        this.offense = offenseStats;
        this.defense = defenseStats;
        this.hp = hp;
    }

    getAttackClass() {
        let atkClass = EquipmentClass.MELEE;
        if (this.offense[0] < this.offense[1]) {
            atkClass = EquipmentClass.MAGIC;
        }
        if (Math.max(this.offense[0], this.offense[1]) < this.offense[2]) {
            atkClass = EquipmentClass.RANGED;
        }
        return atkClass;
    }

    static multiply(stats, modifierQuality) {
        let newStats = new Stats();
        for (let i = 0; i < 3; ++i) {
            newStats.offense[i] = stats.offense[i] * modifierQuality;
            newStats.defense[i] = stats.defense[i] * modifierQuality;
        }
        newStats.hp = stats.hp * modifierQuality;
        return newStats;
    }

    static subtract(stats1, stats2) {
        let newStats = new Stats();
        for (let i = 0; i < 3; ++i) {
            newStats.offense[i] = stats1.offense[i] - stats2.offense[i];
            newStats.defense[i] = stats1.defense[i] - stats2.defense[i];
        }
        newStats.hp = stats1.hp - stats2.hp;
        return newStats;
    }

    static combine(stats1, stats2) {
        let newStats = new Stats();
        for (let i = 0; i < 3; ++i) {
            newStats.offense[i] = stats1.offense[i] + stats2.offense[i];
            newStats.defense[i] = stats1.defense[i] + stats2.defense[i];
        }
        newStats.hp = stats1.hp + stats2.hp;
        return newStats;
    }
}