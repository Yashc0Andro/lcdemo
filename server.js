var express = require('express');
var app = express();


//set pprt
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + "/base"));


//routes

app.get('/', function(req,res)
{
	res.render("/base/index");
});


app.listen(port, function(){
	
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

app.get('/adduser', (req, res) => {

    var fs = require('fs');
	const file = 'users.json';
    
    let rawdata = fs.readFileSync(file);
    let usersData = JSON.parse(rawdata);
	
	//get data from query string
	var query = req.query;
    var casId = query['caseId'];
	var uName = query['userName'];
    var name = query['name'];
    var number = query['number'];
    var eNumber = query['emergencynum'];
	var address = query['address'];
	
    // let newUser = {
            // caseId: casId,
			// userName: uName,
            // name: name,
            // personalNumber: number,
            // emergencyNumber: eNumber,
            // Address: address,
        // };
	
	// //check of the record exists with username or caseId
	// var lodash = require('lodash');
	// var user = lodash.where(usersData, function (e) { return e.caseId === casId; });
	// if(isEmpty(obj))
	// {
		// //add user
		// userData.push(newUser);
		
		// var newData = JSON.stringify(userData, null, 2);
		// fs.writeFile(file, newData, err => {
			// if (err) console.error(err);
			// else console.log('done');
		// });
		
		
	// }
	
    res.setHeader('Content-Type', 'application/json');
   // res.send(newUser);
    res.send('Ok');
    
});

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}