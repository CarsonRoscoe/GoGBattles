/*
Contains all the cards being used in a team battle. 
Used to normalize the collection data so that it can be used throughout easily.
*/
export class TeamCardSet {
    constructor(cardTeamSet) {
        this.cards = [];
    }

    getAdvsCard2DArray() {

    }

    getAdvCardArray(advID) {

    }

    getCard(advID, slot) {

    }

    toJSON(index) {

    }
}

export class AdventurerCardSet {
    constructor(advID, cardAdvSet) {
        this.advID = advID;
        this.cards = [];
        if (typeof Object == cardAdvSet) {
            if (Array.isArray(cardAdvSet)) {
                this.cards = cardAdvSet;
            } else {
                
            }
        }
    }

    getAdvCardArray(advID) {
        return this.cards;
    }

    toJSON(index) {
        return {
            cards: this.cards,
            advID: this.advID,
        };
    }
}