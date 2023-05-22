const express = require('express');

let IP = 'localhost' // remember to change this when using it for production
let PORT = 8080

const app = express();

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
        'timestamp' : timestamp, // has to be a date object
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
        'options' : options // has to be a list of all possible exits
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

function checkVisited(x, y){
    // this function needs to check the visited vertices
}

app.get('/', function(req, res){
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('hello world'); // incomplete, needs to send back a json with the requirements according to the API contract
})

app.get('/client', function(req, res){
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('enter the server connectivity status here'); // incomplete, needs to serve a webpage instead
})

app.get('/client/datadump', function(req, res){
    // complete this function with the newdata object being sent as a response
    res.writeHead(200, { 'Content-Type': 'application/json'});
    res.end(newdata);
    newdata = {
        "locations" : [], 
        "vertices" : [], 
        "edges" : []
    }; // this just resets the newdata object for fresh insertion, alldata is untouched
})

// need methods (POST) to store new vertice and location data

app.post('/data/update', function(req, res){
    // use post method to update position in real time - should be updated based on req
})

app.post('/data/node', function(req, res){
    // use post method to add a node - exits can be determined on the basis of the shape of the turn
})

app.get('/data/clear', function(req, res){
    // use get method to clear the two data structures
})

app.listen(PORT, IP, function(err){
    if (err) { console.log(err); }
    else { console.log("Server listening on PORT", PORT); }
});
