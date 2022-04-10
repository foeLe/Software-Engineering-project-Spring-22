//Time in milliseconds to start with (60,000 ms/minute)
const TIMER_MS = 360000;

// Retrieves current players from the server and fills in their info on the playerAction screen
$(document).ready(function() {
	$.get('/players', {}, function(data){
		for (let i = 0; i < data.redTeam.length && i < 15; i++) {
			document.getElementById("redPlayer" + (i + 1)).innerHTML = data.redTeam[i].codeName;
			document.getElementById("redPlayer" + (i + 1) + "Score").innerHTML = "0";
		}
		for (let i = 0; i < data.greenTeam.length && i < 15; i++) {
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

let socket = new WebSocket("wss://team-11-app.herokuapp.com/playerAction");

socket.onopen = function(e) {
  alert("[open] Connection established");
  alert("Sending to server");
  socket.send("My name is John");
};

socket.onmessage = function(event) {
  alert(`[message] Data received from server: ${event.data}`);
};

socket.onclose = function(event) {
  if (event.wasClean) {
    alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    alert('[close] Connection died');
  }
};

socket.onerror = function(error) {
  alert(`[error] ${error.message}`);
};