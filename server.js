const Graph = require('./util/graph.js');
const db = require('./util/db.js');
const Queries = require('./util/queries.js');
const cors = require('cors');
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

let IP = '0.0.0.0';
let PORT = 8080;

const connectDB = mysql.createConnection(db); // remember to change these values to the correct ones when sending queries back and forth
const app = express();
const londonTime = new Date().toLocaleTimeString("en-GB", { timeZone: "Europe/London" }); // try this without the timezone

app.use(bodyParser.json());
app.use(cors());

var graph = new Graph(); // this is the graph imported from the graph file
var previousNode = 0; // this variable needs to be used to configure edges between two nodes. It is effectively the parent node
var maxUpTillNow = 0; // niche case, try to run the entire rover path test and you'll see why this is needed
var prevx = 0; // used to calculate the weight from the last node basically, reassgined when you reach a node
var prevy = 0; 
var parentDirection;
var childDirection;
var margin = 5; // based on the diameter of the rover: depends on live testing it
var lights = false;
var start = [0, 0];
var end = [60, 90]; // for testing purposes
var beacon1 = [0, 0];
var beacon2 = [0, 0];

var alldata = { // data structure that stores everything, vertices and edges can be used together to create the graph
    "locations" : [], 
    "vertices" : [], 
    "edges" : [], // this can actually be used alone to create the graph for Dijkstra's algorithm
    "shortest" : [], // need to write a function that uses dijkstra's to find the shortest path
    "shortestToEnd" : []
};

var newdata = { // data structure to be sent, empty everytime a client dump is made
    "locations" : [], 
    "vertices" : [], 
    "edges" : [],
    "shortest" : [], // need to write a function that uses dijkstra's to find the shortest path
    "shortestToEnd" : []
};

var mazeEnds = {
    '1' : [0, 0],
    '2' : [0, 3.42],
    '3' : [2.3, 3.42],
    '4' : [2.3, 0]
}

// the three functions below are helper functions for pushing data to both data structures, datadump method needs to reset the newdata to empty object

function addLocation(timestamp, x, y, direction) { 
    var json = {
        'timestamp' : timestamp, // has to be a date object - can use the method used in the base file
        'x' : x, // has to be a number
        'y' : y, // has to be a number
        'direction' : direction // string
    };
    alldata.locations.push(json);
    newdata.locations.push(json);
}

function addVertice(id, x, y, options){
    var json = {
        'id' : id, // number
        'x' : x, // number
        'y' : y, // number
        'options' : options // has to be an object of all possible exits, so N, S, E, W - determined by the compass module, along with a boolean indicating whether you have traversed the edge or not
    };
    alldata.vertices.push(json);
    newdata.vertices.push(json);
    graph.addVertex(id);
}

function prettyPrint(node){
    console.log("--------------------------------------------------------------------------------------------------------------------------------");
    console.log("Current Vertex: " + node);
    console.log(graph);
    console.log(graph.reconstruct(node.toString(), '0'));
    console.log("--------------------------------------------------------------------------------------------------------------------------------");
}

function verticeReturn(ID){
    var returnval = {};
    alldata.vertices.forEach(vertice => {
        if(vertice.id === ID){
            returnval =  vertice; // remember that return would return from the scope of the foreach function
        }
    });
    return returnval;
}

function addEdge(vertices, weight, angle){ // note that you are assuming that the input is a string here
    var json = {
        'vertices' : vertices, // list of vertices connected to the edge - assume first element is the origin node
        'weight' : weight, // cost of traversing the edge.
        'option' : angle // option you came to this node from
    };
    alldata.edges.push(json);
    newdata.edges.push(json);
    graph.addEdge(vertices, weight);
} 

function checkOption(direction, ID){
    alldata.vertices.forEach(vertice => { // this part checks the parent node and sets the direction from which you've traversed (part of the request) as true
        if(vertice.id === ID){
            // means you have found the node in the list of nodes already traversed

            let keys = Object.keys(vertice.options);

            if (keys.includes(direction)) {
                vertice.options[direction] = true;
            }
        }
    });
}

function lookUpOption(ID, backup){
    let returnval = -1; // can be used for an error message
    alldata.vertices.forEach(vertice => {
        if(vertice.id === ID){
            returnval = {"options" : vertice.options, "backup" : backup};
        }
    })
    return returnval;
}

function lookUpCoordinates(x, y){
    var returnval = [-1, -1, -1]; // ID, x, y
    alldata.vertices.forEach(vertice => {
        if((vertice.x - margin <= x && vertice.x + margin >= x) && (vertice.y - margin <= y && vertice.y + margin >= y)){
            returnval[0] = vertice.id;
            returnval[1] = vertice.x;
            returnval[2] = vertice.y;
        }
    });
    return returnval;
}

function shortestList(ID){
    let stringList = graph.reconstruct(ID.toString(), '0');
    let intList = stringList.map(Number);
    alldata["shortest"] = intList;
    newdata["shortest"] = intList;
}

function endReached(){
    var reached = true;
    alldata.vertices.forEach(vertice => {
        optionList = Object.keys(vertice.options);
        for(option of optionList){
            if(!vertice.options[option]){
                reached = false;
            }
        }
    });
    return reached;
}

function unexploredNode(){
    var ID = -1;
    alldata.vertices.forEach(vertice => {
        optionList = Object.keys(vertice.options);
        for(option of optionList){
            if(!vertice.options[option]){
                ID = vertice.id;
            }
        }
    });
    return ID;
}

// add a function here that finds the shortest path between any two given vertices.

app.get('/', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Welcome to Group 6\'s server!');
});

app.get('/client', function(req, res){
    var response = {
        'status' : 'success',
        'message' : `GET @ ${new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date.getSeconds()}`
    };
    stringResponse = JSON.stringify(response)
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(stringResponse); 
    // WORKS
});

app.get('/client/datadump', function(req, res){
    // complete this function with the newdata object being sent as a response
    res.writeHead(200, {'Content-Type': 'application/json'});
    var data = {
        "status" : "success",
        "data" : alldata
    };
    res.end(JSON.stringify(data));
    newdata = {
        "locations" : [], 
        "vertices" : [], 
        "edges" : [],
        "shortest" : []
    };
    // WORKS
}); 

app.get('/client/calibrate', function(req, res){
    start = mazeEnds[req.body.start];
    end = mazeEnds[req.body.end];
    beacon1 = mazeEnds[req.body.B1];
    beacon2 = mazeEnds[req.body.B2];

    var response = {
        'status' : 'success',
        'message' : `GET @ ${new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date.getSeconds()}`
    };

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(response));
});

app.get('/data/start', function(req, res){
    //the rover will pan around and see the possible directions it can move from the start node (options), the json here will NOT take body.
    var body = req.query; // changed from req.body to req.query
    var options = {}; // initializer json for options
    var x = start[0]; 
    var y = start[1]; 

    if(typeof req.query.options === 'string'){
        options[req.query.options] = false;
    } else {
        for(const option of req.query.options){
            options[option] = false;
        }
    } // creates equivalent of the json in the same way as before, except we are using query params instead

    addVertice(previousNode, x, y, options);

    var response = "";
    let option = Object.keys(options);
    for(const optionKey of option){
        if(!options[optionKey]){
            response = optionKey;
            break;
        }
    } // logic to send the rover the next option bearing to go to

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(response); // pick any option available and put it into a variable that is sent along with the next request.

    prevx = x;
    prevy = y;
    parentDirection = response;
    childDirection = ((parseInt(response)+180) % 360).toString();

    graph.Dijkstra();
    prettyPrint(previousNode);
    shortestList(previousNode);

    // WORKS, only issue is it doesn't check if the node has already been initialized
});

app.get('/data/update', function(req, res) {
    var body = req.query;
    var date = new Date();
    var isodate = date.toISOString();

    addLocation(isodate, parseInt(body.x), parseInt(body.y), parseInt(body.direction));

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('');
});

app.get('/data/node', function(req, res){ 
    var body = req.query; 

    var coordinates = lookUpCoordinates(parseInt(body.x), parseInt(body.y)); // change this based on triangulation
    var ID = coordinates[0]; // IMPORTANT THAT YOU SEE YOUR IMPLEMENTATION OF LOOKUP COORDINATES HERE, IT IS A STRING.
    var x = parseInt(body.x);  
    var y = parseInt(body.y);
    if(coordinates[1] !== -1){
        x = coordinates[1];
    }
    if(coordinates[2] !== -1){
        y = coordinates[2];
    }
    var weight = Math.floor(Math.sqrt(Math.pow((x - prevx), 2) + Math.pow((y - prevy), 2)));
    checkOption(parentDirection, previousNode); // assigns direction from where you have left the previous node, so basically it assigns a direction to the previous node

    if (ID === -1){ 
        let options = {};
        if(typeof req.query.options === 'string'){
            options[req.query.options] = false;
        } else {
            for(let option of req.query.options){
                options[option] = false;
            }
        }

        maxUpTillNow += 1;

        addVertice(maxUpTillNow, x, y, options); // are we storing previousNode + 1 or previousNode?
        // need to add logic for converting this to an edge between two nodes.
        // remember that you need to use previousNode to find an edge and add this edge if it doesn't already exist
        addEdge([previousNode, maxUpTillNow], weight, childDirection);
        addEdge([maxUpTillNow, previousNode], weight, parentDirection);

        previousNode = maxUpTillNow;
        checkOption(childDirection, previousNode); // assigns direction from where you have approached this node, so basically it assigns a direction to this node
    } else {
        addEdge([previousNode, ID], weight, childDirection);
        addEdge([ID, previousNode], weight, parentDirection);
        previousNode = ID; // you dont have to implement the start logic here because you cant visit the start node multiple times right?
        checkOption(childDirection, previousNode); // assigns direction from where you have approached this node, so basically it assigns a direction to this node
        newdata.vertices.push(verticeReturn(ID)); // you want to push to new data after you have made sure it is up to date completely.
    } 
    // the response should query the options for the currentNode (which has been assigned as the previousNode) and pick one option which is then sent to the rover. The rover stores this, makes the turn and then sends this as part of the request (parentDirection) when is reaches the next node.

    var options = lookUpOption(previousNode, childDirection);
    var response = options.backup;

    if(endReached()){
        response = "-1";
    } else {
        let option = Object.keys(options.options);
        for(let optionKey of option){
            if(!options.options[optionKey]){ // remember that this is nested in another object
                response = optionKey;
                break;
            }
        }
    }

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(response); // sends as a response a json containing the options explored, helps pick the next option to be taken.

    prevx = x;
    prevy = y;
    parentDirection = response;
    childDirection = ((parseInt(response)+180) % 360).toString();

    graph.Dijkstra();
    prettyPrint(previousNode);
    shortestList(previousNode); 

    if(endReached()){
        console.log("We have reached the end of the maze.");
        var datalist = lookUpCoordinates(end[0], end[1])[0]
        alldata.shortestToEnd = datalist;
        newdata.shortestToEnd = datalist;
    }

    // once receiving the response, remember to store the option you pick in a variable and send it as part of the next request.

    // WORKS, maybe add error messages when you try adding the same node twice?
});

app.get('/data/clear', function(req, res){
    previousNode = 0;
    maxUpTillNow = 0;
    prevx = 0;
    prevy = 0;
    parentDirection = "";
    childDirection = "";

    alldata = {
        "locations" : [], 
        "vertices" : [], 
        "edges" : [],
        "shortest" : []
    };

    newdata = {
        "locations" : [], 
        "vertices" : [], 
        "edges" : [],
        "shortest" : []
    };

    graph = new Graph();

    res.writeHead(200, {'Content-Type' : 'text/plain'});
    res.end('success');
});

app.get('/lights/ping', function(req, res) {
    if(lights){
        res.send('1');
    } else {
        res.send('0'); // used by the ESP32s to check the status of the rover at this point.
    }
    lights = false;
});

app.get('/lights/node', function(req, res) {
    var body = req.query;
    if(body.incomplete === '1'){
        lights = true;
    } else {
        lights = false;
    }
    res.send(''); // rover detects a node and wants to find it's coordinates
});

app.listen(PORT, IP, function(err){
    if (err) { console.log(err); }
    else {
        console.log("Server listening on PORT", PORT); 
        console.log('Current Time: ' + londonTime + ' BST');
    }
});
