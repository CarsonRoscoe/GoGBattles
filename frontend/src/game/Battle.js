const Team = require('./Team.js').Team;

/*
How the battle works:

It is turn based but to avoid the problem of the who goes first advantage, we alternate who goes first each round. 
Since battles can vary in rounds, this should be hard enough to determine who gets an advantage.

Each round, a team is picked and one random adventurer attacks another random adventurer on the other team.
After the first attack, the other team goes. They choose a random adventurer and they attack a random adventurer.

If we get a server, we can make these random attacks determined by the player, and make it a 5 choose 5. 
In 5 choose 5, the first team to play selects 5 moves (1 for each adventurer), and then the next team plays.
This can be stacked easier for an advantage, but a 1 choose 1 is slow so we might have to determine what to do here.
Random is fast and gives some luck to it.
*/

const calculateDamage = (attackClass, offenseStats, defenseStats) => {
    let index = EquipmentClassToIndex[attackClass];
    let damage = 1 + Math.max(0, offenseStats[index] - defenseStats[index]);
    return damage;
}

const getTeam = (teamTurn, team1, team2) => {
    return teamTurn == 0 ? team1: team2;
}

const getDefendingTeam = (teamTurn, team1, team2) => {
    return teamTurn == 1 ? team1: team2;
}

class Battle {
    constructor(team1, team2) {
        this.team1 = team1;
        this.team2 = team2;
        this.turn = 0;
        this.battleStarted = false;
    }

    battleStart() {
        if (this.team1 == null || !this.team1.validTeam()) {
            console.error('Adventurer team 1 size is not 5!');
            return false;
        }
        if (this.team2 == null || !this.team2.validTeam()) {
            console.error('Adventurer team 2 size is not 5!');
            return false;
        }
        this.battleStarted = true;
    }

    _battleTurn() {

        let rounds = 1;
        let teamTurn = (Math.random() * 2 <= 1 ? 0 : 1);
        for (let i = 0; i < rounds; ++i) {
            let attacker = getTeam(teamTurn, adventurerTeam1, adventurerTeam2).getRandomAdventurer();
            let defender = getDefendingTeam(teamTurn, adventurerTeam1, adventurerTeam2).getRandomAdventurer();
            let damage = calculateDamage(attacker.attackClass, attacker.offenseStats, defender.defenseStats);
            getDefendingTeam(teamTurn, adventurerTeam1, adventurerTeam2).applyDamage(damage, defender.advID);
            if (defender.adventurers.stillFighting()) {
                teamTurn = teamTurn == 0 ? 1 : 0;
            } else {
                console.info('Team ', (teamTurn + 1), ' has won!');
                console.info(getTeam(teamTurn, adventurerTeam1, adventurerTeam2));
            }
        }
    }
}