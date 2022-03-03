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
 express()
 .use(express.static(path.join(__dirname, 'public')))
 .use(bodyParser.urlencoded({extended:false}))
 .set('views', path.join(__dirname, 'views'))
 .set('view engine', 'ejs')
 .get('/', (req, res) => res.render('pages/splash')) 
 .get('/playerEntry', (req, res) => res.render('pages/playerEntry'))
 .post('/playerEntry/submit', async (req, res) => {
    try{ 
      var idValue = req.body.id;
      var codeValue = req.body.code;

      for (let i = 1; i <= 15; i++) {
        if (idValue[i] != 0 && idValue[i] != "" && codeValue[i] != "") {
          var sql = "insert into player (id, first, last, codeName) values("+idValue[i]+", '"+codeValue[i]+"')"
          pool.query(sql, function (err) {
            if (err) throw err
              console.error(err.message);
            // if (!err){
            //   res.send(req.body);
            // } else {
            //   res.send(err.message);
            // }
          })
        }
      }   
    //---------------------------------
      res.render('pages/playerEntry/submit')
    //---------------------------------
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
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