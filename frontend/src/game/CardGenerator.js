import {CardCatalog, GetSmallestCardTokenValue} from './Card.js';
/*


*/

class CardGenerator {
    constructor() {
        this.cardCatalogIndexIndex = 0;
        let quarterSize = Math.floor(CardCatalog.length / 4);
        this.cardCatalogIndexes = [0, quarterSize, quarterSize*2, quarterSize*3];
    }

    rollCards(GOGTokenAmount) {
        let tokensLeft = GOGTokenAmount;
        let tokensAwarded = 0;
        let cardsAwarded = [];

        while (tokensLeft > 0) {
            if (tokensLeft < GetSmallestCardTokenValue()) {
                tokensAwarded += tokensLeft;
                tokensLeft = 0;
            } else {
                let card = this._rollFromCardList(tokensLeft);
                tokensLeft -= card.GOGTokenValue;
                cardsAwarded.push(card);
            }
        }

        return {
            tokensAwarded, cardsAwarded
        };
    }

    _rollFromCardList(GOGTokenAmount) {
        let rollingCard = CardCatalog[this._getCardCatalogIndex()];
        this._updateCardCatalogIndex();

        //Check if they deposited enough tokens to earn this card.
        if (rollingCard.GOGTokenValue <= GOGTokenAmount) {
            let roll = Math.random() * rollingCard.rollChance;
            if (roll <= Math.min(rollingCard.rollChance / 2, GOGTokenAmount)) {
                return rollingCard;
            } else {
                return this._rollFromCardList(GOGTokenAmount);
            }
        } else {
            return this._rollFromCardList(GOGTokenAmount);
        }
    }

    _getCardCatalogIndex() {
        return this.cardCatalogIndexes[this.cardCatalogIndexIndex];
    }

    _updateCardCatalogIndex() {
        this.cardCatalogIndexes[this.cardCatalogIndexIndex] = (this.cardCatalogIndexes[this.cardCatalogIndexIndex] + 1) % CardCatalog.length;
        this.cardCatalogIndexIndex = (this.cardCatalogIndexIndex + 3) % this.cardCatalogIndexes.length;
    }
}


const cardGeneratorInstance = new CardGenerator();
export default cardGeneratorInstance;