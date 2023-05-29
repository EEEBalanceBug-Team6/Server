class Graph {
    constructor(IDs){
        this.graph = {};
        this.vertices = IDs;
        this.shortestTree = {};
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

    Dijkstra(){
        var start = this.vertices[0];
        var pointer = this.vertices[0];
        for(const vertex of this.vertices){
            if(vertex !== pointer){
                this.shortestTree[vertex] = {"distance" : Infinity, "previous" : pointer};
            } else {
                this.shortestTree[vertex] = {"distance" : 0, "previous" : pointer};
            }
        }
    }
};

const edges = [
    {"vertices" : ['A', 'B'], "weight" : 4},
    {"vertices" : ['A', 'C'], "weight" : 2},
    {"vertices" : ['B', 'C'], "weight" : 1},
    {"vertices" : ['B', 'D'], "weight" : 1},
    {"vertices" : ['C', 'D'], "weight" : 8},
    {"vertices" : ['C', 'E'], "weight" : 10}
];

var graph = new Graph(['A', 'B', 'C', 'D', 'E']); 

graph.populate(edges);
graph.Dijkstra();

console.log(graph);

module.exports = Graph;

/*

{
    parent : {child1 : weight1, child2 : weight2}
}


*/

