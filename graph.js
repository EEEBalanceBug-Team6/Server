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
        for(const vertex of this.vertices){
            if(vertex !== this.vertices[0]){
                this.shortestTree[vertex] = {"distance" : Infinity, "previous" : this.vertices[0]};
            } else {
                this.shortestTree[vertex] = {"distance" : 0, "previous" : this.vertices[0]};
            }
        }

        for(const parent in this.graph){
            for(const child in this.graph[parent]){
                if(this.graph[parent][child] + this.shortestTree[parent].distance <= this.shortestTree[child].distance){
                    this.shortestTree[child].distance = this.graph[parent][child] + this.shortestTree[parent].distance;
                    this.shortestTree[child].previous = parent;
                }
            }
        }
    }

    reconstruct(end){
        var returnList = [end];
        var pointer = end;

        while(pointer !== this.vertices[0]){
            returnList.push(this.shortestTree[pointer].previous);
            pointer = this.shortestTree[pointer].previous
        }

        return returnList.reverse();
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
console.log(graph.reconstruct('E'));

module.exports = Graph;

