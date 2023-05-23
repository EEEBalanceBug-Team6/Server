const express = require('express');
const bodyParser = require('body-parser');

let IP = 'localhost' // remember to change this when using it for production
let PORT = 8080

const app = express();

app.use(bodyParser.json());

var previousNode = 0; // this variable needs to be used to configure edges between two nodes. It is effectively the parent node
var start = true;

var alldata = { // data structure that stores everything, vertices and edges can be used together to create the graph
    "locations" : [], 
    "vertices" : [], 
    "edges" : [] // this can actually be used alone to create the graph for Dijkstra's algorithm
};

var newdata = { // data structure to be sent, empty everytime a client dump is made
    "locations" : [], 
    "vertices" : [], 
    "edges" : []
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
        'options' : options // has to be a list of all possible exits, so N, S, E, W - determined by the compass module
    }
    alldata.vertices.push(json);
    newdata.vertices.push(json);
    // probably need another helper function here to check if one of the vertices is already a part of alldata, if it is then you need to use the addEdge function to create an edge between the two vertices.
}

function addEdge(vertices, weight){ // note that you are assuming that the input is a string here
    var json = {
        'vertices' : vertices, // list of vertices connected to the edge - assume first element is the origin node
        'weight' : weight // cost of traversing the edge.
    }
    alldata.edges.push(json);
    newdata.edges.push(json);
} 

app.get('/', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Welcome to Group 6\'s server!');
});

app.get('/client', function(req, res){
    var response = {
        'status' : 'success',
        'message' : `GET @ ${new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date.getSeconds()}`
    }
    stringResponse = JSON.stringify(response)
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(stringResponse); 
    console.log(stringResponse);
    // WORKS
});

app.get('/client/datadump', function(req, res){
    // complete this function with the newdata object being sent as a response
    res.writeHead(200, { 'Content-Type': 'application/json'});
    res.end(JSON.stringify(newdata));
    newdata = {
        "locations" : [], 
        "vertices" : [], 
        "edges" : []
    };
    // WORKS, need to test after adding a few values
}); 

app.post('/data/initialize', function(req, res){
    //the rover will pan around and see the possible directions it can move from the start node (options), the json here will NOT take body.
    var body = req.body; 
    addVertice(previousNode, parseInt(body.x), parseInt(body.y), body.options);

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('success');
});

app.post('/data/update', function(req, res){ 
    var store = true;
    var body = req.body; 
    alldata.vertices.forEach(object => { // checks if you have already visited a given node before. If you have then it implements logic for a wrap around in terms of the edge, but no addition to the vertices
        if (object.x === body.x && object.y === body.y){
            store = false;
            addEdge([previousNode, object.id], body.weight);
            previousNode = object.id; // you dont have to implement the start logic here because you cant visit the start node multiple times right?
        }
    });
    if (store){
        addVertice(previousNode + 1, parseInt(body.x), parseInt(body.y), body.options); // are we storing previousNode + 1 or previousNode?
        // need to add logic for converting this to an edge between two nodes.
        // remember that you need to use previousNode to find an edge and add this edge if it doesn't already exist
        addEdge([previousNode, previousNode + 1], body.weight);
        
        previousNode += 1;
    }
    res.writeHead(200, {'Content-Type' : 'text/plain'});
    res.end('success');
});

app.get('/data/clear', function(req, res){
    // use get method to clear the two data structures
});

//If the rover notices that it has already visited a node, it backtracks to the previous node. Need to implement this functionality on the server side as well.

app.listen(PORT, IP, function(err){
    if (err) { console.log(err); }
    else { console.log("Server listening on PORT", PORT); }
});
