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


## Important links

- **GitHub:** https://github.com/hakanmerdan/EEEBalanceBug.git
- **ESP32 + Node Server:** https://community.appinventor.mit.edu/t/node-js-web-server-in-pc-esp32-esp8266-sensor-temp-humd-batch-file-windows/38322
- **Redis Database:** https://redis.io/docs/clients/nodejs/
- **ExpressJs Website:** https://expressjs.com/
- **sendFile function:** https://www.geeksforgeeks.org/express-js-res-sendfile-function/
- **Filesystem nodejs:** https://www.w3schools.com/nodejs/nodejs_filesystem.asp
- **Routing:** https://expressjs.com/en/guide/routing.html#route-parameters
- **URL encode json:** https://onlinejsontools.com/url-encode-json

## Tasks

- [x]  Understand basic express routing.
- [x]  Add responses to the basic API calls as shown in the API contract at https://github.com/EEEBalanceBug-Team6/docs.
- [x]  In the client datadump method, you need to reset the newdata object to a blank version of it because of the updation requirements.
- [x]  Put requests into data structure (Graph? Tree equivalent?).
- [x]  Add a POST request that also adds data to the “data” json.
- [x]  Extend API contract with the methods needed for ESP32 communication.
- [x]  Test the checkOptions function.
- [x]  Finish the update and turn methods. (Added the turn as a response to the node method)
- [x]  Add code for backtracking of the rover in case it encounters a node it has seen before.(This is done with a boolean)
- [x]  Write Dijkstra’s Algorithm equivalent on data structure in javascript.
- [x]  Test the Dijkstra's code using the debug statements recently added.
- [x]  Test new node response.
- [x]  Complete Sam's suggestions (except triangulation).
- [x]  Change data methods from post to get, add queries in the URL instead of a request json.
- [x]  Refactor previous node part because of bug found in the code.
- [x]  Test new logic for node, with maxUpTillNow instead. In particular, run through the entire code for the rover.
- [x]  Check if data in datadump has been set back to 'newdata'.
- [x]  Modify docs to fulfill the new requirements, changes in update, start, node, methods, responses and requests.
- [x]  Conduct complete test on start, update and node methods. 
- [x]  Refactor the node URI for child and parent directions to work properly.
- [x]  Refactor weight using coordinate distance formula.
- [x]  Debug vertice return which adds to newdata even if that was a vertice we had visited before.
- [x]  TEST WEIGHT, I made changes to the checkoptions part, along with the let options and the new data addition part. Also added distance formula implementation for weight.
- [x]  Check if the last bullet point about response of update function has been implemented.
- [x]  Check that newdata is updated even when you encounter a node that you have been to before. 
- [x]  Add margin for error for node (width of the rover).

## Notes on Tasks

- As part of the response of the update method, the rover receives "options" for the node it is currently at. The decision needs to be stored in "childDirection" and sent as part of the next update post request. Since you are doing based on bearings, it should be in terms of degrees.
- Remember that the margin would be half of the "wingspan" of the rover because you want it to be like +- r.
- We know the end of the maze (furthest x or y coordinate - enter that in the frontend UI).
