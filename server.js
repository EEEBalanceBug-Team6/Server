const Graph = require('./util/graph.js');
const db = require('./util/db.js');
const Queries = require('./util/queries.js');
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

let IP = '0.0.0.0';
let PORT = 8080;

const connectDB = mysql.createConnection(db); // remember to change these values to the correct ones when sending queries back and forth
const app = express();
const londonTime = new Date().toLocaleTimeString("en-GB", { timeZone: "Europe/London" });

app.use(bodyParser.json());

var graph = new Graph(); // this is the graph imported from the graph file
var previousNode = 0; // this variable needs to be used to configure edges between two nodes. It is effectively the parent node
var maxUpTillNow = 0; // niche case, try to run the entire rover path test and you'll see why this is needed

var alldata = { // data structure that stores everything, vertices and edges can be used together to create the graph
    "locations" : [], 
    "vertices" : [], 
    "edges" : [], // this can actually be used alone to create the graph for Dijkstra's algorithm
    "shortest" : [] // need to write a function that uses dijkstra's to find the shortest path
};

var newdata = { // data structure to be sent, empty everytime a client dump is made
    "locations" : [], 
    "vertices" : [], 
    "edges" : [],
    "shortest" : [] // need to write a function that uses dijkstra's to find the shortest path
};

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

function addEdge(vertices, weight){ // note that you are assuming that the input is a string here
    var json = {
        'vertices' : vertices, // list of vertices connected to the edge - assume first element is the origin node
        'weight' : weight // cost of traversing the edge.
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
    var ID = -1;
    alldata.vertices.forEach(vertice => {
        if(vertice.x === x && vertice.y === y){
            ID = vertice.id;
        }
    });
    return ID;
}

function shortestList(ID){
    let stringList = graph.reconstruct(ID.toString());
    let intList = stringList.map(Number);
    alldata["shortest"] = intList;
    newdata["shortest"] = intList;
}

// add a function here that finds the shortest path between any two given vertices.

app.get('/', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Welcome to Group 6\'s server!');
});

app.get('/test', function(req, res){
    console.log(req.query);

    res.send('test page');
});

app.get('/client', function(req, res){
    var response = {
        'status' : 'success',
        'message' : `GET @ ${new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date.getSeconds()}`
    };
    stringResponse = JSON.stringify(response)
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(stringResponse); 
    console.log(stringResponse);
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

app.get('/data/start', function(req, res){
    //the rover will pan around and see the possible directions it can move from the start node (options), the json here will NOT take body.
    var body = req.query; // changed from req.body to req.query
    var options = {}; // initializer json for options

    if(typeof req.query.options === 'string'){
        options[parseInt(req.query.options)] = false;
    } else {
        for(const option of req.query.options){
            options[parseInt(option)] = false;
        }
    } // creates equivalent of the json in the same way as before, except we are using query params instead

    addVertice(previousNode, parseInt(body.x), parseInt(body.y), options);

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

    graph.Dijkstra();
    console.log("--------------------------------------------------------------------------------------------------------------------------------");
    console.log("Current Vertex: " + previousNode);
    console.log(graph);
    console.log(graph.reconstruct(previousNode.toString()));
    console.log("--------------------------------------------------------------------------------------------------------------------------------");
    shortestList(previousNode);

    // WORKS, only issue is it doesn't check if the node has already been initialized
});

app.get('/data/update', function(req, res) {
    var body = req.query;
    var date = new Date();
    var isodate = date.toISOString();

    console.log(req.query);

    addLocation(isodate, parseInt(body.x), parseInt(body.y), parseInt(body.direction));

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('');
});

app.get('/data/node', function(req, res){ 
    var body = req.query; 

    ID = lookUpCoordinates(parseInt(body.x), parseInt(body.y)); // IMPORTANT THAT YOU SEE YOUR IMPLEMENTATION OF LOOKUP COORDINATES HERE, IT IS A STRING.
    checkOption(body.parentDirection, previousNode); // assigns direction from where you have left the previous node, so basically it assigns a direction to the previous node

    if (ID === -1){ // TEST THIS PART
        let options = {}; // initializer json for options

        if(typeof req.query.options === 'string'){
            options[parseInt(req.query.options)] = false;
        } else {
            for(const option of req.query.options){
                options[parseInt(option)] = false;
            }
        } // creates equivalent of the json in the same way as before, except we are using query params instead

        maxUpTillNow += 1;

        addVertice(maxUpTillNow, parseInt(body.x), parseInt(body.y), options); // are we storing previousNode + 1 or previousNode?
        // need to add logic for converting this to an edge between two nodes.
        // remember that you need to use previousNode to find an edge and add this edge if it doesn't already exist
        addEdge([previousNode, maxUpTillNow], parseInt(body.weight));
        
        previousNode = maxUpTillNow;
    } else {
        addEdge([previousNode, ID], parseInt(body.weight));
        previousNode = ID; // you dont have to implement the start logic here because you cant visit the start node multiple times right?
    }

    checkOption(body.childDirection, previousNode); // assigns direction from where you have approached this node, so basically it assigns a direction to this node
    // the response should query the options for the currentNode (which has been assigned as the previousNode) and pick one option which is then sent to the rover. The rover stores this, makes the turn and then sends this as part of the request (parentDirection) when is reaches the next node.

    var options = lookUpOption(lookUpCoordinates(parseInt(body.x), parseInt(body.y)), body.childDirection);
    var response = options.backup;
    let option = Object.keys(options.options);
    //console.log(option);
    for(let optionKey of option){
        console.log(options.options[optionKey]);
        if(!options.options[optionKey]){ // remember that this is nested in another object
            response = optionKey;
            break;
        }
    }

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(response); // sends as a response a json containing the options explored, helps pick the next option to be taken.

    graph.Dijkstra();
    console.log("--------------------------------------------------------------------------------------------------------------------------------");
    console.log("Current Vertex: " + previousNode);
    console.log(graph);
    console.log(graph.reconstruct(previousNode.toString()));
    console.log("--------------------------------------------------------------------------------------------------------------------------------");
    shortestList(previousNode);

    // once receiving the response, remember to store the option you pick in a variable and send it as part of the next request.

    // WORKS, maybe add error messages when you try adding the same node twice?
});

app.get('/data/clear', function(req, res){
    previousNode = 0;

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

app.get('/rover/begin', function(req, res){
    // helper method in case you need to manually control the movement of the rover
});

app.get('/rover/rebalance', function(req, res){
    // helper method in case you need the rover to re-orient itself
});

//If the rover notices that it has already visited a node, it backtracks to the previous node. Need to implement this functionality on the server side as well.

app.listen(PORT, IP, function(err){
    if (err) { console.log(err); }
    else {
        console.log("Server listening on PORT", PORT); 
        console.log('Current Time: ' + londonTime + ' BST');
    }
});
