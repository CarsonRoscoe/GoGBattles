import { BattleMove } from "./Constants.js";

export class BattleTurn {
    constructor() {
        this.advOrder = [0, 1, 2, 3, 4];
        this.advMoves = [BattleMove.ATTACK_ADV0, BattleMove.ATTACK_ADV1, BattleMove.ATTACK_ADV2, BattleMove.ATTACK_ADV3, BattleMove.ATTACK_ADV4];
    }    

    static default() {
        return new BattleTurn();
    }

    setMove(advID, move) {
        this.advMoves[advID] = move;
    }

    setMoves(battleTurn) {
        for (let i = 0; i < 5; ++i) {
            this.advOrder[i] = battleTurn.advOrder[i];
            this.advMoves[i] = battleTurn.advMoves[i];
        }
    }
}
