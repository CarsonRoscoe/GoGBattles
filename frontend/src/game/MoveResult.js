export class MoveResult {
    constructor() {
        this.moves = [];
    }

    addMoveResult(advID, defenderID, damage, didKill) {
        this.moves[advID] = {
            defenderAdvID: defenderID,
            damage,
            didKill 
        };
    }

    reset() {
        this.moves = [];
    }
}