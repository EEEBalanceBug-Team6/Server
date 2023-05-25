const express = require('express');
const bodyParser = require('body-parser');

let IP = 'localhost' // remember to change this when using it for production
let PORT = 8080

const app = express();

app.use(bodyParser.json());

var previousNode = 0; // this variable needs to be used to configure edges between two nodes. It is effectively the parent node

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
    // probably need another helper function here to check if one of the vertices is already a part of alldata, if it is then you need to use the addEdge function to create an edge between the two vertices.
}

function addEdge(vertices, weight){ // note that you are assuming that the input is a string here
    var json = {
        'vertices' : vertices, // list of vertices connected to the edge - assume first element is the origin node
        'weight' : weight // cost of traversing the edge.
    };
    alldata.edges.push(json);
    newdata.edges.push(json);
} 

function checkOption(direction, ID){
    alldata.vertices.forEach(vertice => { // this part checks the parent node and sets the direction from which you've traversed (part of the request) as true
        if(vertice.id === ID){
            // means you have found the node in the list of nodes already traversed

            keys = Object.keys(vertice.options);

            if (keys.includes(direction)) {;
                vertice.options[direction] = true;
            }
        }
    });
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
    console.log(stringResponse);
    // WORKS
});

app.get('/client/datadump', function(req, res){
    // complete this function with the newdata object being sent as a response
    res.writeHead(200, { 'Content-Type': 'application/json'});
    var data = {
        "status" : "success",
        "data" : newdata
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

app.post('/data/start', function(req, res){
    //the rover will pan around and see the possible directions it can move from the start node (options), the json here will NOT take body.
    var body = req.body; 

    addVertice(previousNode, parseInt(body.x), parseInt(body.y), body.options);

    checkOption(body.startDirection, previousNode); // assigns the direction to be traversed basically

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('success');

    // WORKS, only issue is it doesn't check if the node has already been initialized
});

// these two post methods are a little incommplete because you can't see if a path has been explored before or not.

app.post('/data/node', function(req, res){ 
    var body = req.body; 

    ID = lookUpCoordinates(body.x, body.y);
    checkOption(body.parentDirection, previousNode);

    if (ID === -1){ 
        addVertice(previousNode + 1, parseInt(body.x), parseInt(body.y), body.options); // are we storing previousNode + 1 or previousNode?
        // need to add logic for converting this to an edge between two nodes.
        // remember that you need to use previousNode to find an edge and add this edge if it doesn't already exist
        addEdge([previousNode, previousNode + 1], body.weight);
        
        previousNode += 1;
    } else {
        addEdge([previousNode, ID], body.weight);
        previousNode = ID; // you dont have to implement the start logic here because you cant visit the start node multiple times right?
    }

    checkOption(body.childDirection, previousNode);

    // the response should query the options for the currentNode (which has been assigned as the previousNode) and pick one option which is then sent to the rover. The rover stores this, makes the turn and then sends this as part of the request (parentDirection) when is reaches the next node.

    res.writeHead(200, {'Content-Type' : 'text/plain'});
    res.end('success'); // can modify the response to check for the next possible option to be taken
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

    res.writeHead(200, {'Content-Type' : 'text/plain'});
    res.end('success');
});

//If the rover notices that it has already visited a node, it backtracks to the previous node. Need to implement this functionality on the server side as well.

app.listen(PORT, IP, function(err){
    if (err) { console.log(err); }
    else { console.log("Server listening on PORT", PORT); }
});
