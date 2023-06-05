class Queries{
    insertLocation(location){
        var returnval = "INSERT INTO locations (timestamp, x, y, direction) VALUES (" + location.timestamp + ", " + location.x + ", " + location.y + ", " + location.direction + ");";
    }
};

module.exports = Queries;