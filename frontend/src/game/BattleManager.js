import {CardCatalog, GetSmallestCardTokenValue} from './Card.js';
import { BattleLogMessageDef, BattleLogMessageType, BattleMove } from './Constants.js';
import { PubSub } from './PubSub.js';
import Team from './Team.js';
import web3ManagerInstance from '../Web3Manager.js';
/*


*/

class BattleManager {
    constructor() {
        this.battleIDCounter = 0;

        this.battleQueue = [];
        this.battles = {};
        this.battleSimulator = null;
    }

    joinBattleQueue(team) {
        for (let i = 0; i < this.battleQueue.length; ++i) {
            if (this.battleQueue[i].accountName == team.accountName) {
                console.error('you are already in battle queue');
                return null;
            }
        }
        this.battleQueue.push(team);
        return this.tryCreateBattle();
    }

    createBattleFromBattleLog(team1, team2) {
        //verify battle joined here
        let battle = new Battle(this.battleIDCounter++, team1, team2);
        this.battles[battle.battleID] = battle;
    }

    tryCreateBattle() {
        if (this.battleQueue.length >= 2) {
            let team1 = this.battleQueue.shift();
            let team2 = null;
            for (let i = 0; i < this.battleQueue.length; ++i) {
                if (this.battleQueue[i].accountName != team1.accountName) {
                    team2 = this.battleQueue.splice(i, 1)[0];
                    break;
                }
            }
            if (team1 != null && team2 != null) {
                //return a request for team2 to sign the battle creation
            }
        }
    }

    completeBattle(battleID) {

    }

    validateBattle() {

    }

    createBattleSimulator(battleLog) {
        return this.battleSimulator = new BattleLogSimulator(battleLog);
    }

    getBattleSimulator() {
        return this.battleSimulator;
    }
}

export class BattleLogSimulator {
    constructor(battleLog, callback) {
        this.battleLog = battleLog;
        this.battleTurn = 0;
        this.team1 = null;
        this.team2 = null;
        this.battle = null;
        this.callback = callback;
    }

    validateExpectedAddress(turn) {
        let logAtTurn = this.battleLog.getBattleLog(turn);
        let verify = web3ManagerInstance.verifyBattleLog(logAtTurn);
        let addressCorrect = true;
        if (turn > 1) {
            addressCorrect = logAtTurn.address == (turn % 2 == 0 ? this.team1.address : this.team2.address);
        }
        return verify && addressCorrect;
    }

    getTeamFromAddress(address) {
        return this.team1.address == address ? this.team1 : this.team2;
    }

    verifyBattleCards() {
        let log = this.battleLog.getLastMessage();

        let team = this.getTeamFromAddress(log.address);
        team.setCards(log.data.advCards);

        return true;
    }

    verifyBattleTurnChanged() {
        let log = this.battleLog.getLastMessage();

        let team = this.getTeamFromAddress(log.address);
        team.battleTurn.setMoves(log.data.battleTurn);

        return true;
    }

    verifyCreateBattle() {
        let log = this.battleLog.getBattleLog();
        let log0 = this.battleLog.getLastMessage();
        if (this.battleTurn != 0) {
            return false;
        }
        if (log0.data.player1Address != log.address) {
            return false;
        }
        if (this.team1 != null) {
            return false;
        }
        if (log0.battleLogMessageType != BattleLogMessageType.CREATE_BATTLE) {
            return false;
        }

        this.team1 = new Team(log.address);
        return true;
    }

    verifyJoinBattle() {
        let log = this.battleLog.getBattleLog();
        let log0 = this.battleLog.messages[0];
        let log1 = this.battleLog.getLastMessage();
        if (this.battleTurn != 1) {
            return false;
        }
        if (log1.data.player2Address != log.address) {
            return false;
        }
        if (log0.data.player1Address == log1.data.player2Address) {
            return false;
        }
        if (this.team2 != null) {
            return false;
        }
        if (log1.battleLogMessageType != BattleLogMessageType.JOIN_BATTLE) {
            return false;
        }

        this.team2 = new Team(log.address);
        return true;
    }

    _simulateTurn(battleLogMessageType, data) {
        if (this.callback != null) {
            console.info(battleLogMessageType, data);
            this.callback(battleLogMessageType, data);
        }
        switch(battleLogMessageType) {
            case BattleLogMessageType.CREATE_BATTLE:
                return this.verifyCreateBattle();
            case BattleLogMessageType.JOIN_BATTLE:
                return this.verifyJoinBattle();
            case BattleLogMessageType.CHANGE_BATTLE_TURN:
                return this.verifyBattleTurnChanged();
            case BattleLogMessageType.SET_CARDS:
                return this.verifyBattleCards();
            case BattleLogMessageType.CLAIM_WIN:
                return this.verifyClaimWin();
        }
    }

    simulateMessage() {
        let log = this.battleLog.getLastMessage();
        if (!this.validateExpectedAddress(this.battleLog.messages.length - 1)) {
            return false;
        }
        if (!this._simulateTurn(log.battleLogMessageType, log.data)) {
            return false;
        }
        this.battleTurn++;
        return true;
    }

    addMessage(battleLogMessage, logAddress, logSignature) {
        if (this.battleLog == null) {
            this.battleLog = new BattleLog();
        }
        if (this.battleTurn != this.battleLog.messages.length) {
            return false;
        }
        this.battleLog.createLog(battleLogMessage.battleLogMessageType, battleLogMessage.data);
        this.battleLog.signLog(logAddress, logSignature);
        let res = this.simulateMessage();
        if (!res) {
            this.battleLog.messages.pop();
            return false;
        }

        return true;
    }
}

class BattleLogMessage {
    constructor(battleLogMessageType, data, signature, address) {
        this.battleLogMessageType = battleLogMessageType;
        this.data = data;
        this.signature = signature;
        this.address = address;
    }

    validate() {
        let def = BattleLogMessageDef[this.battleLogMessageType];
        if (def == null) {
            return false;
        }

        let defKeys = Object.keys(def);
        for (let i = 0; i < defKeys.length; ++i) {
            if (this.data[defKeys[i]] == null) {
                return false;
            }
        }

        return true;
    }
}

export class BattleLog extends PubSub {
    constructor() {
        super();
        this.messages = [];
        this.needsSignature = false;
        this.address = null;
        this.signature = null;
        this.listeners = [];
    }

    unsubscribeFromBattle(battle) {
        for (let i = 0; i < this.listeners.length; ++i) {
            let listenerData = this.listeners[i];
            battle.unsub(listenerData.key, listenerData.listenerID);
        }
    }

    subscribeToBattle(battle) {
        let listenerID = -1;
        listenerID = battle.subscribe('moveResult', (data) => {
            let player1Moves = data.player1Moves;
            let player2Moves = data.player2Moves;
            this.createLog(BattleLogMessageType.MOVE_RESULT, {
                player1Moves, player2Moves, 
            });
        });
        this.listeners.push({key: 'moveResult', listenerID});

        listenerID = battle.subscribe('completeBattle', (data) => {
            let winnerAddress = data.winnerAddress;
            this.createLog(BattleLogMessageType.CLAIM_WIN, {
                winnerAddress, 
            });
        });
        this.listeners.push({key: 'completeBattle', listenerID});

        listenerID = battle.subscribe('setBattleTurn', (data) => {
            let teamID = data.teamID;
            let battleTurn = data.battleTurn;
            this.createLog(BattleLogMessageType.CHANGE_BATTLE_TURN, {
                teamID, battleTurn, 
            });
        });
        this.listeners.push({key: 'setBattleTurn', listenerID});

        listenerID = battle.subscribe('setCards', (data) => {
            let teamID = data.teamID;
            let arrayOfAdvCards = data.arrayOfAdvCards;
            this.createLog(BattleLogMessageType.SET_CARDS, {
                teamID, arrayOfAdvCards, 
            });
        });
        this.listeners.push({key: 'setCards', listenerID});
    }

    createLog(battleLogMessageType, data) {
        let battleLogMessage = new BattleLogMessage(battleLogMessageType, data);
        if (!battleLogMessage.validate()) {
            return false;
        }
        // Already unsigned, sign the first message first.
        if (this.needsSignature) {
            return false;
        }
        if (this.address != null && this.signature != null
            && !this.messages[this.messages.length - 1].address
            && !this.messages[this.messages.length - 1].signature) {
            this.messages[this.messages.length - 1].address = this.address;
            this.messages[this.messages.length - 1].signature = this.signature;
            this.address = null;
            this.signature = null;
        }
        this.needsSignature = true;
        this.messages.push(battleLogMessage);
        this.publish('needsSignature', true);
    }

    signLog(address, signature) {
        if (!this.needsSignature) {
            return false;
        }
        this.address = address;
        this.signature = signature;
        this.needsSignature = false;
        return true;
    }

    getLastMessage() {
        let lastMessage = this.messages[this.messages.length - 1];
        // lastMessage.address = lastMessage.address || this.address;
        // lastMessage.signature = lastMessage.signature || this.signature;
        return lastMessage;
    }

    getBattleLog(logIndex = this.messages.length) {
        let realLogIndex = Math.max(0, Math.min(logIndex + 1, this.messages.length));
        let battleLog = new BattleLog();
        let messages = this.messages.slice(0, realLogIndex);
        battleLog.messages = messages;
        if (messages[messages.length-1].address && messages[messages.length-1].signature) {
            battleLog.address = messages[messages.length-1].address;
            battleLog.signature = messages[messages.length-1].signature;
            delete battleLog.messages[messages.length-1].address;
            delete battleLog.messages[messages.length-1].signature;
        } else if (this.address && this.signature) {
            battleLog.address = this.address;
            battleLog.signature = this.signature;
        }

        return battleLog;
    }

    toJSON() {
        return {
            messages: this.messages,
            address: this.address,
            signature: this.signature,
        };
    }

    fromJSON(data) {
        let bl = new BattleLog();
        bl.messages = data.messages;
        bl.needsSignature = data.needsSignature || false;
        bl.address = data.address || null;
        bl.signature = data.signature || null;
        return bl;
    }
}

/*
Players join battle queue until two unique teams are in queue
battle starts:
    first round is setup round. 
        you can make changes to your team gear
        you setup your default attack move stances
*/
class Battle extends PubSub {
    constructor(battleID, team1, team2) {
        super();
        this.battleID = battleID;
        this.team1 = team1;
        this.team2 = team2;

        this.teamTurn = 0;

        this.turn = 0;
        this.battleStartTimestamp = new Date().getTime();
        // this.battleInterval = setInterval(() => {
        //     this.runTeamTurns();
        // }, 5000);
        this.battleLog = new BattleLog();
        this.subscribeToBattle(this);
    }

    _getTeam(teamID) {
        return teamID == 0 ? this.team1 : this.team2;
    }

    //setup cards and default combat attacks
    setCards(teamID, arrayOfAdvCards) {
        if (this.turn != 0) {
            return false;
        }

        let team = this._getTeam(teamID);
        team.setCards(arrayOfAdvCards);
        this.publish('setCards', {
            teamID, arrayOfAdvCards
        });
    }

    setBattleTurn(teamID, battleTurn) {
        let team = this._getTeam(teamID);
        team.setBattleTurn(battleTurn);
        this.publish('setBattleTurn', {
            teamID, battleTurn
        });
    }

    startBattle() {
        let team1CardCount = this._getTeam(0).getCardCountUsed();
        let team2CardCount = this._getTeam(1).getCardCountUsed();
        this.teamTurn = (team1CardCount < team2CardCount) ? 0 : 1;
    }

    completeBattle(winnerAddress) {
        this.publish('completeBattle', {
            winnerAddress,
        });
    }

    checkBattleWin() {
        let team1Alive = false;
        let team2Alive = false;

        for (let i = 0; i < 5; ++i) {
            let team1Adv = this.team1.adventurers[i];
            let team2Adv = this.team2.adventurers[i];
            if (!team1Adv.isDead()) {
                team1Alive = true;
            }
            if (!team2Adv.isDead()) {
                team2Alive = true;
            }
        }

        if (!team2Alive) { // Team 2 is dead, team 1 win
            this.completeBattle(this.team1.address);
        } else if (!team1Alive) { // Team 1 is dead, team 2 win
            this.completeBattle(this.team2.address);
        }
    }

    runTeamTurns() {
        this.teamTurn = Math.abs(this.teamTurn - 1);
        this.team1.moveResult.reset();
        this.team2.moveResult.reset();

        let teamFirst = this._getTeam(this.teamTurn);
        let teamSecond = this._getTeam(Math.abs(this.teamTurn - 1));
        let teamFirstMoveID = -1;
        let teamSecondMoveID = -1;
        for (let i = 0; i < 5; ++i) {
            while (++teamFirstMoveID < 5 && !this.runMove(teamFirstMoveID, teamFirst, teamSecond)) {}
            while (++teamSecondMoveID < 5 && !this.runMove(teamSecondMoveID, teamSecond, teamFirst)) {}
        }

        this.publish('moveResult', {
            player1Moves: this.team1.moveResult.moves,
            player2Moves: this.team2.moveResult.moves,
        });

        ++this.turn;
    }

    runMove(moveID, attackingTeam, defendingTeam) {
        let advIDToMove = attackingTeam.battleTurn.advOrder[moveID];
        let advMove = attackingTeam.battleTurn.advMoves[advIDToMove];

        if (attackingTeam.adventurers[advIDToMove].isDead()) {
            return false;
        }

        if (!this._runMove(advMove, attackingTeam, advIDToMove, defendingTeam)) {
            this.checkBattleWin();
        }
        return true;
    }

    _getStartingDefenderAdventurerID(advMove, defendingTeam) {
        let defenderAdvID = 0;
        switch(advMove) {
            case BattleMove.ATTACK_ADV0:
                defenderAdvID = 0;
            break;
            case BattleMove.ATTACK_ADV1:
                defenderAdvID = 1;
            break;
            case BattleMove.ATTACK_ADV2:
                defenderAdvID = 2;
            break;
            case BattleMove.ATTACK_ADV3:
                defenderAdvID = 3;
            break;
            case BattleMove.ATTACK_ADV4:
                defenderAdvID = 4;
            break;
            case BattleMove.ATTACK_WEAKEST:
                let lowestHP = 9999999999;
                for (let i = 0; i < 5; ++i) {
                    let defAdv = defendingTeam.adventurers[i];
                    if (!defAdv.isDead() && defAdv.stats.hp < lowestHP) {
                        lowestHP = defendingTeam.adventurers[i].stats.hp;
                        defenderAdvID = i;
                    }
                }
            break;
            case BattleMove.ATTACK_STRONGEST:
                let highestHP = -1;
                for (let i = 0; i < 5; ++i) {
                    let defAdv = defendingTeam.adventurers[i];
                    if (!defAdv.isDead() && defAdv.stats.hp > highestHP) {
                        highestHP = defendingTeam.adventurers[i].stats.hp;
                        defenderAdvID = i;
                    }
                }
            break;
        }
        return defenderAdvID;
    }

    /*
    Returns if the move was successful.
    false is if:
     - No adventurers are alive on defending team
    */
    _runMove(advMove, attackingTeam, atkAdvID, defendingTeam) {
        let defenderAdvID = this._getStartingDefenderAdventurerID(advMove, defendingTeam);
        let validDefenderFound = false;
        for (let i = 0; i < 5; ++i) {
            if (!defendingTeam.adventurers[defenderAdvID].isDead()) {
                validDefenderFound = true;
                break;
            }
            defenderAdvID = (++defenderAdvID % 5);
        }

        if (validDefenderFound) {
            console.info(defendingTeam.adventurers[defenderAdvID], defenderAdvID, attackingTeam.adventurers[atkAdvID], atkAdvID)
            let damageDealt = defendingTeam.adventurers[defenderAdvID].attack(attackingTeam.adventurers[atkAdvID].stats);
            attackingTeam.moveResult.setMoveResult(atkAdvID, defenderAdvID, damageDealt, defendingTeam.adventurers[defenderAdvID].isDead());
            return true;
        } else {
            return false;
        }
    }
}

// players setup their adventurers and their cards
// join battle queue with GAME wager
// once 2+ players added to queue, grab top 2.
// if you are included in the battle, simulate it
    // ability to view battles you are not a part of on the home screen

// simulation:
// player with the lowest amount of cards in play goes first, or random roll
// each players setup a turn for each of their adventurers
    // player adv attacks other player adv, then next team goes until turn is done
// each side signs their move
// players have 1 minute to make their move, or the simulation is auto assigned



const battleManagerInstance = new BattleManager();
export default battleManagerInstance;