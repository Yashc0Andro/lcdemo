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

     console.log(casId);
    //get the case Id details from data base
    var fs = require('fs');
    let rawdata = fs.readFileSync('users.json');
    let data = JSON.parse(rawdata);
	console.log(data);
    var lodash = require('lodash');
    //var where = require('lodash.where');
    console.log(data,casId);
    var reqcase = [];
    lodash.each(data, function (e) { if(e.caseId === parseInt(casId)) reqcase.push(e); });
//	var reqcase2 = where(data, {caseId: casId});
    console.log(reqcase);
	//console.log(reqcase2);
	
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
			
			//check if already exists in emergency json
			 var reqmrcase = lodash.filter(maindata, function (e) { return e.caseId === casId; });
    
			If(isEmpty(reqcase))
			{
				maindata.push(emrcase);
				var daaataa = JSON.stringify(maindata, null, 2);
				fs.writeFile(file, daaataa, err => {
					if (err) console.error(err);
					else console.log('done');
				});
			}
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


app.get('/deleteEmergency', (req,res) =>
{
	 var query = req.query;
    var casId = query['caseId'];
	console.log(casId);
	
	
	var fs = require('fs');
    let rawdata = fs.readFileSync('emergency.json');
    let data = JSON.parse(rawdata);

    var lodash = require('lodash');
    var reqcase = lodash.filter(data, function (e) { return e.caseId !== casId; });
	//console.log(reqcase);
	
	var daaataa = JSON.stringify(reqcase, null, 2);
	const file = 'emergency.json';
	fs.writeFile(file, daaataa, err => {
                if (err) console.error(err);
                else console.log('done');
            });
			
			
	res.setHeader('Content-Type', 'application/json');
    res.send('Done');
});

app.get('/updateEmergency', (req,res) =>
{
	var query = req.query;
    var casId = query['caseId'];
	console.log(casId);
	var stat = query['stat'];
	
	const file = 'emergency.json';
	var fs = require('fs');
    let rawdata = fs.readFileSync(file);
    let data = JSON.parse(rawdata);
	
	
    var lodash = require('lodash');
    var reqcase = lodash.filter(data, function (e) { return e.caseId === casId; });
	reqcase["Status"] = stat;
	console.log(reqcase);
	
	var othercases = lodash.filter(data, function (e) { return e.caseId !== casId; });
	othercases.push(reqcase);
		var daaataa = JSON.stringify(othercases, null, 2);
		
	fs.writeFile(file, othercases, err => {
                if (err) console.error(err);
                else console.log('done');
            });
			
	res.setHeader('Content-Type', 'application/json');
    res.send('Done');
	
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

var port = process.env.PORT || 3000
// listen for requests
app.listen(port, () => {
    console.log("Server is listening on port 3000");
});