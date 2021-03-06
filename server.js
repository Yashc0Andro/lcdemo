var express = require('express');
var app = express();


//set pprt
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + "/base"));

var cors = require('cors');


app.options('*', cors()); // include before other routes 
app.use(cors());


// global controller
app.get('/*', function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next(); // http://expressjs.com/guide.html#passing-route control
});

//routes

app.get('/', function (req, res) {
    res.render("/base/index");
});


app.listen(port, function () {
    console.log("listening");
});

const usrJsonPath = 'users.json';
const emgJsonPath = 'emergency.json';
var fs = require('fs');

function getJsonData(path) {
    return JSON.parse(fs.readFileSync(path));
}

function writeJsonData(path, data) {
    var saveData = JSON.stringify(data, null, 2);
    fs.writeFile(path, saveData, err => {
        if (err) console.error(err);
        else console.log(path + ' - write successfull!');
    });
}

app.get('/getusers', (req, res) => {
    res.send(getJsonData(usrJsonPath));
});

function getUserObjFromQueryString(qs) {

    return {
        //caseId: parseInt(qs['caseId']),
        caseId: qs['caseId'],
        userName: qs['uName'],
        name: qs['name'],
        personalNumber: qs['number'],
        emergencyNumber: qs['emergencynum'],
        Address: qs['address'],
    };
}

function isExistingUser(userData, userObj) {
    let found = false
    for (var i = 0; i < userData.length; i++) {
        if (userData[i].caseId === userObj.caseId) {
            found = true;
            break;
        }
    }

    return found;
}

app.get('/adduser', (req, res) => {

    var userData = getJsonData(usrJsonPath);
    var newUser = getUserObjFromQueryString(req.query);
    
    if (isExistingUser(userData, newUser)) {
        res.send('User with Id already exists.');
    }
    else {
        userData.push(newUser);
        writeJsonData(usrJsonPath, userData);
        // res.send('User added successfully');
        res.send('Ok');
    }
});



function udpateUser(userData, userObj) {
    for (var i = 0; i < userData.length; i++) {
        if (userData[i].caseId === userObj.caseId) {
            userData[i] = userObj;
        }
    }
}


app.get('/udpateuser', (req, res) => {

    var userData = getJsonData(usrJsonPath);
    var userObj = getUserObjFromQueryString(req.query);

    if (!isExistingUser(userData, userObj)) {
        res.send('User Not Found!!!');
    } else {
        udpateUser(userData, userObj);
        writeJsonData(usrJsonPath, userData);
        res.send('User details Updated successfully!!!');

    }
});



function deleteUser(userData, userObj) {
    for (var i = 0; i < userData.length; i++) {
        if (userData[i].caseId === userObj.caseId) {
            userData.splice(i, 1);
        }
    }
}


app.get('/deleteuser', (req, res) => {
    var userData = getJsonData(usrJsonPath);
    var userObj = getUserObjFromQueryString(req.query);

    if (!isExistingUser(userData, userObj)) {
        res.send('User Not Found!!!');
    } else {
        deleteUser(userData, userObj);
        writeJsonData(usrJsonPath, userData);
        res.send('User deleted successfully!!!');

    }
});


app.get('/getemergencies', (req, res) => {
    res.send(getJsonData(emgJsonPath));
});

function getEmgObjFromQueryString(qs) {

    var qsObj = {
        // caseId: parseInt(qs['caseId']),
        caseId: qs['caseId'],
        Location: qs['latitude'] + ',' + qs['longitude'],
        Status: 'red'  //qs['stat']
    };

    var userObj = getUser(qsObj.caseId);
    // console.log(userObj);
    if (userObj) {

        qsObj.name = userObj.name;
        qsObj.personalNumber = userObj.personalNumber;
        qsObj.emergencyNumber = userObj.emergencyNumber;
        qsObj.Address = userObj.Address;
    }

    return qsObj;
}

function getUpdateEmgObjFromQueryString(qs) {

    var qsObj = {
        // caseId: parseInt(qs['caseId']),
        caseId: qs['caseId'],
        Location: qs['latitude'] + ',' + qs['longitude'],
        Status: qs['stat']
    };

    var userObj = getUser(qsObj.caseId);
    // console.log(userObj);
    if (userObj) {

        qsObj.name = userObj.name;
        qsObj.personalNumber = userObj.personalNumber;
        qsObj.emergencyNumber = userObj.emergencyNumber;
        qsObj.Address = userObj.Address;
    }

    return qsObj;
}


function getUser(caseId) {
    if (!caseId) return null;
    var userData = getJsonData(usrJsonPath), result = null;
    for (var i = 0; i < userData.length; i++) {
        if (userData[i].caseId === caseId) {
            result = userData[i];
            break;
        }
    }
    return result;
}


function getEmergency(emgData, caseId) {
    if (!caseId) return null;
    emgData = emgData || getJsonData(emgJsonPath), result = null;
    for (var i = 0; i < emgData.length; i++) {
        if (emgData[i].caseId === caseId) {
            result = emgData[i];
            break;
        }
    }
    return result;
}


function updateEmgStatus(emgData, emgObj) {
    for (var i = 0; i < emgData.length; i++) {
        if (emgData[i].caseId === emgObj.caseId) {
            emgData[i].Status = emgObj.Status;
        }
    }
}


app.get('/addemergency', (req, res) => {

    var emgData = getJsonData(emgJsonPath);
    var newEmg = getEmgObjFromQueryString(req.query);

    var emgObj = getEmergency(emgData, newEmg.caseId);
    //console.log(emgObj);
    if (emgObj) {
        // updateEmgStatus(emgData, newEmg);
        //writeJsonData(emgJsonPath, emgData);
        res.send('Emergency Already Exists');
    }
    else {
        emgData.push(newEmg);
        writeJsonData(emgJsonPath, emgData);
        //res.send('Emergency recorded into our system successfully');
        res.send('Ok');
    }
});

app.get('/updateemergency', (req, res) => {

    var emgData = getJsonData(emgJsonPath);
    var newEmg = getUpdateEmgObjFromQueryString(req.query);

    var emgObj = getEmergency(emgData, newEmg.caseId);

    if (!emgObj) {
        //  emgData.push(newEmg);
        // writeJsonData(emgJsonPath, emgData);
        res.send('Emeregency request Not Found!!!');
    } else {
        updateEmgStatus(emgData, newEmg);
        writeJsonData(emgJsonPath, emgData);
        res.send('Emeregency status updated successfully!!!');

    }
});



function deleteEmergency(emgData, emgObj) {
    for (var i = 0; i < emgData.length; i++) {
        if (emgData[i].caseId === emgObj.caseId) {
            emgData.splice(i, 1);
        }
    }
}


app.get('/deleteemergency', (req, res) => {

    var emgData = getJsonData(emgJsonPath);
    // var deleteEmgCaseId = parseInt(req.query['caseId']);
    var deleteEmgCaseId = req.query['caseId'];

  //  console.log(deleteEmgCaseId)
    var emgObj = getEmergency(emgData, deleteEmgCaseId);

    res.header('Content-Type', 'text/plain');
    if (!emgObj) {
        res.send('Emergency request is Not Found in our system!!!');
    } else {
        deleteEmergency(emgData, getEmergency(emgData, deleteEmgCaseId));
        writeJsonData(emgJsonPath, emgData);
        res.send('Emergency request deleted successfully!!!');

    }
});

