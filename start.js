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

        if (id != 0 && id != "")  {
          // Search for existing id
            let searchId = "SELECT COUNT(*) as total FROM player WHERE id = "+ id +" " ; 
            pool.query(searchId, function(err, result){
            if (err)  {
              res.send("Error " + err.message);
            } 
            else {
              if (!result.length)  {
                // Get row count with matching id
                var row = result["rows"]
                var result = row[0].total
                
                // Submit new user to database
                if (result == "0" && codeName != "") {
                  var sql = "insert into player (id, codeName) values(" + id + ", '" + codeName + "')";
                  pool.query(sql, function (err) {
                    if (!err) {
                      res.send("success");
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
                else {
                  // TO DO: autofill existing code names
                  // Get the code name of the existing id
                  var row = result["rows"]
                  var result = row[0].name
                  res.send("autofill: " + result);
                }
              } 
              else {
                res.send("Error " + err.message);
              }
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
  .get('/playerAction', (req, res) => {
    try{
      // redTeam.forEach(function(entry) {   // does not print ('console.log' does not work)
      //   res.send(entry);
      // });

      // res.render('pages/playerAction', redTeam, greenTeam);  // application error or just don't do anything
      
      // res.render('pages/playerAction', {redTeam:redTeam}; // errors
      res.render('pages/playerAction');
    } catch (err){
      res.send("Error " + err.message);
    }
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