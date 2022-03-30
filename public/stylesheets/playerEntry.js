// Maximum number of players on each team.
const MAX_PLAYERS = 15;


//On startup, binds F5 to move to playerAction
document.addEventListener('keydown', function(e) {
	if(e.keyCode == 116) {
		e.preventDefault();
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
    // Collect the IDs and names entered on the UI and add them to the corresponding team array.
    let redTeam = Array();
    let greenTeam = Array();
    for (let i = 0; i < 15; i++) {
        let redID = document.getElementById("redIdNumber" + (i+1)).value;
        let redName = document.getElementById("redCodeName" + (i+1)).value;
        if (redID != "" && redID != 0) {
            redTeam.push({"id": redID, "name": redName});
        }
        let greenID = document.getElementById("greenIdNumber" + (i+1)).value;
        let greenName = document.getElementById("greenCodeName" + (i+1)).value;
        if (greenID != "" && greenID != 0) {
            greenTeam.push({"id": greenID, "name": greenName});
        }
    }

    // Checks the server to see if any of the IDs match a known user from the DB.
    let newPlayerData = checkIDs(redTeam, greenTeam);

    // If the data the server sends back is the same as the sent data
    if (redTeam == newPlayerData.redTeam && greenTeam == newPlayerData.greenTeam) {
        // If all of the IDs have a name filled in, post the players and procceed to start the game.
        if (!isMissingNames(redTeam, greenTeam)) {
            //postPlayers(redTeam, greenTeam);
            location.assign("https://team-11-app.herokuapp.com/startTimer");
        }
    }
    // If any of the data the server sends back is different from what was sent.
    else {
        redTeam = newPlayerData.redTeam;
        greenTeam = newPlayerData.greenTeam;
        updateUI(redTeam, greenTeam);
    }
}

// Returns true if any of the userIDs do not yet have a name filled in.
function isMissingNames(redTeam, greenTeam) {
    let missingNames = false;

    // Checks each entry on the red team to make sure all of the entered IDs have a name.
    for (let i = 0; i < redTeam.length && i < 15; i++) {
        if ((redTeam[i].id != "" && redTeam[i].id != 0) && (redTeam[i].name == "")) {
            missingNames = true;
        }
    }
    // Checks each entry on the green team to make sure all of the entered IDs have a name.
    for (let i = 0; i < greenTeam.length && i < 15; i++) {
        if ((greenTeam[i].id != "" && greenTeam[i].id != 0) && (greenTeam[i].name == "")) {
            missingNames = true;
        }
    }

    return missingNames;
}

// Asks the server for a list if the usernames that correspond to the given IDs.
function checkIDs(redTeam, greenTeam) {
    let res = {};
    $.ajax({
        type: "GET",
        url: "https://team-11-app.herokuapp.com/playerEntry/checkIDs",
        dataType: "json",
        async: false,
        data: {"redTeam": redTeam, "greenTeam": greenTeam},
        success: function(response) {
            res = response;
        },
        error: function(e) {
            console.log("error checking IDs");
        }
    });
    return res;
}

// Posts the players to the server.
function postPlayers(redTeam, greenTeam) {
    // If every player's ID has a corresponding name, post the players to the DB.
    if (!isMissingNames(redTeam, greenTeam)) {
        $.ajax({
            type: "POST",
            url: "https://team-11-app.herokuapp.com/playerEntry/submit",
            dataType: "json",
            timeout: 4000,
            data: {"redTeam": redTeam, "greenTeam": greenTeam}
        });
    }
}

// Take the new player data received from the server and updates the UI to match.
function updateUI(redTeam, greenTeam) {
    for (let i = 0; i < redTeam.length && i < 15; i++) {
        document.getElementById("redIdNumber" + (i+1)).value = redTeam[i].id;
        document.getElementById("redCodeName" + (i+1)).value = redTeam[i].name;
        // If a player's ID is not in the DB and hasn't entered a name yet, color the name outline red.
        if (redTeam[i].name == "") {
            document.getElementById("redCodeName" + (i+1)).style.borderColor = "red";
        }
    }
    for (let i = 0; i < greenTeam.length && i < 15; i++) {
        document.getElementById("greenIdNumber" + (i+1)).value = greenTeam[i].id;
        document.getElementById("greenCodeName" + (i+1)).value = greenTeam[i].name;
        // If a player's ID is not in the DB and hasn't entered a name yet, color the name outline red.
        if (greenTeam[i].name == "") {
            document.getElementById("greenCodeName" + (i+1)).style.borderColor = "red";
        }
    }
}