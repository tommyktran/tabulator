let nameSeparator = "]";
let CSV = "";

const fs = require('fs');

class Vote {
    constructor(voteArray) {
        this.list = voteArray;
    }

    eliminate(name) {
        console.log("Eliminating " + name);
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
        voteArray[x] = voteArray[x].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        voteArray[x].shift();
        voteArray[x].shift();
        for (y in voteArray[x]) {
            voteArray[x][y] = voteArray[x][y].replace("\r", '');
            voteArray[x][y] = voteArray[x][y].replace('"', '');
            voteArray[x][y] = voteArray[x][y].replace('"', '')
        }
    }
    return voteArray;
}

CSV = convertCSVtoVotes("Mayor.csv");

const a = new Vote(CSV[0]);
console.log(a.list);
a.eliminate("Miley Houston");
console.log(a.list);
console.log(a.firstChoice());
console.log(a.isExhausted());
a.display();