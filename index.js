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
    // for (x in voteArray) {
    //     if (!(voteArray[x].includes('"'))) {
    //         voteArray[x] = voteArray[x].split(",");
    //     } else {
    //         let foundEndQuote = true;
    //         voteArray[x] = voteArray[x].split('');
    //         for (let i = 0; i < voteArray[x].length; i++) {
    //             if (voteArray[x][i] == '"' && foundEndQuote == true) {
    //                 foundEndQuote = false;
    //             } else if (voteArray[x][i] == '"' && voteArray[x][i+1] == '"') {
    //                 i++;
    //             } else if (voteArray[x][i] == "," && foundEndQuote == false) {
    //                 voteArray[x][i] = "@";
    //             } else if (voteArray[x][i] == '"' && foundEndQuote == false) {
    //                 foundEndQuote = true;
    //             } 
    //         }
    //         voteArray[x] = voteArray[x].join('');
    //         voteArray[x] = voteArray[x].split(',');
    //         console.log(voteArray[x]);
    //         for (y in voteArray[x]) {
    //             if (voteArray[x][y].includes("\r")) {
    //                 voteArray[x][y] = voteArray[x][y].replace(/\r\n|\n|\r/, '');
    //             }
    //             if (voteArray[x][y][0] == '"') {
    //                 console.log(voteArray[x][y])
    //                 voteArray[x][y] = voteArray[x][y].split('');
    //                 voteArray[x][y].shift();
    //                 voteArray[x][y].pop();
    //                 voteArray[x][y] = voteArray[x][y].join('');
    //             }
    //             while (voteArray[x][y].indexOf('@') !== -1) {
    //                 voteArray[x][y] = voteArray[x][y].replace("@",",");
    //             }       
    //             while (voteArray[x][y].indexOf('""') !== -1) {
    //                 voteArray[x][y] = voteArray[x][y].replace('""','"');
    //             }                
    //         }
    //     }
    //     voteArray[x].shift();
    //     voteArray[x].shift();
    // }
    console.log(voteArray);
    return voteArray;
}

CSV = convertCSVtoVotes("Mayor.csv");

const a = new Vote(CSV[17]);
a.eliminate('Kevin "Khanh" Le, Sr.');
a.display();