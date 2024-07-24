# Node Server

## Description

This is the code for the server backend for group 6's implementation of the automated maze-solving robot. It converts dead-ends, junctions and turns into nodes on a Directed Acyclic Graph (which represents the maze) and uses the distance between these as weights to traverse an edge. Using Dijkstra's Algorithm and a clever data structure for the graph, it is able to deduce the shortest path through the maze. The Server has various endpoints to implement the same.

## API Contract (Client)

### `/client`

* Purpose: Used to check if the server is alive.
* Method: `GET`
* Request: `N/A`
* Response:
  * `200 OK`

    ```javascript
    {
      "status": String, // e.g. "success"
      "message": String // e.g. "{Method} @ {Timestamp}"
    }
    ```

### `/client/datadump`

* Purpose: Used to retrieve all new data since last request.
* Method: `GET`
* Request: `N/A`
* Response:
  * `200 OK`

    ```javascript
    {
      "status": String, // e.g. "success"
      "data": {
        "locations": [{ // locations that the rover has been
          "timestamp": Date, // time of location data
          "x": Number, // x index of rover
          "y": Number, // y index of rover
          "direction": String // current bearing of rover
        }],
        "vertices": [{ // newly identified vertices
          "id": Number, // vertice id
          "x": Number, // x index of vertice
          "y": Number, // y index of vertice
          "options": {
            String: Bool, 
            String: Bool,
            ...
          } // heading options for vertices, true-false specifies whether it has been traversed
        }],
        "edges": [{ // newly idenfied edges
          "vertices": [Number, Number], // edge vertex ids
          "weight": Number // edge length
        }],
        "shortest": [Number], // list of vertex ids containing the shortest path between any two nodes
                             // first id is the start and last id is the final node
         "shortestToEnd": [Number] // list of vertices comprising the nodes upto the end. (only filled when you have reached the end of the maze)
      }
    }
    ```
### `/client/calibrate`

* Purpose: Used to calibrate what corner the end of the maze is on.
* Method: `GET`
* Request:
  * `200 OK`

    ```javascript
    {
       "start": Number, // 1, 2, 3, 4
       "end": Number, // 1, 2, 3, 4
       "B1": Number, // 1, 2, 3, 4
       "B2": Number // 1, 2, 3, 4
    }
    ```
* Response:
  * `200 OK`

    ```javascript
    {
      "status": String, // e.g. "success"
      "message": String // e.g. "{Method} @ {Timestamp}"
    }
    ```

## API Contract (Data)

Note that below, all of the values are just examples of how the data should look and these are not hard coded

### `/data/start`

* Purpose: Used to send the first node (also the node the rover starts at).
* Method: `POST`
* Request: The request is in query format. Note that options can be between 1 and 4 elements (send the right options):
   
    ```text
    0.0.0.0:8080/data/start?&options=0&options=90&options=180&options=270
    ```
* Response: String that contains the bearing to turn to for the next possible option
  * `200 OK` 
    `90`


### `/data/update`

* Purpose: Used to update the live location of the node.
* Method: `POST`
* Request: (self explanatory)
    ```text
    0.0.0.0:8080/data/update/?bber1=20&bber2=180&direction=90
    ```
* Response:
  * `200 OK`
    `` (empty string)

### `/data/node`

* Purpose: Used to add a vertice to the graph of nodes (automatically checks if node exists and also adds edge automatically).
* Method: `POST`
* Request: The request is in query format. Note that options can be between 1 and 4 elements (send the right options):
    ```text
    0.0.0.0:8080/data/node?bber1=20&bber2=180&options=0&options=90&options=180&options=270
    ```
* Response: String that contains the bearing to turn to for the next possible option
  * `200 OK` 
     `90` 

### `/data/clear`

* Purpose: Clears and resets all data.
* Method: `GET`
* Request: `N/A`
* Response:
  * `200 OK`
    `success`

