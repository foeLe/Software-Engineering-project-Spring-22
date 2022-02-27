// Program starts here as directed by 'package.json'
// Initialize path & port requirements
const express = require('express');
const res = require('express/lib/response');
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg'); 
const pool = new Pool({ // connects to our database (re-run 'npm install' since made a change to 'package.json')
  connectionString: process.env.DATABASE_URL, // check url: 'heroku config'; should be set 
  ssl: {
    rejectUnauthorized: false
  }
});

/**
 * To direct from a page to another page, we need a line that builds a route first 
 * before using regular html/ejs redirecting codes under '.ejs' files.
 * EX:
 *    1) A line that builds a route for 'playerEntry':
 *      - '.get('/playerEntry', (req, res) => res.render('pages/playerEntry'))'
 * 
 *       ** this line of code would make the playerEntry web be named: 
 *          "https://team-11-app.herokuapp.com/playerEntry"
 *       ** similar, since we did not specify a specific name for the splash screen as  
 *          the program starts, the initial app web would be (for 3 seconds):
 *          "https://team-11-app.herokuapp.com"
 *          
 * 
 *    2) Under 'splash.ejs,' add in the line that redirects to 'player.ejs.'
 *       Since we are redirecting automatically after 3 seconds, we use: 
 *      - '<meta http-equiv = "refresh" content = "3; url = https://team-11-app.herokuapp.com/playerEntry" />'     
 */
//function that adds a new player into the database

let insertUser = async (id, codename) => {
  try{
    pool.connect();
    pool.query('INSERT into player(id, codename) VALUES($1, $2) RETURNING id',
                        [id, codename]);
    pool.end;
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

const f = function(){    //test function to see if export works
  console.log("This is function f inside start.js");
}

// try{ //checks to see if insertUser function was working
//   insertUser(5, 'Penguin');
// } catch (err) {
//   console.error(err);
// }

 express()
 .use(express.static(path.join(__dirname, 'public')))
 .set('views', path.join(__dirname, 'views'))
 .set('view engine', 'ejs')
 .get('/', (req, res) => res.render('pages/splash')) 
 .get('/playerEntry', (req, res) => {
     //try{ //checked to see if insertUser function was working
     //  insertUser(3, 'Bull');
        res.render('pages/playerEntry')
     //} catch (err) {
     //  console.error(err);
     //}
  })
 .get('/db', async (req, res) => { //as of now, we need to manually change the web name to '.../db' to see database contents
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM player');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
 .listen(PORT, () => console.log(`Listening on ${ PORT }`))
 
module.exports = f;

 //const x = require("./test");         //testing simple import

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
    //x();
    //startjs.insertUser(player.idNumber, player.codeName);
    //startjs.print();
    // startjs.(player.idNumber, player.codeName).then((result) => {
    //     if(result){
    //         console.log('player added')
    //     }
    // })
}

function hi(){
    console.log("howdy");
}