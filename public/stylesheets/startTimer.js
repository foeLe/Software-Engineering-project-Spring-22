//Purpose: underlying script for transition timer.
//Created by: Evan Foley

//Time in milliseconds
const TIMER_MS = 5000;

function countdown() {
    //Set timer length to the specified value in MS
	var timeLeft = TIMER_MS;
	
	//Calculate the number of minutes and seconds left on the clock
	var timerSec = Math.floor((timeLeft % (1000 * 60)) / 1000);
	document.getElementById("startTimer").innerHTML = timerSec + "!";

	//Ticks the timer every 1000 ms/1 sec
	var timerInterval = setInterval(function() {
		timeLeft -= 1000;
		switch(timeLeft) {
			case -1000:
		        	clearInterval(timerInterval);
				document.getElementById("startTimer").innerHTML = "BEGIN!";
			break;
        	   default:
				var timerSec = Math.floor((timeLeft % (1000 * 60)) / 1000);
				document.getElementById("startTimer").innerHTML = timerSec + "!";
				break;
		}
	}, 1000);
}
