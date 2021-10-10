export default class Account {
    constructor(accountID) {
        this.accountID = accountID;
        this.cards = {}; //id: amount
        this.GAMEToken = 0;
        this.USDC = 0;
        this.USDCInSystem = 0;
    }

    //cards is obj of id: amount
    checkHasCards(cards) {
        let cardKeys = Object.keys(cards);
        for (let i = 0; i < cardKeys.length; i++) {
            if (this.cards[cardKeys[i]].amount < cards[cardKeys[i]]) {
                return false;
            }
        }
        return true;
    }

    addUSDC(usdc) {
        this.USDC += usdc;
    }

    addCards(cardArray) {
        for (let i = 0; i < cardArray.length; ++i) {
            let card = cardArray[i];
            if (this.cards[card.cardID] == null) {
                this.cards[card.cardID] = {
                    amount: 0,
                    rarity: card.rarityTier,
                };
            } 
            this.cards[card.cardID].amount += 1;
        }
    }
}