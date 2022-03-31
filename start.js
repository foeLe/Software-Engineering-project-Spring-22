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
const { ReadStream } = require('fs');
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
    redTeam = Array();
    greenTeam = Array();
    var searchId;
    var parseRow;
    var dbResult;

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
        // Add player to current green team for playerAction display
        redTeam.push(new Player(redID, redName));

        // Only insert new player into the database 
        searchId = "SELECT COUNT(*) as total FROM player WHERE id = "+ redID +" " ; 
        pool.query(searchId, function(err, result){
          if (err)  {
            res.send("Error " + err.message);
          } 
          else {
            if (!result.length)  {
              parseRow = result["rows"]
              dbResult = parseRow[0].total
              if (dbResult == 0) { 
                var sql = "insert into player (id, codeName) values(" + redID + ", '" + redName + "')";
                pool.query(sql, function (err) {
                  if (err) 
                    res.send("Error!");
                })
              }
            }
          }
        })
      }

      // Add green player
      if (greenID != 0 && greenID != "" && greenName != "") {
        // Add player to current green team for playerAction display
        greenTeam.push(new Player(greenID, greenName));

        // Only insert new player into the database 
        searchId = "SELECT COUNT(*) as total FROM player WHERE id = "+ greenID +" " ; 
        pool.query(searchId, function(err, result){
          if (err)  {
            res.send("Error " + err.message);
          } 
          else {
            if (!result.length)  {
              parseRow = result["rows"]
              dbResult = parseRow[0].total
              if (dbResult == 0) { 
                var sql = "insert into player (id, codeName) values(" + greenID + ", '" + greenName + "')";
                pool.query(sql, function (err) {
                  if (err) 
                    res.send("Error!");
                })
              }
            }
          }
        })
      }
    }
  })

  .get('/playerAction', (req, res) => res.render('pages/playerAction'))

  .get('/playerEntry/submit', (req, res) => res.render('pages/playerAction'))

  // Sends client the current players on each team
  .get('/players', async (req, res) => {
    // Delete duplicated player info from arrays 
    console.log("original---------")
    console.log(redTeam)
    console.log("-----------------")
    let newRedTeam = [];
    let uniqueRed = {};
    for (let i in redTeam){
      let redID = redTeam[i]['id'];
      console.log("redID: " + redID);
      uniqueRed[redID] = redTeam[i];
      console.log("uniqueRed[redID]: " + uniqueRed[redID]);
    }
    for (i in uniqueRed) {
      newRedTeam.push(uniqueRed[i])
    }
    console.log("after: ---------")
    console.log(newRedTeam)
    console.log("-----------------")

    greenTeam = greenTeam.filter((value, index, self) => index === self.findIndex((i) => (
      i.id === value.id && i.name === value.name
    )))
    res.send({"redTeam": newRedTeam, "greenTeam": greenTeam});
  })

  .get('/playerEntry/checkIDs', async (req, res) => {
    let redTeam = req.query.redTeam;
    let greenTeam = req.query.greenTeam;
    var searchId;
    var searchName;
    var parseRow;
    var dbResult;

    // -----------------------------------------------------------------------------
    // TO DO:   Query the DB for each id in redTeam and greenTeam.
    //          If the id already exists in the DB, change the name in redTeam or greenTeam arrays.
    //          ex:
    //          if (redTeam[i].id == dbQueryID) then redTeam[i].name == dbQueryName
    // -----------------------------------------------------------------------------
    for (let i = 0; i < redTeam.length; i++) {
      // Queries database for the count of an id's code name
      searchId = "SELECT COUNT(*) as total FROM player WHERE id = "+ redTeam[i].id +" " ; 
      pool.query(searchId, function(err, result){
        if (err)  {
          res.send("Error " + err.message);
        } 
        else {
          if (!result.length)  {
            // Parse the result (dictionary) to get the specific count value
            parseRow = result["rows"]
            dbResult = parseRow[0].total
            if (dbResult != 0) { 
              // Pull the code name from the database
              searchName = "SELECT codename as name FROM player WHERE id = "+ redTeam[i].id +" " ; 
              pool.query(searchName, function(err, result){
                if (err)  {
                  res.send("Error " + err.message);
                } 
                else { // Update code name to the existing one
                  parseRow = result["rows"]
                  dbResult = parseRow[0].name
                  redTeam[i].name = dbResult
                }
              })
            }
          }
        }
      })
    }

    for (let i = 0; i < greenTeam.length; i++) {
      // Queries database for the count of an id's code name
      searchId = "SELECT COUNT(*) as total FROM player WHERE id = "+ greenTeam[i].id +" " ; 
      pool.query(searchId, function(err, result){
        if (err)  {
          res.send("Error " + err.message);
        } 
        else {
          if (!result.length)  {
            // Parse the result (dictionary) to get the specific count value
            parseRow = result["rows"]
            dbResult = parseRow[0].total
            if (dbResult != 0) { 
              // Pull the code name from the database
              searchName = "SELECT codename as name FROM player WHERE id = "+ greenTeam[i].id +" " ; 
              pool.query(searchName, function(err, result){
                if (err)  {
                  res.send("Error " + err.message);
                } 
                else { // Update code name to the existing one
                  parseRow = result["rows"]
                  dbResult = parseRow[0].name
                  greenTeam[i].name = dbResult
                }
              })
            }
          }
        }
      })
    }
    
    // Waits for arrays to properly update before sending the updated info back since used an 'async' function
    setTimeout(function() {
      // Sends client the updated lists of player data
      res.send({"redTeam": redTeam, "greenTeam": greenTeam});
    }, 2000)
  })
 .listen(PORT, () => console.log(`Listening on ${ PORT }`))