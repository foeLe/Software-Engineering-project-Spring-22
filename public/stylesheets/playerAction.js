// Time in milliseconds to start with (60,000 ms/minute).
const TIMER_MS = 360000;

// Score awarded to a player for hitting another player.
const HIT_SCORE = 100;

// Time in milliseconds between getAction requests.
const GET_ACTION_INTERVAL = 5000;

// Rate in milliseconds at which the highest team score blinks
const SCORE_BLINK_INTERVAL = 750;

// URLs
const GET_ACTIONS_URL = '/playerAction/getActions';
const GET_PLAYERS_URL = '/playerAction/getPlayers';

// Player class
class Player {
    constructor(idNumber, codeName) {
        this.idNumber = idNumber;
        this.codeName = codeName;
		this.score = 0;
    }
    getID() {
        return this.idNumber;
    }
    getName() {
        return this.codeName;
    }
	getScore() {
		return this.score;
	}
	addScore(ammount) {
		this.score += ammount;
	}
}

var redTeam = Array();
var greenTeam = Array();
var redScore = 0;
var greenScore = 0;
var timeLeft = TIMER_MS;

// Retrieves current players from the server and fills in their info on the playerAction screen
$(document).ready(function() {
	$.get(GET_PLAYERS_URL, {}, function(data){
		for (let i = 0; i < data.redTeam.length && i < 15; i++) {
			redTeam.push(new Player(data.redTeam[i].idNumber, data.redTeam[i].codeName));
			document.getElementById("redPlayer" + (i + 1)).innerHTML = data.redTeam[i].codeName;
			document.getElementById("redPlayer" + (i + 1) + "Score").innerHTML = "0";
		}
		for (let i = 0; i < data.greenTeam.length && i < 15; i++) {
			greenTeam.push(new Player(data.greenTeam[i].idNumber, data.greenTeam[i].codeName));
			document.getElementById("greenPlayer" + (i + 1)).innerHTML = data.greenTeam[i].codeName;
			document.getElementById("greenPlayer" + (i + 1) + "Score").innerHTML = "0";
		}
	});
});

function timerStart() {
    //Set timer length to the specified value in MS
	timeLeft = TIMER_MS;

	//Calculate the number of minutes and seconds left on the clock
	let timerMin = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
	let timerSec = Math.floor((timeLeft % (1000 * 60)) / 1000);

	if(timerSec < 10)
		document.getElementById("timer").innerHTML = "Time remaining: " + timerMin + ":0" + timerSec;
	else
		document.getElementById("timer").innerHTML = "Time remaining: " + timerMin + ":" + timerSec;

	//Ticks the timer every 1000 ms/1 sec
	let timerInterval = setInterval(function() {
		timeLeft -= 1000;
		
		//TO-DO: IMPLEMENT CODE TO END GAME WHEN TIMER REACHES 0, ADDITIONAL WARNING CODE AT KEY TIMES IF NEEDED
		switch(timeLeft) {
		    case -1000:
		        clearInterval(timerInterval);
			    document.getElementById("timer").innerHTML = "Time's up!";
			    break;
		    case TIMER_MS/2:
		        document.getElementById("timer").innerHTML = "Half way reached!";
		        break;
            case 120000:
                document.getElementById("timer").innerHTML = "Two minutes remaining!";
		        break;
            case 60000:
                document.getElementById("timer").innerHTML = "One minute remaining!";
		        break;
            case 30000:
                document.getElementById("timer").innerHTML = "Thirty seconds remaining!";
		        break;
			case 10000:
                document.getElementById("timer").innerHTML = "Ten seconds remaining!";
		        break;
            default:
                let timerMin = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
			    let timerSec = Math.floor((timeLeft % (1000 * 60)) / 1000);
			    
			    if(timerSec < 10)
				    document.getElementById("timer").innerHTML = "Time remaining: " + timerMin + ":0" + timerSec;
				else
				    document.getElementById("timer").innerHTML = "Time remaining: " + timerMin + ":" + timerSec;
				break;
		}
	}, 1000);
}

// Gets updated player actions from the server every 
setInterval(function() {
	if (timeLeft > 0) {
		$.get(GET_ACTIONS_URL, {}, function(data){
			if (timeLeft <= TIMER_MS - (GET_ACTION_INTERVAL * 1.2)) { // Makes sure that the data from the first request is ignored. This allows any extra data leftover from last game to be erased.
				let actions = data.actions;
				for (let i = 0; i < actions.length; i++) {
					let attacker = actions[i].substring(0, actions[i].indexOf(':'));
					let hitPlayer = actions[i].substring(actions[i].indexOf(':') + 1, actions[i].length);
					for(let j = 0; j < redTeam.length; j++) {
						// Red team hit
						if (attacker == redTeam[j].getID()) {
							redTeam[j].addScore(HIT_SCORE);
							let li = document.createElement("li");
							let list = document.getElementById("redActionList");
							for (let k = 0; k < greenTeam.length; k++) {
								if (hitPlayer == greenTeam[k].getID()) {
									li.appendChild(document.createTextNode(redTeam[j].getName() + " hit " + greenTeam[k].getName()));
								}
							}
							list.appendChild(li);
						}
					}
					for (let j = 0; j < greenTeam.length; j++) {
						// Green team hit
						if (attacker == greenTeam[j].getID()) {
							greenTeam[j].addScore(HIT_SCORE);
							let li = document.createElement("li");
							let list = document.getElementById("greenActionList");
							for (let k = 0; k < redTeam.length; k++) {
								if (hitPlayer == redTeam[k].getID()) {
									li.appendChild(document.createTextNode(greenTeam[j].getName() + " hit " + redTeam[k].getName()));
								}
							}
							list.appendChild(li);
						}
					}
				}

				// Update score UI
				redScore = 0;
				for (let i = 0; i < redTeam.length; i++) {
					redScore += redTeam[i].getScore();
					document.getElementById("redPlayer" + (i + 1) + "Score").innerHTML = redTeam[i].getScore();
				}
				document.getElementById("redScoreTotal").innerHTML = redScore;
				
				greenScore = 0;
				for (let i = 0; i < greenTeam.length; i++) {
					greenScore += greenTeam[i].getScore();
					document.getElementById("greenPlayer" + (i + 1) + "Score").innerHTML = greenTeam[i].getScore();
				}
				document.getElementById("greenScoreTotal").innerHTML = greenScore;
			}
		});
	}
}, GET_ACTION_INTERVAL);

// Makes the team score that is the highest blink.
setInterval(function() {
	let rs = document.getElementById("redScoreTotal");
	let gs = document.getElementById("greenScoreTotal");
	redScore = parseInt(rs.innerHTML);
	greenScore = parseInt(gs.innerHTML);
	
	if(redScore > greenScore)
	{
		rs.hidden = !rs.hidden;
		gs.hidden = false;
	}
	
	else if(greenScore > redScore)
	{
		gs.hidden = !gs.hidden;
		rs.hidden = false;
	}
	
	else {
		rs.hidden = false;
		gs.hidden = false;
	}
}, SCORE_BLINK_INTERVAL);