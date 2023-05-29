class Graph {
    constructor(){
        this.graph = {};
    }

    addEdge(edgelist, weight){ // loops in the graph are okay, Dijkstra's should be able to deal with it
        if(this.graph.hasOwnProperty(edgelist[0])){
            // the parent node already exists and doesnt have to be created
            // edgelist is the value to "vertices" in the edges part of the response to datadump
            // weight is the value for the weight key
            this.graph[edgelist[0]][edgelist[1]] = weight;
        } else {
            // the parent node doesnt exist and needs to be assigned
            this.graph[edgelist[0]] = { };

            this.graph[edgelist[0]][edgelist[1]] = weight;
        }
    }

    populate(edges){
        for(var edge of edges){
            this.addEdge(edge.vertices, edge.weight); // WORKS
        }
    }

    dijkstra(start, end){
        var visited = [start]
        var last = start
        while(last!==end){
            var min = Infinity;
            console.log(last);
            var value = this[last];
            for(const key in value){
                if (value[key] < min){
                    min = value[key];
                    var min_key = key;
                }
                last = min_key;
                visited.push(min_key);
            }
        }
        return visited
    }
}

const edges = [
    {"vertices" : ['A', 'B'], "weight" : 4},
    {"vertices" : ['A', 'C'], "weight" : 2},
    {"vertices" : ['B', 'C'], "weight" : 1},
    {"vertices" : ['B', 'D'], "weight" : 1},
    {"vertices" : ['C', 'D'], "weight" : 8},
    {"vertices" : ['C', 'E'], "weight" : 10}
]

var graph = new Graph();

graph.populate(edges);

console.log(graph);

module.exports = Graph;

/*

{
    parent : {child1 : weight1, child2 : weight2}
}


*/

