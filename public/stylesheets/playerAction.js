//Time in milliseconds to start the timer with (5 minutes = 300,000 ms)
const TIMER_MS = 65000;

function timerStart() {
	var currentTime = new Date().getTime();
	var endingTime = new Date(currentTime + TIMER_MS).getTime();

	var timeLeft = endingTime - currentTime;

	var timerMin = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
	var timerSec = Math.floor((timeLeft % (1000 * 60)) / 1000);

	if(timerSec < 10)
		document.getElementById("timer").innerHTML = timerMin + ":0" + timerSec;
	else
		document.getElementById("timer").innerHTML = timerMin + ":" + timerSec;

	var timerInterval = setInterval(function() {
		timeLeft -= 1000;
		if(timeLeft < 0) {
			clearInterval(timerInterval);
			document.getElementById("timer").innerHTML = "Time's up!";
		}
		
		else {
			var timerMin = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
			var timerSec = Math.floor((timeLeft % (1000 * 60)) / 1000);
			
			if(timerSec < 10)
				document.getElementById("timer").innerHTML = timerMin + ":0" + timerSec;
			else
				document.getElementById("timer").innerHTML = timerMin + ":" + timerSec;
		}
	}, 1000);
}