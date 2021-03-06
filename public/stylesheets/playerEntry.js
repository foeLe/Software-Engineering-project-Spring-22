// Maximum number of players on each team.
const MAX_PLAYERS = 15;

// Default border color of the user input boxes.
const DEFAULT_BORDER_COLOR = "#767676";

// Color that user input boxes are highlight when it needs attention.
const HIGHLIGHT_COLOR = "#FF0000";

// KeyCode of the key used to submit the players to the server.
const SUBMIT_KEY = 116; // [F5]

// URLs
const START_TIMER_URL = "/startTimer";
const CHECK_IDS_URL = "/playerEntry/checkIDs";
const POST_PLAYERS_URL = "/playerEntry/submit";

// On startup, binds submit button to the submit function.
$(document).ready(function() {
    document.getElementById("submitButton").addEventListener("click", function() {
        onSubmit();
    });
});

// On startup, binds key listener to SUBMIT_KEY.
document.addEventListener('keydown', function(e) {
	if(e.keyCode == SUBMIT_KEY) {
		e.preventDefault();
		onSubmit();
	}
})

// This is the function that is called when the user presses the submit key.
function onSubmit() {
    // Collect the IDs and names entered on the UI and add them to the corresponding team array.
    let redTeam = Array();
    let greenTeam = Array();
    for (let i = 0; i < MAX_PLAYERS; i++) {
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

    // Checks to make sure there is at least 1 player on each team.
    if (redTeam.length > 0 && greenTeam.length > 0) {
        // Checks if any of the current IDs or names are duplicates.
        if (!checkDuplicates(redTeam, greenTeam)) {
            // Checks the server to see if any of the IDs match a known user from the DB.
            let newPlayerData = checkIDs(redTeam, greenTeam);

            // Checks if the data the server sends back is the same as the sent data
            let hasChanged = false;
            for (let i = 0; i < redTeam.length && i < newPlayerData.redTeam.length && i < MAX_PLAYERS; i++) {
                if (redTeam[i].id != newPlayerData.redTeam[i].id || redTeam[i].name != newPlayerData.redTeam[i].name)
                {
                    hasChanged = true;
                }
            }
            for (let i = 0; i < greenTeam.length && i < newPlayerData.greenTeam.length && i < MAX_PLAYERS; i++) {
                if (greenTeam[i].id != newPlayerData.greenTeam[i].id || greenTeam[i].name != newPlayerData.greenTeam[i].name)
                {
                    hasChanged = true;
                }
            }

            if (!hasChanged) {
                // If all of the IDs have a name filled in, post the players and procceed to start the game.
                if (!isMissingNames(redTeam, greenTeam)) {
                    postPlayers(redTeam, greenTeam);
                    location.assign(START_TIMER_URL);
                }
            }
            // If any of the data the server sends back is different from what was sent.
            else {
                redTeam = newPlayerData.redTeam;
                greenTeam = newPlayerData.greenTeam;
                updateUI(redTeam, greenTeam);
            }
        }
        else {
            alert("Duplicate player names or IDs have been entered!")
        }
    }
    else {
        alert("Each team must have at least one player!");
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

    resetHighlights();
    
    // Check IDs between teams
    for (let redI = 0; redI < redTeam.length && redI < MAX_PLAYERS; redI++)
    {
        for (let greenI = 0; greenI < greenTeam.length && greenI < MAX_PLAYERS; greenI++)
        {
            if (redTeam[redI].id == greenTeam[greenI].id)
            {
                duplicateIdsBoth = true;
                highlightInputBox(true, true, redI + 1, HIGHLIGHT_COLOR);
                highlightInputBox(false, true, greenI + 1, HIGHLIGHT_COLOR);
                //alert("Both teams have the same user ID. Please change the ID found at: " + (redI+1) + " for the red team or change the ID found at: " + (greenI+1) + " for the green team.")
            }
        }
    }
    // Check names between teams
    for (let redI = 0; redI < redTeam.length && redI < MAX_PLAYERS; redI++)
    {
        for (let greenI = 0; greenI < greenTeam.length && greenI < MAX_PLAYERS; greenI++)
        {
            if (redTeam[redI].name == greenTeam[greenI].name && redTeam[redI].name != "")
            {
                duplicateNamesBoth = true;
                highlightInputBox(true, false, redI + 1, HIGHLIGHT_COLOR);
                highlightInputBox(false, false, greenI + 1, HIGHLIGHT_COLOR);
                //alert("Both teams have the same playername. Please change the name found at: " + (redI+1) + " for the red team or change the name found at: " + (greenI+1) + " for the green team.")
            }
        }
    }
    // Check IDs on red team
    for (let redI = 0; redI < redTeam.length && redI < MAX_PLAYERS; redI++)
    {
        for (let redI2 = 0; redI2 < redTeam.length && redI2 < MAX_PLAYERS; redI2++)
        {
            if(redI != redI2)
            {
                if(redTeam[redI].id == redTeam[redI2].id)
                {
                    duplicateIdsRed = true;
                    highlightInputBox(true, true, redI + 1, HIGHLIGHT_COLOR);
                    highlightInputBox(true, true, redI2 + 1, HIGHLIGHT_COLOR);
                    //alert("The red team seems to be using the same id for two members. Please change the id for either player: " + (redI+1) + " or for player: " + (redI2 +1));
                }
            }
        }
    }

    // Check names on red team
    for (let redI = 0; redI < redTeam.length && redI < MAX_PLAYERS; redI++)
    {
        for (let redI2 = 0; redI2 < redTeam.length && redI2 < MAX_PLAYERS; redI2++)
        {
            if(redI != redI2)
            {
                if(redTeam[redI].name == redTeam[redI2].name && redTeam[redI].name != "")
                {
                    duplicateNamesRed = true;
                    highlightInputBox(true, false, redI + 1, HIGHLIGHT_COLOR);
                    highlightInputBox(true, false, redI2 + 1, HIGHLIGHT_COLOR);
                    //alert("The red team seems to be using the same name for two members. Please change the name for either player: " + (redI+1) + " or for player: " + (redI2 +1));
                }
            }
        }
    }

    // Check IDs on green team 
    for (let greenI = 0; greenI < greenTeam.length && greenI < MAX_PLAYERS; greenI++)
    {
        for (let greenI2 = 0; greenI2 < greenTeam.length && greenI2 < MAX_PLAYERS; greenI2++)
        {
            if(greenI != greenI2)
            {
                if(greenTeam[greenI].id == greenTeam[greenI2].id)
                {
                    duplicateIdsGreen = true;
                    highlightInputBox(false, true, greenI + 1, HIGHLIGHT_COLOR);
                    highlightInputBox(false, true, greenI2 + 1, HIGHLIGHT_COLOR);
                    //alert("The green team seems to be using the same id for two members. Please change the id for either player: " + (greenI+1) + " or for player: " + (greenI2 +1));
                }
            }
        }
    }

    // Check names on green team
    for (let greenI = 0; greenI < greenTeam.length && greenI < MAX_PLAYERS; greenI++)
    {
        for (let greenI2 = 0; greenI2 < greenTeam.length && greenI2 < MAX_PLAYERS; greenI2++)
        {
            if(greenI != greenI2)
            {
                if(greenTeam[greenI].name == greenTeam[greenI2].name && greenTeam[greenI].name != "")
                {
                    duplicateNamesGreen = true;
                    highlightInputBox(false, false, greenI + 1, HIGHLIGHT_COLOR);
                    highlightInputBox(false, false, greenI2 + 1, HIGHLIGHT_COLOR);
                    //alert("The green team seems to be using the same name for two members. Please change the name for either player: " + (greenI+1) + " or for player: " + (greenI2 +1));
                }
            }
        }
    }    

    // Returns true if any duplicate info is found.
    return duplicateIdsBoth || duplicateNamesBoth || duplicateIdsRed || duplicateNamesRed || duplicateIdsGreen || duplicateNamesGreen;
}

// Returns true if any of the userIDs do not yet have a name filled in.
function isMissingNames(redTeam, greenTeam) {
    let missingNames = false;

    // Checks each entry on the red team to make sure all of the entered IDs have a name.
    for (let i = 0; i < redTeam.length && i < MAX_PLAYERS; i++) {
        if ((redTeam[i].id != "" && redTeam[i].id != 0) && (redTeam[i].name == "" || redTeam[i].name == "<Name taken!>")) {
            missingNames = true;
        }
    }
    // Checks each entry on the green team to make sure all of the entered IDs have a name.
    for (let i = 0; i < greenTeam.length && i < MAX_PLAYERS; i++) {
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
        url: CHECK_IDS_URL,
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
            url: POST_PLAYERS_URL,
            dataType: "json",
            timeout: 4000,
            data: {"redTeam": redTeam, "greenTeam": greenTeam}
        });
    }
}

// Take the new player data received from the server and updates the UI to match.
function updateUI(redTeam, greenTeam) {
    for (let i = 0; i < MAX_PLAYERS; i++) {
        if (i < redTeam.length) {
            document.getElementById("redIdNumber" + (i+1)).value = redTeam[i].id;
            document.getElementById("redCodeName" + (i+1)).value = redTeam[i].name;
            // If a player's ID is not in the DB and hasn't entered a name yet, color the name outline red.
            if (redTeam[i].name == "" || redTeam[i].name == "<Name taken!>") {
                highlightInputBox(true, false, i + 1, HIGHLIGHT_COLOR);
            }
        }
        else {
            document.getElementById("redIdNumber" + (i+1)).value = "";
            document.getElementById("redCodeName" + (i+1)).value = "";
        }
    }
    for (let i = 0; i < MAX_PLAYERS; i++) {
        if (i < greenTeam.length) {
            document.getElementById("greenIdNumber" + (i+1)).value = greenTeam[i].id;
            document.getElementById("greenCodeName" + (i+1)).value = greenTeam[i].name;
            // If a player's ID is not in the DB and hasn't entered a name yet, color the name outline red.
            if (greenTeam[i].name == "" || greenTeam[i].name == "<Name taken!>") {
                highlightInputBox(false, false, i + 1, HIGHLIGHT_COLOR);
            }
        }
        else {
            document.getElementById("greenIdNumber" + (i+1)).value = "";
            document.getElementById("greenCodeName" + (i+1)).value = "";
        }
    }
}

// Highlights the user input box for the given player.
//  - isTeamRed parameter is true when the team is red and false when the team is green.
//  - isID parameter is true when you want to highlight the ID box and false when you want to highlight the name box.
//  - color parameter is a string that represents the html color of the box. It can be hex "#FFFFFF", rgb "rgb(255,255,255)", or a color name "white".
function highlightInputBox(isTeamRed, isID, playerNumber, color) {
    if (isTeamRed) {
        if (isID) {
            document.getElementById("redIdNumber" + playerNumber).style.borderColor = color;
        }
        else {
            document.getElementById("redCodeName" + playerNumber).style.borderColor = color;
        }
    }
    else {
        if (isID) {
            document.getElementById("greenIdNumber" + playerNumber).style.borderColor = color;
        }
        else {
            document.getElementById("greenCodeName" + playerNumber).style.borderColor = color;
        }
    }
}

// Resets the border color of all the user input boxes to their default color.
function resetHighlights() {
    for (let i = 1; i <= MAX_PLAYERS; i++) {
        highlightInputBox(true, true, i, DEFAULT_BORDER_COLOR);
        highlightInputBox(true, false, i, DEFAULT_BORDER_COLOR);
        highlightInputBox(false, true, i, DEFAULT_BORDER_COLOR);
        highlightInputBox(false, false, i, DEFAULT_BORDER_COLOR);
    }
}