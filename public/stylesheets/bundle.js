(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const x = require("./test");         //testing simple import

// Maximum number of players on each team.
const MAX_PLAYERS = 15;

class Player {
    constructor(idNumber, codeName) {
        this.idNumber = idNumber;
        this.codeName = codeName;
    }
}

function onSubmit() {
    // Gets the idNumber and codeName for each red player and submits it to the database.
    for (let i = 1; i <= MAX_PLAYERS; i++) {
        let idNumber = document.getElementById("redIdNumber" + i).value;
        let codeName = document.getElementById("redCodeName" + i).value;

		// Check to make sure the player info is not blank before submitting player
		if (idNumber != 0 && idNumber != "" && codeName != "") {
			let player = new Player(idNumber, codeName);
			
			// Submit player to database
			submitPlayer(player);
		}
    }

    // Gets the idNumber and codeName for each green player and submits it to the database.
    for (let i = 1; i <= MAX_PLAYERS; i++) {
        let idNumber = document.getElementById("greenIdNumber" + i).value;
        let codeName = document.getElementById("greenCodeName" + i).value;

		// Check to make sure the player info is not blank before submitting player
		if (idNumber != 0 && idNumber != "" && codeName != "") {
			let player = new Player(idNumber, codeName);
			
			// Submit player to database
			submitPlayer(player);
		}
    }
}

function submitPlayer(player) {

    // To do: submit player info to database.
    console.log("submitPlayer function here")
    console.log(player.idNumber + " " + player.codeName)
    x();
    //startjs.insertUser(player.idNumber, player.codeName);
    //startjs.print();
    // startjs.(player.idNumber, player.codeName).then((result) => {
    //     if(result){
    //         console.log('player added')
    //     }
    // })
}
},{"./test":2}],2:[function(require,module,exports){
const x = function(){    //test function to see if export works
    console.log("This is function x inside test.js");
  }

  module.exports = x;
},{}]},{},[1]);
