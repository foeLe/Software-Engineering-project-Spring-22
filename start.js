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
      var idValue1 = req.body.redIdNumber1;
      var codeNamePlayer1 = req.body.redCodeName1;
      if(idValue1 != 0 && idValue1 !="" && codeNamePlayer1 !=""){
      var sql = "insert into player (id, codeName) values("+idValue1+",'"+codeNamePlayer1+"')"
      pool.query(sql, function (err) {
        if (!err){
          res.send('success');
        } else {
          res.send(err.message);
        }
      })
      }
    
    
    var idValue2 = req.body.redIdNumber2;
    var codeNamePlayer2 = req.body.redCodeName2;
    if(idValue2 != 0 && idValue2 !="" || codeNamePlayer2 !=""){
    var sql = "insert into player (id, codeName) values("+idValue2+",'"+codeNamePlayer2+"')"
    pool.query(sql, function (err) {
      if (!err){
        res.send('success');
      } else {
        res.send(err.message);
      }
    })
    }

    
    // var idValue3 = req.body.redIdNumber3;
    // var codeNamePlayer3 = req.body.redCodeName3;
    // if(idValue3 != 0 && idValue3 !="" || codeNamePlayer3 !=""){
    // var sql = "insert into player (id, codeName) values("+idValue3+",'"+codeNamePlayer3+"')"
    // pool.query(sql, function (err) {
    //   if (!err){
    //     res.send('success');
    //   } else {
    //     res.send(err.message);
    //   }
    //   })
    // }

    // var idValue4 = req.body.redIdNumber4;
    // var codeNamePlayer4 = req.body.redCodeName4;
    // if(idValue4 != 0 && idValue4 !="" || codeNamePlayer4 !=""){
    // var sql = "insert into player (id, codeName) values("+idValue4+",'"+codeNamePlayer4+"')"
    // pool.query(sql, function (err) {
    //   if (!err){
    //     res.send('success');
    //   } else {
    //     res.send(err.message);
    //   }
    //   })
    // }

    // start - green team
    var idValue16 = req.body.greenIdNumber1;
    var codeNamePlayer16 = req.body.greenCodeName1;
    if(idValue16 != 0 && idValue16 !="" && codeNamePlayer16 !=""){
    var sql = "insert into player (id, codeName) values("+idValue16+",'"+codeNamePlayer16+"')"
    pool.query(sql, function (err) {
      if (!err){
        res.send('success');
      } else {
        res.send(err.message);
      }
    })
    }

    // var idValue17 = req.body.greenIdNumber2;
    // var codeNamePlayer17 = req.body.greenCodeName2;
    // if(idValue17 != 0 && idValue17 !="" || codeNamePlayer17 !=""){
    // var sql = "insert into player (id, codeName) values("+idValue17+",'"+codeNamePlayer17+"')"
    // pool.query(sql, function (err) {
    //   if (!err){
    //     res.send('success');
    //   } else {
    //     res.send(err.message);
    //   }
    // })
    // }

    // var idValue18 = req.body.greenIdNumber3;
    // var codeNamePlayer18 = req.body.greenCodeName3;
    // if(idValue18 != 0 && idValue18 !="" || codeNamePlayer18 !=""){
    // var sql = "insert into player (id, codeName) values("+idValue18+",'"+codeNamePlayer18+"')"
    // pool.query(sql, function (err) {
    //   if (!err){
    //     res.send('success');
    //   } else {
    //     res.send(err.message);
    //   }
    // })
    // }

    // var idValue19 = req.body.greenIdNumber4;
    // var codeNamePlayer19 = req.body.greenCodeName4;
    // if(idValue19 != 0 && idValue19 !="" || codeNamePlayer19 !=""){
    // var sql = "insert into player (id, codeName) values("+idValue19+",'"+codeNamePlayer19+"')"
    // pool.query(sql, function (err) {
    //   if (!err){
    //     res.send('success');
    //   } else {
    //     res.send(err.message);
    //   }
    // })
    // }
    //---------------------------------
      //res.render('pages/playerEntry')
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
