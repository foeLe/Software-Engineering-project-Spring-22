//import {insertUser} from '../../start.js';      //imports needed function for entering data into database
// Maximum number of players on each team.
const MAX_PLAYERS = 15;


document.addEventListener('keydown', function(e) {
		if(e.keyCode == 116)
		{
			e.preventDefault();
			onSubmit();
			location.assign("https://team-11-app.herokuapp.com/playerAction");
		}
	})


class Player {
    constructor(idNumber, codeName) {
        this.idNumber = idNumber;
        this.codeName = codeName;
    }
}


// function bindF5() {
	// document.addEventListener('keydown', function(e) {
		// if(e.keyCode == 116)
		// {
			// e.preventDefault();
			// onSubmit();
			// location.assign("https://team-11-app.herokuapp.com/playerAction");
		// }
	// })
// }


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
    
    // insertUser(player.idNumber, player.codeName).then((result) => {
    //     if(result){
    //         console.log('player added')
    //     }
    // })
}