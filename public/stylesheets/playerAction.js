//Time in milliseconds to start the timer with (5 minutes = 300,000 ms)
const TIMER_MS = 65000;

function timerStart() {
	//Get the current time and set the ending time at TIMER_MS ahead of then
	var startTime = new Date().getTime();
	var endTime = new Date(startTime + TIMER_MS).getTime();
	
	//Calculate the length of the timer
	var timeLeft = endTime - startTime;

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
		
		switch(timeLeft) {
		    case -1000:
		        clearInterval(timerInterval);
			    document.getElementById("timer").innerHTML = "Time's up!";
			    break;
		    case (endTime - startTime) / 2:
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