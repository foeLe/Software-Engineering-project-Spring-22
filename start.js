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

// Program starts here as directed by 'package.json'
// Initialize path & port requirements
const express = require('express');
const bodyParser = require('body-parser');
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

// Maximum number of players per team
const MAX_PLAYERS = 15;

// Current team members
var redTeam = Array();
var greenTeam = Array();

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

 express()
 .use(express.static(path.join(__dirname, 'public')))
 .use(bodyParser.urlencoded({extended:true}))
 .use(express.json())
 .set('views', path.join(__dirname, 'views'))
 .set('view engine', 'ejs')


 // Views
 .get('/', (req, res) => res.render('pages/splash')) 
 .get('/playerEntry', (req, res) => res.render('pages/playerEntry'))
 .get('/startTimer', (req, res) => res.render('pages/startTimer'))
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

  // Receive player data submitted by client.
 .post('/playerEntry/submit', async (req, res) => {
  // try{
  //   let idValues = req.body.id;
  //   let codeValues = req.body.code;
  //   for (let i = 0; i < MAX_PLAYERS * 2; i++) {
  //     let id = idValues[i];
  //     let codeName = codeValues[i];

  //     if (id != 0 && id != "" && codeName != "") {
  //        // Submit player to database
  //       var sql = "insert into player (id, codeName) values(" + id + ", '" + codeName + "')";
  //       pool.query(sql, function (err) {
  //         if (!err) {
  //           // Add player to current red team
  //           if (i < MAX_PLAYERS) {
  //             redTeam.push(new Player(id, codeName));
  //           }
  //           // Add player to current green team
  //           else {
  //             greenTeam.push(new Player(id, codeName));
  //           }
  //         }
  //         else {
  //           res.send("Error!");
  //         }
  //       })
  //       }
  //     }

  //     // Waits 2000ms (2 seconds) before proceeding to give the asynchronous pool.query function time to add all players to the array.
  //     setTimeout(function() {
  //       res.render('pages/playerAction')
  //       // res.send("redTeam length: " + readTeam.length);
  //     }, 2000)

  //   } catch (err) {
  //     console.error(err);
  //     res.send("Error " + err);
  //   }

    for (let i = 0; i < MAX_PLAYERS; i++) {
      let redID;
      let redName;
      let greenID;
      let greenName;

      if (i < req.body.redTeam.length) {
        redID = req.body.redTeam[i].id;
        redName =req.body.redTeam[i].name;
      }
      else {
        redID = 0;
        redName = "";
      }
      if (i < req.body.greenTeam.length) {
        greenID = req.body.greenTeam[i].id;
        greenName = req.body.greenTeam[i].name;
      }
      else {
        greenID = 0;
        greenName = "";
      }

      // add red player
      if (redID != 0 && redID != "" && redName != "") {
        // Insert new player into database
        var sql = "insert into player (id, codeName) values(" + redID + ", '" + redName + "')";
        pool.query(sql, function (err) {
          if (!err) {
            // Add player to current red team
            redTeam.push(new Player(redID, redName));
          }
          else {
            res.send("Error!");
          }
        })
      }

      // Add green player
      if (greenID != 0 && greenID != "" && greenName != "") {
        // Insert new player into database
        var sql = "insert into player (id, codeName) values(" + greenID + ", '" + greenName + "')";
        pool.query(sql, function (err) {
          if (!err) {
            // Add player to current green team
            greenTeam.push(new Player(greenID, greenName));
          }
          else {
            res.send("Error!");
          }
        })
      }
    }
    // Wait 2 seconds (2000ms) to give pool.query time to add all players, then redirect to playerAction screen.
    setTimeout(function() {
      //console.log(res);
      try {
      res.render('pages/playerAction');
      }
      catch(e) {
        console.log(e);
      }
    }, 2000)
  })
  .get('/playerAction', (req, res) => res.render('pages/playerAction'))
  .get('/playerEntry/submit', (req, res) => res.render('pages/playerAction'))
  // Sends client the current players on each team
  .get('/players', async (req, res) => {
    res.send({"redTeam": redTeam, "greenTeam": greenTeam});
  })

 .listen(PORT, () => console.log(`Listening on ${ PORT }`))