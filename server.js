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