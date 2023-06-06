class Queries{
    insertLocation(location){
        return "INSERT INTO locations (timestamp, x, y, direction) VALUES (" + location.timestamp + ", " + location.x + ", " + location.y + ", " + location.direction + ");";
    }

    insertVertice(vertice){
        return "INSERT INTO vertices (vid, x, y) VALUES (";
    }
};

module.exports = Queries;