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

    // Checks if the data the server sends back is the same as the sent data
    let hasChanged = false;
    for (let i = 0; i < redTeam.length && i < newPlayerData.redTeam.length && i < 15; i++) {
        if (redTeam[i].id != newPlayerData.redTeam[i].id || redTeam[i].name != newPlayerData.redTeam[i].name)
        {
            hasChanged = true;
        }
    }
    for (let i = 0; i < greenTeam.length && i < newPlayerData.greenTeam.length && i < 15; i++) {
        if (greenTeam[i].id != newPlayerData.greenTeam[i].id || greenTeam[i].name != newPlayerData.greenTeam[i].name)
        {
            hasChanged = true;
        }
    }

    if (!hasChanged) {
        // If all of the IDs have a name filled in, post the players and procceed to start the game.
        if (!isMissingNames(redTeam, greenTeam)) {
            postPlayers(redTeam, greenTeam);
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

// Checks if there duplicates for names/IDs.
// There might be a better way to pass data in to make this function more generic.
function checkDuplicates(redTeam, greenTeam)
{
    //Holds the boolean values to let the user name what is duplicated entries.
    let duplicateIdsBoth = false;
    let duplicateNamesBoth = false;
    let duplicateIdsRed = false;
    let duplicateNamesRed = false;
    let duplicateIdsGreen = false;
    let duplicateNamesGreen = false;
    
    //checking for duplicate Ids between teams
    for (let redI = 0; redI < redTeam.length && redI < 15; redI++)
    {
        for (let greenI = 0; greenI < greenTeam.length && greenI < 15; greenI++)
        {
            if (redTeam[redI].id == greenTeam[greenI].id)
            {
                //Maybe we should make sure if anything is null it should not impact the result.
                duplicateIdsBoth = true;
                alert("Both teams have the same user ID. Please change the ID found at: " + (redI+1) + " for the red team or change the ID found at: " + (greenI+1) + " for the green team.")
            }
        }
    }
    //checking for duplicate names between teams
    for (let redI = 0; redI < redTeam.length && redI < 15; redI++)
    {
        for (let greenI = 0; greenI < greenTeam.length && greenI < 15; greenI++)
        {
            if (redTeam[redI].name == greenTeam[greenI].name)
            {
                //Maybe we should make sure if anything is null it should not impact the result.
                duplicateNamesBoth = true;
                alert("Both teams have the same playername. Please change the name found at: " + (redI+1) + " for the red team or change the name found at: " + (greenI+1) + " for the green team.")
            }
        }
    }
    //This is where the check for IDs and name start for the red team.
    //This is the checks for the Ids. 
    for (let redI = 0; redI < redTeam.length && redI < 15; redI++)
    {
        for (let redI2 = 0; redI2 < redTeam.length && redI2 < 15; redI2++)
        {
            if(redI != redI2)
            {
                if(redTeam[redI].id == redTeam[redI2].id)
                {
                    duplicateIdsRed = true;
                    alert("The red team seems to be using the same id for two members. Please change the id for either player: " + (redI+1) + " or for player: " + (redI2 +1));
                }
            }
        }
    }

    //This is the checks for names
    for (let redI = 0; redI < redTeam.length && redI < 15; redI++)
    {
        for (let redI2 = 0; redI2 < redTeam.length && redI2 < 15; redI2++)
        {
            if(redI != redI2)
            {
                if(redTeam[redI].name == redTeam[redI2].name)
                {
                    duplicateNamesRed = true;
                    alert("The red team seems to be using the same name for two members. Please change the name for either player: " + (redI+1) + " or for player: " + (redI2 +1));
                }
            }
        }
    }

    //This is where the check for names and ID start for the green team.
    //This is the checks for the Ids. 
    for (let greenI = 0; greenI < greenTeam.length && greenI < 15; greenI++)
    {
        for (let greenI2 = 0; greenI2 < greenTeam.length && greenI2 < 15; greenI2++)
        {
            if(greenI != greenI2)
            {
                if(greenTeam[greenI].id == greenTeam[greenI2].id)
                {
                    duplicateIdsGreen = true;
                    alert("The green team seems to be using the same id for two members. Please change the id for either player: " + (greenI+1) + " or for player: " + (greenI2 +1));
                }
            }
        }
    }

    //This is the checks for names
    for (let greenI = 0; greenI < greenTeam.length && greenI < 15; greenI++)
    {
        for (let greenI2 = 0; greenI2 < greenTeam.length && greenI2 < 15; greenI2++)
        {
            if(greenI != greenI2)
            {
                if(greenTeam[greenI].name == greenTeam[greenI2].name
                {
                    duplicateNamesGreen = true;
                    alert("The green team seems to be using the same name for two members. Please change the name for either player: " + (greenI+1) + " or for player: " + (greenI2 +1));
                }
            }
        }
    }    

    //This is where the logic goes to call the next function if 
    //We will text all the entered text before checking the ids. 
    if( duplicateIdsBoth && duplicateNamesBoth && duplicateIdsRed && duplicateNamesRed && duplicateIdsGreen && duplicateNamesGreen == false)
    {
        //We can use this to call the next function.
    }
}

// Returns true if any of the userIDs do not yet have a name filled in.
function isMissingNames(redTeam, greenTeam) {
    let missingNames = false;

    // Checks each entry on the red team to make sure all of the entered IDs have a name.
    for (let i = 0; i < redTeam.length && i < 15; i++) {
        if ((redTeam[i].id != "" && redTeam[i].id != 0) && (redTeam[i].name == "" || redTeam[i].name == "<Name taken!>")) {
            missingNames = true;
        }
    }
    // Checks each entry on the green team to make sure all of the entered IDs have a name.
    for (let i = 0; i < greenTeam.length && i < 15; i++) {
        if ((greenTeam[i].id != "" && greenTeam[i].id != 0) && (greenTeam[i].name == "" || greenTeam[i].name == "<Name taken!>")) {
            missingNames = true;
        }
    }

    return missingNames;
}

// Asks the server for a list if the usernames that correspond to the given IDs. 
// Returns "<Name taken!>" if a name if already taken. 
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
        if (redTeam[i].name == "" || redTeam[i].name == "<Name taken!>") {
            document.getElementById("redCodeName" + (i+1)).style.borderColor = "red";
        }
    }
    for (let i = 0; i < greenTeam.length && i < 15; i++) {
        document.getElementById("greenIdNumber" + (i+1)).value = greenTeam[i].id;
        document.getElementById("greenCodeName" + (i+1)).value = greenTeam[i].name;
        // If a player's ID is not in the DB and hasn't entered a name yet, color the name outline red.
        if (greenTeam[i].name == "" || greenTeam[i].name == "<Name taken!>") {
            document.getElementById("greenCodeName" + (i+1)).style.borderColor = "red";
        }
    }
}