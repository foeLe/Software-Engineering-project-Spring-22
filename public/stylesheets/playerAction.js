//Time in milliseconds to start with (60,000 ms/minute)
const TIMER_MS = 360000;

const HIT_SCORE = 100;

// Player class
class Player {
    constructor(idNumber, codeName) {
        this.idNumber = idNumber;
        this.codeName = codeName;
    }
    getID() {
        return this.idNumber;
    }
    getName() {
        return this.codeName;
    }
}

var redTeam = Array();
var greenTeam = Array();
var redScore = 0;
var greenScore = 0;

// Retrieves current players from the server and fills in their info on the playerAction screen
$(document).ready(function() {
	$.get('/players', {}, function(data){
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
	var timeLeft = TIMER_MS;

	//Calculate the number of minutes and seconds left on the clock
	var timerMin = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
	var timerSec = Math.floor((timeLeft % (1000 * 60)) / 1000);

	if(timerSec < 10)
		document.getElementById("timer").innerHTML = "Time remaining: " + timerMin + ":0" + timerSec;
	else
		document.getElementById("timer").innerHTML = "Time remaining: " + timerMin + ":" + timerSec;

	//Ticks the timer every 1000 ms/1 sec
	var timerInterval = setInterval(function() {
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
                var timerMin = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
			    var timerSec = Math.floor((timeLeft % (1000 * 60)) / 1000);
			    
			    if(timerSec < 10)
				    document.getElementById("timer").innerHTML = "Time remaining: " + timerMin + ":0" + timerSec;
				else
				    document.getElementById("timer").innerHTML = "Time remaining: " + timerMin + ":" + timerSec;
				break;
		}
	}, 1000);
}

setInterval(function() {
	$.get('/playerAction/getActions', {}, function(data){
		let actions = data.actions;
		for (let i = 0; i < actions.length; i++) {
			let attacker = actions[i].substring(0, actions[i].indexOf(':'));
			let hitPlayer = actions[i].substring(actions[i].indexOf(':') + 1, actions[i].length);
			for(let j = 0; j < redTeam.length; j++) {
				// Red team hit
				if (attacker == redTeam[j].getID()) {
					redScore += HIT_SCORE;
					let li = document.createElement("li");
					let list = document.getElementById("redActionList");
					li.appendChild(document.createTextNode(attacker + " hit " + hitPlayer));
					list.appendChild(li);
				}
			}
			for (let j = 0; j < greenTeam.length; j++) {
				// Green team hit
				if (attacker == greenTeam[j].getID()) {
					greenScore += HIT_SCORE;
					let li = document.createElement("li");
					let list = document.getElementById("greenActionList");
					li.appendChild(document.createTextNode(attacker + " hit " + hitPlayer));
					list.appendChild(li);
				}
			}
		}
	});
}, 5000);