const startjs = module.require('../../start');      //imports needed function for entering data into database

// Maximum number of players on each team.
const MAX_PLAYERS = 15;

function printme() {        //test function to see if playerEntry.ejs can access this
    console.log('hello');
  };

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

		// Check to make sure the player info is not blank before submitting player
		if (idNumber != 0 && idNumber != "" && codeName != "") {
			let player = new Player(idNumber, codeName);
			
			// Submit player to database
			submitPlayer(player);
		}
    }

    // Gets the idNumber and codeName for each green player and submits it to the database.
    for (let i = 1; i <= MAX_PLAYERS; i++) {
        let idNumber = document.getElementById("greenIdNumber" + i).value;
        let codeName = document.getElementById("greenCodeName" + i).value;

		// Check to make sure the player info is not blank before submitting player
		if (idNumber != 0 && idNumber != "" && codeName != "") {
			let player = new Player(idNumber, codeName);
			
			// Submit player to database
			submitPlayer(player);
		}
    }
}

function submitPlayer(player) {

    // To do: submit player info to database.
    console.log("submitPlayer function here")
    console.log(player.idNumber + " " + player.codeName)
    
    startjs.insertUser(player.idNumber, player.codeName);
    //startjs.print();
    // startjs.(player.idNumber, player.codeName).then((result) => {
    //     if(result){
    //         console.log('player added')
    //     }
    // })
}