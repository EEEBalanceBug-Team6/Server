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

    Dijkstra(){
        for(const vertex of this.vertices){
            if(vertex !== this.vertices[0]){
                this.shortestTree[vertex] = {"distance" : Infinity, "previous" : this.vertices[0].toString()};
            } else {
                this.shortestTree[vertex] = {"distance" : 0, "previous" : this.vertices[0].toString()};
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

    Backtrack(startnode){
        for(const vertex of this.vertices){
            if(vertex !== startnode){
                this.shortestTree[vertex] = {"distance" : Infinity, "previous" : startnode.toString()};
            } else {
                this.shortestTree[vertex] = {"distance" : 0, "previous" : startnode.toString()};
            }
        }

        for(const child in this.graph['E']){
            if(this.graph['E'][child] + this.shortestTree['E'].distance <= this.shortestTree[child].distance){
                this.shortestTree[child].distance = this.graph['E'][child] + this.shortestTree['E'].distance;
                this.shortestTree[child].previous = 'E';
            }
        }

        for(const parent in this.graph){
            if(parent !== 'E'){
                for(const child in this.graph[parent]){
                    if(this.graph[parent][child] + this.shortestTree[parent].distance <= this.shortestTree[child].distance){
                        this.shortestTree[child].distance = this.graph[parent][child] + this.shortestTree[parent].distance;
                        this.shortestTree[child].previous = parent;
                    }
                }
            }
        }
    }

    reconstruct(end, start){
        var returnList = [end];
        var pointer = end;

        while(pointer !== start.toString()){
            returnList.push(this.shortestTree[pointer].previous);
            pointer = this.shortestTree[pointer].previous;
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
graph.addEdge(['B', 'A'], 4);
graph.addEdge(['A', 'C'], 2);
graph.addEdge(['C', 'A'], 2);
graph.addEdge(['B', 'C'], 1);
graph.addEdge(['C', 'B'], 1);
graph.addEdge(['B', 'D'], 1);
graph.addEdge(['D', 'B'], 1);
graph.addEdge(['C', 'D'], 8);
graph.addEdge(['D', 'C'], 8);
graph.addEdge(['C', 'E'], 10);
graph.addEdge(['E', 'C'], 10);

graph.Backtrack('E');
console.log(graph);
// graph.Dijkstra();
// console.log(graph);
//console.log(graph.reconstruct('C', 'E'));

module.exports = Graph;

