// Initialize Node requirements
const express = require('express');
const bodyParser = require('body-parser');
const res = require('express/lib/response');
const path = require('path')
const { ReadStream } = require('fs');
const { Pool } = require('pg'); 
const { WebSocket } = require('ws');

// Maximum number of players per team
const MAX_PLAYERS = 15;

// Set application port
const PORT = process.env.PORT || 5000

// Connect to database
const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL, // check url: 'heroku config'
    ssl: {
        rejectUnauthorized: false
    }
});

// Global variables
var redTeam = Array();
var greenTeam = Array();
var actions = Array();



// Express http server
const server = express()
.use(express.static(path.join(__dirname, 'public')))
.use(bodyParser.urlencoded({extended:true}))
.use(express.json())
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')

// Views
.get('/', (req, res) => res.render('pages/splash'))
.get('/playerEntry', (req, res) => res.render('pages/playerEntry'))
.get('/startTimer', (req, res) => res.render('pages/startTimer'))
.get('/playerAction', (req, res) => res.render('pages/playerAction'))

// Renders the content of the database to the clients browser.
.get('/db', async (req, res) => {
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
// Sends client the current players on each team
.get('/playerAction/getPlayers', async (req, res) => {
    // Store unique player info into a new array for each team
    let newRedTeam = [];
    let uniqueRed = {};
    for (let i in redTeam){
        let redID = redTeam[i]['idNumber'];
        uniqueRed[redID] = redTeam[i];
    }
    for (i in uniqueRed) {
        newRedTeam.push(uniqueRed[i])
    }
    
    let newGreenTeam = [];
    let uniqueGreen = {};
    for (let i in greenTeam){
        let greenID = greenTeam[i]['idNumber'];
        uniqueGreen[greenID] = greenTeam[i];
    }
    for (i in uniqueGreen) {
        newGreenTeam.push(uniqueGreen[i])
    }

    // Pass arrays with unique player(s) in each team for playerAction display
    res.send({"redTeam": newRedTeam, "greenTeam": newGreenTeam});
})
// Receives query from client to check the database for the listed IDs. Responds with updated list containing names of matches.
.get('/playerEntry/checkIDs', async (req, res) => {
    let redTeam = req.query.redTeam;
    let greenTeam = req.query.greenTeam;
    let searchId;
    let searchName;
    let parseRow;
    let dbResult;

    for (let i = 0; i < redTeam.length; i++) {
        // Query database for the count of an id
        searchId = "SELECT COUNT(*) as total FROM player WHERE id = "+ redTeam[i].id +" " ; 
        pool.query(searchId, function(err, result){
            if (err) {
                res.send("Error " + err.message);
            } 
            else {
                if (!result.length) {
                    // Parse the result (dictionary) to get the specific count value
                    parseRow = result["rows"]
                    dbResult = parseRow[0].total
                    if (dbResult != 0) { 
                        // Pull the code name from the database
                        searchName = "SELECT codename as name FROM player WHERE id = "+ redTeam[i].id +" " ; 
                        pool.query(searchName, function(err, result){
                            if (err) {
                                res.send("Error " + err.message);
                            } 
                            else { // Update the code name to the existing one
                                parseRow = result["rows"]
                                dbResult = parseRow[0].name
                                redTeam[i].name = dbResult
                            }
                        })
                    }
                    else { // New id - make sure it's code name is not duplicated
                        searchName = "SELECT COUNT(*) as total FROM player WHERE codename = '"+ redTeam[i].name +"' " ; 
                        pool.query(searchName, function(err, result){
                            if (err) {
                                res.send("Error " + err.message);
                            } 
                            else {
                                if (!result.length) {
                                    parseRow = result["rows"]
                                    dbResult = parseRow[0].total
                                    // Let users know that the name is taken
                                    if (dbResult != 0) { 
                                        redTeam[i].name = "<Name taken!>"
                                    }
                                }
                            }
                        })
                    }
                }
            }
        })
    }

    for (let i = 0; i < greenTeam.length; i++) {
        // Query database for the count of an id
        searchId = "SELECT COUNT(*) as total FROM player WHERE id = "+ greenTeam[i].id +" " ; 
        pool.query(searchId, function(err, result){
            if (err) {
                res.send("Error " + err.message);
            } 
            else {
                if (!result.length) {
                    // Parse the result (dictionary) to get the specific count value
                    parseRow = result["rows"]
                    dbResult = parseRow[0].total
                    if (dbResult != 0) { 
                        searchName = "SELECT codename as name FROM player WHERE id = "+ greenTeam[i].id +" " ; 
                        pool.query(searchName, function(err, result){
                            if (err) {
                                res.send("Error " + err.message);
                            } 
                            else { // Update the code name to the existing one
                                parseRow = result["rows"]
                                dbResult = parseRow[0].name
                                greenTeam[i].name = dbResult
                            }
                        })
                    }
                }
                else { // New id - make sure it's code name is not duplicated
                    searchName = "SELECT COUNT(*) as total FROM player WHERE codename = '"+ greenTeam[i].name +"' " ; 
                    pool.query(searchName, function(err, result){
                        if (err) {
                            res.send("Error " + err.message);
                        } 
                        else {
                            if (!result.length) {
                                parseRow = result["rows"]
                                dbResult = parseRow[0].total
                                // Let users know that the name is taken
                                if (dbResult != 0) { 
                                    greenTeam[i].name = "<Name taken!>"
                                }
                            }
                        }
                    })
                }
            }
        })
    }
    
    // Waits for arrays to properly update before sending the updated info back since used an 'async' function
    setTimeout(function() {
        // Sends client the updated lists of player data bacak to CheckIDs() in playerEntry.js
        res.send({"redTeam": redTeam, "greenTeam": greenTeam});
    }, 2000)
})
// Sends the client a list of actions created by the traffic generator.
.get('/playerAction/getActions', async (req, res) => {
    res.send({"actions": actions});
    actions = Array();
})
// Receive player data submitted by client.
.post('/playerEntry/submit', async (req, res) => {
    redTeam = Array();
    greenTeam = Array();
    let searchId;
    let parseRow;
    let dbResult;

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
                if (err) {
                    res.send("Error " + err.message);
                } 
                else {
                    if (!result.length) {
                        parseRow = result["rows"]
                        dbResult = parseRow[0].total
                        if (dbResult == 0) { 
                            let sql = "insert into player (id, codeName) values(" + redID + ", '" + redName + "')";
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
                if (err) {
                    res.send("Error " + err.message);
                } 
                else {
                    if (!result.length) {
                        parseRow = result["rows"]
                        dbResult = parseRow[0].total
                        if (dbResult == 0) { 
                            let sql = "insert into player (id, codeName) values(" + greenID + ", '" + greenName + "')";
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
// Binds express server to the designated port and starts listening for incoming traffic.
.listen(PORT, () => console.log(`Listening on ${ PORT }`))



//Websocket game traffic server
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
    console.log('Client websocket connected');
    ws.on('message', (message) => {
        let parsedMessage = parseSocketData(message);
        console.log('Message received from client websocket: ' + parsedMessage);
        actions.push(parsedMessage);
    });
    ws.on('close', () => console.log('Client websocket disconnected'));
});

// Converts websocket raw data into a human-readable string.
function parseSocketData(message) {
    let str = "";
    for (let n = 0; n < message.length; n+=1) {
        str += String.fromCharCode(message[n]);
    }
    return str;
}

// Player class
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