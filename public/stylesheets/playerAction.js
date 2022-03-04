//Time in milliseconds to start with (60,000 ms/minute)
const TIMER_MS = 65000;

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