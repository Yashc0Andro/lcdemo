var express = require('express');
var app = express();


//set pprt
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + "/base"));

var cors = require('cors');


app.options('*', cors()); // include before other routes 
app.use(cors());


//routes

app.get('/', function (req, res) {
    res.render("/base/index");
});


app.listen(port, function () {

    console.log("listening");
});


app.get('/getusers', (req, res) => {

    var fs = require('fs');

    let rawdata = fs.readFileSync('users.json');
    let data = JSON.parse(rawdata);
    res.setHeader('Content-Type', 'application/json');
    res.send(data);

});

app.get('/getemergencies', (req, res) => {

    var fs = require('fs');

    let rawdata = fs.readFileSync('emergency.json');
    let data = JSON.parse(rawdata);
    res.setHeader('Content-Type', 'application/json');
    res.send(data);

});


app.get('/addemergency', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    // res.send(newUser);
    res.send('Ok');
});

app.get('/addOrUpdateUser', (req, res) => {

    var fs = require('fs');
    const file = 'users.json';

    let rawdata = fs.readFileSync(file);
    let usersData = JSON.parse(rawdata);

    let userObj = {
        caseId: req.query['caseId'],
        userName: req.query['userName'],
        name: req.query['name'],
        personalNumber: req.query['number'],
        emergencyNumber: req.query['emergencynum'],
        Address: req.query['address'],
    };

    if (usersData.length) {
        let userFound = false;
        usersData.array.forEach(element => {
            if (element.caseId === newUser.caseId) {
                element = userObj;
                userFound = true;
                return false;
            }
        });

        if (!userFound) {
            usersData.push(newUser);
        }
    }

    var saveUserData = JSON.stringify(usersData, null, 2);
    fs.writeFile(file, saveUserData, err => {
        if (err) console.error(err);
        else console.log('done');
    });

    res.setHeader('Content-Type', 'application/json');
    // res.send(newUser);
    res.send('Ok');

});

app.get('/deleteUser', (req, res) => {

    var fs = require('fs');
    const file = 'users.json';

    let rawdata = fs.readFileSync(file);
    let usersData = JSON.parse(rawdata);

    if (usersData.length) {
        usersData.array.forEach(element ,index => {
            if (element.caseId === newUser.caseId) {
                usersData.splice(index, 1);
                return false;
            }
        });      
    }

    var saveUserData = JSON.stringify(usersData, null, 2);
    fs.writeFile(file, saveUserData, err => {
        if (err) console.error(err);
        else console.log('done');
    });

    res.setHeader('Content-Type', 'application/json');
    res.send('Ok');
});

