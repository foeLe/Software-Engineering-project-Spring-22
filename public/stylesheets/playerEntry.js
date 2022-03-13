//import {insertUser} from '../../start.js';      //imports needed function for entering data into database
// Maximum number of players on each team.
const MAX_PLAYERS = 15;


//On startup, binds F5 to move to playerAction
document.addEventListener('keydown', function(e) {
	if(e.keyCode == 116) {
		e.preventDefault();
		//TO-DO: ALLOW PRESSING F5 TO ADD ENTERED INFO TO DATABASE (MOVE FROM start.js INTO onSubmit() IF NEEDED?)
		onSubmit();
	}
})

class Player {
    constructor(idNumber, codeName) {
        this.idNumber = idNumber;
        this.codeName = codeName;
    }
}


function onSubmit() {
    let redTeam = Array();
    let greenTeam = Array();
    for (let i = 0; i < 15; i++) {
        let redID = document.getElementById("redIdNumber" + (i+1)).value;
        let redName = document.getElementById("redCodeName" + (i+1)).value;
        if (redID != "" && redID != 0 && redName != "") {
            redTeam.push({"id": redID, "name": redName});
        }
        let greenID = document.getElementById("greenIdNumber" + (i+1)).value;
        let greenName = document.getElementById("greenCodeName" + (i+1)).value;
        if (greenID != "" && greenID != 0 && greenName != "") {
            greenTeam.push({"id": greenID, "name": greenName});
        }
    }
    $.ajax({
        type: "POST",
        url: "https://team-11-app.herokuapp.com/playerEntry/submit",
        dataType: "json",
        timeout: 4000,
        data: {"redTeam": redTeam, "greenTeam": greenTeam}
    });
    location.assign("https://team-11-app.herokuapp.com/startTimer");
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