let nameSeparator = "]";
let CSV = "";

const fs = require('fs');
const prompt = require('prompt-sync')();

class Vote {
    constructor(voteArray) {
        this.list = voteArray;
    }

    eliminate(name) {
        for (let x = 0; x < this.list.length; x++) {
            if (this.list[x] == name) {
                this.list.splice(x, 1);
            } else if (this.list[x].includes(name) && this.list[x].includes(nameSeparator)) {
                this.list[x] = this.list[x].replace(name, '');
                this.list[x] = this.list[x].replace(nameSeparator, '');
            }
        }
    }

    firstChoice() {
        return this.list[0];
    }

    isExhausted() {
        if (typeof this.firstChoice() == 'undefined') {
            return true;
        } else if (this.firstChoice().includes(nameSeparator)) {
            return true;
        } else {
            return false;
        }
    }

    display() {
        console.log(this.list);
    }
}
class VoteRound {
    constructor(countObj) {
        this.round = countObj;
        this.pastRounds = [];
    }
    roundTiebreak(tiedCandidatesArray, round) {
        //takes a round and a list of tied candidates and returns new list of candidates
        round = {B:3, C:4, D:0}
        for (x in round) {
            if (!(tiedCandidatesArray.includes(x))) {
                delete round[x];
            }
        }
        let arr = Object.values(round);
        let min = Math.min(...arr);
        let result = [];
        for (x in round) {
            if (round[x] === min && tiedCandidatesArray.includes(x)) {
                result.push(x)
            }
        }
        return result;
    }
    findWinner() {
        this.printRound();
        if (typeof this.getLeadCandidate() == "string" && this.isLeadMajorityVote()) {
            console.log("The winner is " + this.getLeadCandidate());
        } else if (typeof this.getLeadCandidate() == "object"){
            console.log("Tied vote. Looking at the previous rounds...");
            if (typeof this.findTieElimination(this.getLeadCandidate()) == "object") {
                let winner = this.getLeadCandidate().splice(this.getLeadCandidate().indexOf(this.findTieElimination(this.getLeadCandidate())), 1);
                console.log("The winner is " + winner);
            } else {
                if (typeof this.askTieElimination(this.getLeadCandidate()) != 'undefined') {
                    this.askTieElimination(this.getLeadCandidate())
                    console.log("The winner is ");
                } else {
                    return;
                }
                
            }
            
        } else {
            votelist.eliminate(this.findEliminate());
            this.newRound(votelist.countVotes());
        }
    }
    printRound() {
        console.log("Round " + (this.pastRounds.length + 1))
        for (x in this.round) {
            console.log(x + ": " + this.round[x])
        }
        console.log("");
    }

    askTieElimination(tiedCandidatesArray) {
        console.log("A number of candidates is tied and the tie cannot be broken:");
        for (x in tiedCandidatesArray) {
            console.log((parseInt(x)+1) + ".) " + tiedCandidatesArray[x]);
        }
        let result = "";
        while (result == "") {
            let answer = prompt("Please enter the number of the candidate to move on to the next round: ");
            console.log("");
            if (parseInt(answer) >= 1 && parseInt(answer) <= tiedCandidatesArray.length) {
                result = answer;
            } else {
                console.log("Invalid input.")
            }
        }
        tiedCandidatesArray.splice(parseInt(result)-1, 1)[0];
        return tiedCandidatesArray;
    }
    findTieElimination(tiedCandidatesArray) {
        /*
        let done = false;
        let didLoopChangeArray = false;
        let previousRoundTicker = this.pastRounds.length-1;
        while (!(done)) {
            didLoopChangeArray = false;
            if (tiedCandidatesArray.length > 1) {
                if (this.pastRounds[previousRoundTicker][tiedCandidatesArray[0]] < this.pastRounds[previousRoundTicker][tiedCandidatesArray[0+1]]) {
                    tiedCandidatesArray.pop();
                    didLoopChangeArray = true;
                } else if (this.pastRounds[previousRoundTicker][tiedCandidatesArray[0]] > this.pastRounds[previousRoundTicker][tiedCandidatesArray[0+1]]) {
                    tiedCandidatesArray.splice(0,1);
                    didLoopChangeArray = true;
                }
            }
            if (didLoopChangeArray == false) {
                done = true;
            }
            
        }
        if (tiedCandidatesArray.length == 1) {
            return tiedCandidatesArray;
        } else {
            return this.askTieElimination(tiedCandidatesArray);
        }
        */
       for (let x = this.pastRounds.length; x > 0; x--) {
           if (tiedCandidatesArray.length == 1) {
               x = 0;
               break;
           } 
           tiedCandidatesArray = this.roundTiebreak(tiedCandidatesArray, this.pastRounds[x]);
       }
       return tiedCandidatesArray;
    }

    isLeadMajorityVote() {
        if (typeof this.getLeadCandidate() == "object" || typeof this.round !== "object") {
            return false;
        }
        let leadVoteAmount = this.round[this.getLeadCandidate()];
        let otherVoteAmount = 0;
        for (x in this.round) {
           otherVoteAmount += this.round[x];
        }
        otherVoteAmount -= leadVoteAmount;
        if (leadVoteAmount > otherVoteAmount) {
            return true;
        } else {
            return false;
        }
    }

    getLeadCandidate() {
        if (typeof this.round !== 'object') {
            return;
        }
        let arr = Object.values(this.round);
        let max = Math.max(...arr);
        let result = [];
        for (x in this.round) {
            if (this.round[x] === max) {
                result.push(x)
            }
        }
        if (result.length == 1) {
            return result[0];
        } else {
            return result;
        }
    }

    newRound(array) {
        this.pastRounds.push(this.round);
        this.round = array;
        this.findWinner();
    }

    findEliminate() {
        if (typeof this.round !== 'object') {
            return;
        }
        let arr = Object.values(this.round);
        let min = Math.min(...arr);
        let result = [];
        for (x in this.round) {
            if (this.round[x] === min) {
                result.push(x)
            }
        }
        if (result.length != 1) {
            return this.findTieElimination(result)
        } else {
            return result;
        }
    }
}

class VoteList {
    constructor() {
        this.list = [];
    }

    eliminate(name) {
        console.log("Eliminating " + name)
        console.log("");
        for (x of this.list) {
            x.eliminate(name);
        }
    }
    display() {
        console.log(this.list);
    }
    getList() {
        return this.list;
    }
    countVotes() {
        let countObj = {};
        let nameFound = false;
        for (x in this.list) {
            nameFound = false;
            if (countObj.size != 0) {
                for (let y in countObj) {
                    if (y === this.list[x].firstChoice()) {
                        nameFound = true;
                    }
                }
            }

            if (!(this.list[x].isExhausted())) {
                if (nameFound == false) {
                    countObj[this.list[x].firstChoice()] = 1;
                } else {
                    countObj[this.list[x].firstChoice()] += 1;
                }
            }
            
        }
        return countObj;
    }
}

function readCSV(csvFile) {
    try {
        const data = fs.readFileSync(csvFile, 'utf8')
        let outputArray = [];
        outputArray = data.split("\n");
        return outputArray;
      } catch (err) {
        console.error(err)
      }
}
function convertCSVtoVotes(csvFile) {

    let voteArray = readCSV(csvFile);
    for (x in voteArray) {
        voteArray[x] = voteArray[x].split("");
        let storedArray = [];
        let storedWord = "";
        let state = "START";
        for (let y = 0; y < voteArray[x].length; y++) {
            if (voteArray[x][y].includes("\r")) {
                voteArray[x][y] = voteArray[x][y].replace(/\r\n|\n|\r/, '');
            }
            if (state == "START") {
                if (voteArray[x][y] == '"') {
                    state = "INSIDE_QUOTE";
                } else if (voteArray[x][y] == ",") {
                    storedArray.push("");
                } else {
                    storedWord += voteArray[x][y];
                    state = "INSIDE_UNQUOTE";
                }
            } else if (state == "INSIDE_UNQUOTE") {
                if (voteArray[x][y] == ",") {
                    storedArray.push(storedWord);
                    storedWord = "";
                    state = "START";
                } else if (y == voteArray[x].length-1) {
                    storedWord += voteArray[x][y];
                    storedArray.push(storedWord);
                    storedWord = "";
                    state = "START";
                } else {
                    storedWord += voteArray[x][y];
                }
            } else if (state == "INSIDE_QUOTE") {
                if (voteArray[x][y] == '"' && voteArray[x][parseInt(y)+1] == '"') {
                    storedWord += '"';
                    y++;
                } else if (voteArray[x][y] == '"') {
                    storedArray.push(storedWord);
                    storedWord = "";
                    state = "START";
                    y++;
                } else if (y == voteArray[x].length-1) {
                    storedWord += voteArray[x][y];
                    storedArray.push(storedWord);
                    storedWord = "";
                    state = "START";
                } else {
                    storedWord += voteArray[x][y];
                }
            }
        }
        voteArray[x] = storedArray;
        voteArray[x].shift();
        voteArray[x].shift();
    }
    return voteArray;
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

CSV = convertCSVtoVotes("Mayor2.csv");

const votelist = new VoteList();
for (x in CSV) {
    votelist.list[x] = new Vote(CSV[x]);
}
const voteRound = new VoteRound(votelist.countVotes());

voteRound.findWinner();
// console.log(voteRound.roundTiebreak(["B", "C"], voteRound.round))