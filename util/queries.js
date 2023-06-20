class Queries{
    insertLocation(location){
        return "INSERT INTO locations (timestamp, x, y, direction) VALUES (" + location.timestamp + ", " + location.x + ", " + location.y + ", " + location.direction + ");";
    }

    insertVertice(ID, x, y){ // should cover adding to options table as well as vertices table
        return "INSERT INTO vertices (vid, x, y) VALUES (" + ID + ", " + x + ", " + y + ");";
    }

    insertEdge(pid, cid, weight){ // can cover just the edges table
        return "INSERT INTO edges (pid, cid, weight) VALUES (" + pid + ", " + cid + ", " + weight + ");";
    }

    insertOptions(){
        return;
    }

    updateOptions(option){
        return;
    }
};

module.exports = Queries;