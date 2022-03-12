<!--Purpose: underlying script for transition timer.-->
<!--Created by: Evan Foley-->
//Time in milliseconds
const TIMER_MS = 5000;

function countdown() {
    //Set timer length to the specified value in MS
	var timeLeft = TIMER_MS;

	//Calculate the number of minutes and seconds left on the clock
	var timerSec = Math.floor((timeLeft % (1000 * 60)) / 1000);

		document.getElementById("timer").innerHTML = timerSec + "!";

	//Ticks the timer every 1000 ms/1 sec
	var timerInterval = setInterval(function() {
		timeLeft -= 1000;
		
		//TO-DO: IMPLEMENT CODE TO END GAME WHEN TIMER REACHES 0, ADDITIONAL WARNING CODE AT KEY TIMES IF NEEDED
		switch(timeLeft) {
		    case -1000:
		        clearInterval(timerInterval);
			    document.getElementById("timer").innerHTML = "BEGIN!";
			    break;
        default:
			    var timerSec = Math.floor((timeLeft % (1000 * 60)) / 1000);
				  document.getElementById("timer").innerHTML = timerSec + "!";
				break;
		}
	}, 1000);
}
