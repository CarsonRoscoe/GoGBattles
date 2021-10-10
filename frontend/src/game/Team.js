import Adventurer from "./Adventurer.js";
import { BattleTurn } from "./BattleTurn.js";
import { CardCatalog } from "./Card.js";
import { MoveResult } from "./MoveResult.js";

export default class Team {
    constructor(address) {
        this.address = address;
        this.adventurers = [new Adventurer(), new Adventurer(), new Adventurer(), new Adventurer(), new Adventurer()];
        this.battleTurn = BattleTurn.default();
        this.moveResult = new MoveResult();
    }

    toData() {
        return {
            accountName: this.accountName,

        };
    }

    setBattleTurn(battleTurn) {
        this.battleTurn = battleTurn;
    }

    /*
    [[adv1: cardIDs], [adv2: cardIDs], ...]
    */
    setCards(arrayOfAdvCards) {
        for (let a = 0; a < arrayOfAdvCards.length; ++a) {
            for (let i = 0; i < arrayOfAdvCards[a].length; ++i) {
                let card = CardCatalog[arrayOfAdvCards[a][i]];
                if (card) {
                    this.adventurers[a].applyCard(card); // was
                }
            }
        }
    }

    getArrayOfAdvCards() {
        let cards = [];
        for (let a = 0; a < 5; ++a) {
            cards.push(Object.values(this.adventurers[a].getCardsUsed()));
        }
        return cards;
    }

    getCardsUsed() {
        let cards = {}; //id: amount
        for (let i = 0; i < this.adventurers.length; ++i) {
            let advCards = this.adventurers[i].getCardsUsed();
            let advCardKeys = Object.keys(advCards);
            for (let i = 0; i < advCardKeys.length; ++i) {
                if (!cards[advCardKeys[i]]) {
                    cards[advCardKeys[i]] = 0;
                }
                cards[advCardKeys[i]] += advCards[advCardKeys[i]];
            }
        }
        return cards;
    }

    getCardCountUsed() {
        let cards = this.getCardsUsed();
        let cardKeys = Object.keys(cards);
        let count = 0;
        for (let i = 0; i < cardKeys.length; ++i) {
            count += cards[cardKeys];
        }
        return count;
    }

    applyDamage(advID, damage) {
        if (this.adventurers[advID] == null) {
            console.error('Could not apply damage to null adv.');
            return;
        }
        this.adventurers[advID].damage(damage);
    }

    getRandomAdventurer() {
        let size = this.adventurers.length - 0.000001;
        return this.adventurers[Math.floor(Math.random() * size)];
    }

    stillFighting() {
        return this.adventurers.length > 0;
    }
}