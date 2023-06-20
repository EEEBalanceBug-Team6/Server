class Queries{
    insertLocation(location){
        return "INSERT INTO locations (timestamp, x, y, direction) VALUES (" + location.timestamp + ", " + location.x + ", " + location.y + ", " + location.direction + ");";
    }

    insertVertice(vertice){ // should cover adding to options table as well as vertices table
        return;
    }

    updateVertice(option){

    }

    insertEdge(edge){ // can cover just the edges table
        return;
    }
};

module.exports = Queries;