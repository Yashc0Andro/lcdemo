'use strict';

const express = require('express');

const bodyParser = require('body-parser');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

var cors = require('cors');


app.options('*', cors()); // include before other routes 
app.use(cors());

// define a simple route
app.get('/', (req, res) => {
    res.json({ "message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes." });
});


app.get('/getusers', (req, res) => {

    var fs = require('fs');
    //console.log("\n *START* \n");
    let rawdata = fs.readFileSync('users.json');
    let data = JSON.parse(rawdata);
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
    //console.log(data);
    //res.json(C:\Users\yn185013\Desktop\lifeConnectSite\Theme1\hospice\hospice\nodeservice\users.json);
});


app.get('/addEmergency', (req, res) => {
    var query = req.query;
    var casId = query['caseId'];
    var lati = query['lat'];
    var logi = query['log'];
    var stat = query['stat'];


    //get the case Id details from data base
    var fs = require('fs');
    let rawdata = fs.readFileSync('users.json');
    let data = JSON.parse(rawdata);
    var lodash = require('lodash');
    //var reqCase = lodash.filter(data, x => x.caseId === caseId);
    //console.log(reqCase);
    var reqcase = lodash.filter(data, function (e) { return e.caseId === casId; });
    
    if (isEmpty(reqcase)) {
        var a = 10;
        console.log("entered to if");
    }
    else {
        var string = JSON.stringify(reqcase);
        var objectValue = JSON.parse(string);
        //console.log(objectValue);
        var name = objectValue[0]['name'];
        var num = objectValue[0]['personalNumber'];
        var emrnum = objectValue[0]['emergencyNumber'];
        var address = objectValue[0]['address'];

        //add the req case to emergency
        let emrcase = {
            caseId: casId,
            name: name,
            personalNumber: num,
            emergencyNumber: emrnum,
            Address: address,
            Location: lati + "," + logi,
            Status: stat

        };

        const file = 'emergency.json';
        //const newData = { some: 'data' }
        fs.readFile(file, (err, oldData) => {
            if (err) console.error("error", err);

            var maindata = JSON.parse(oldData);
            maindata.push(emrcase);
            var daaataa = JSON.stringify(maindata, null, 2);
            fs.writeFile(file, daaataa, err => {
                if (err) console.error(err);
                else console.log('done');
            });
        });

    }

    res.setHeader('Content-Type', 'application/json');
    res.send("Done");
});

app.get('/getEmergency', (req, res) => {
    var fs = require('fs');
    //console.log("\n *START* \n");
    let rawdata = fs.readFileSync('emergency.json');
    let data = JSON.parse(rawdata);
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
});

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function isEmerCaseExists(obj)
{

    }

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});