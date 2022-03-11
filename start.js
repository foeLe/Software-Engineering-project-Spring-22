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
}

 express()
 .use(express.static(path.join(__dirname, 'public')))
 .use(bodyParser.urlencoded({extended:false}))
 .set('views', path.join(__dirname, 'views'))
 .set('view engine', 'ejs')
 .get('/', (req, res) => res.render('pages/splash')) 
 .get('/playerEntry', (req, res) => res.render('pages/playerEntry'))
 .post('/playerEntry/submit', async (req, res) => {
  try{ 
    let idValues = req.body.id;
    let codeValues = req.body.code;
    for (let i = 0; i < MAX_PLAYERS * 2; i++) {
      let id = idValues[i];
      let codeName = codeValues[i];

      if (id != 0 && id != "" && codeName != "") {
         // Submit player to database
        var sql = "insert into player (id, codeName) values(" + id + ", '" + codeName + "')";
        pool.query(sql, function (err) {
          if (!err) {
            // Add player to current red team
            if (i < MAX_PLAYERS) {
              redTeam.push(new Player(id, codeName));
            }
            // Add player to current green team
            else {
              greenTeam.push(new Player(id, codeName));
            }
          }
          else {
            res.send("Error!");
          }
        })
        }
      }     
      res.render('pages/playerAction')
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
 .get('/playerAction', (req, res) => res.render('pages/playerAction'))
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