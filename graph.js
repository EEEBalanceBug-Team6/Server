class Graph {
    constructor(){
        this.graph = {};
        this.vertices = [];
        this.shortestTree = {};
    }

    addVertex(vertex){
        if(!this.vertices.includes(vertex)){
            this.vertices.push(vertex);
        }
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

var graph = new Graph(); 

graph.addVertex('A'); // this format is useful in the server file
graph.addVertex('B');
graph.addVertex('C');
graph.addVertex('D');
graph.addVertex('E');

graph.addEdge(['A', 'B'], 4); // this format is useful in the server file
graph.addEdge(['A', 'C'], 2);
graph.addEdge(['B', 'C'], 1);
graph.addEdge(['B', 'D'], 1);
graph.addEdge(['C', 'D'], 8);
graph.addEdge(['C', 'E'], 10);

graph.Dijkstra();

console.log(graph);
console.log(graph.reconstruct('E'));

module.exports = Graph;

