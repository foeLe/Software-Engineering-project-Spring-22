// Maximum number of players on each team.
const MAX_PLAYERS = 2;

class Player {
    constructor(idNumber, codeName) {
        this.idNumber = idNumber;
        this.codeName = codeName;
    }
}

function onSubmit() {
    // Gets the idNumber and codeName for each red player and submits it to the database.
    for (let i = 1; i <= MAX_PLAYERS; i++) {
        let idNumber = document.getElementById("redIdNumber" + i).value;
        let codeName = document.getElementById("redCodeName" + i).value;
        let player = new Player(idNumber, codeName);

        submitPlayer(player);
    }

    // Gets the idNumber and codeName for each green player and submits it to the database.
    for (let i = 1; i <= MAX_PLAYERS; i++) {
        let idNumber = document.getElementById("greenIdNumber" + i).value;
        let codeName = document.getElementById("greenCodeName" + i).value;
        let player = new Player(idNumber, codeName);

        submitPlayer(player);
    }
}

function submitPlayer(player) {

    // To do: submit player info to database.
    console.log("submitPlayer function here")
    console.log(player.idNumber + " " + player.codeName)
    // pool.query("INSERT INTO player('id', 'codename')values('player.idNumber', player.codename')",(err,res)=>{
    //     console.log(err,res);
    //     pool.end()
    // })
}