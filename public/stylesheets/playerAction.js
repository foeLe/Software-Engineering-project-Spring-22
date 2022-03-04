//Time in milliseconds to start the timer with (5 minutes = 300,000 ms)
const TIMER_MS = 65000;


//On startup, begin a timer of length TIMER_MS
var currentTime = new Date().getTime();
var endingTime = new Date(currentTime + TIMER_MS).getTime();

var timeLeft = endingTime - currentTime;

var timerMin = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
var timerSec = Math.floor((timeLeft % (1000 * 60)) / 1000);

document.getElementById("timer").innerHTML = timerMin + ":" + timerSec;

var timerInterval = setInterval(timerTick, 1000);
	

function timerTick() {
	if(timeLeft < 0) {
		clearInterval(timerInterval);
		document.getElementById("timer").innerHTML = "Times up!");
	}
	
	else {
		var timerMin = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
		var timerSec = Math.floor((timeLeft % (1000 * 60)) / 1000);
		
		document.getElementById("timer").innerHTML = timerMin + ":" + timerSec;
	}
}


function submitPlayer(player) {

    // To do: submit player info to database.
    console.log("submitPlayer function here")
    console.log(player.idNumber + " " + player.codeName)
    
    // insertUser(player.idNumber, player.codeName).then((result) => {
    //     if(result){
    //         console.log('player added')
    //     }
    // })
}