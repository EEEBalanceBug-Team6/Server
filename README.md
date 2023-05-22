# Node Server

## Important links

- **GitHub:** https://github.com/hakanmerdan/EEEBalanceBug.git
- **ESP32 + Node Server:** https://community.appinventor.mit.edu/t/node-js-web-server-in-pc-esp32-esp8266-sensor-temp-humd-batch-file-windows/38322
- **Redis Database:** https://redis.io/docs/clients/nodejs/
- **ExpressJs Website:** https://expressjs.com/
- **sendFile function:** https://www.geeksforgeeks.org/express-js-res-sendfile-function/
- **Filesystem nodejs:** https://www.w3schools.com/nodejs/nodejs_filesystem.asp
- **Routing:** https://expressjs.com/en/guide/routing.html#route-parameters

## Tasks

- [x]  Understand basic express routing.
- [x]  Add responses to the basic API calls as shown in the API contract at https://github.com/EEEBalanceBug-Team6/docs.
- [ ]  Extend API contract with the methods needed for ESP32 communication
- [x]  In the client datadump method, you need to reset the newdata object to a blank version of it because of the updation requirements
- [ ]  Add a POST request that also adds data to the “data” json.
- [ ]  Send dummy requests (XML) to the server to check functionality: [https://kinsta.com/knowledgebase/javascript-http-request/](https://kinsta.com/knowledgebase/javascript-http-request/)
- [ ]  Create placeholder functions that interact with ESP32 for movement (Based on feedback from the server).
- [ ]  Understand subprocess creation for interacting with Python files for Dijkstra's Algorithm.
- [x]  Put requests into data structure (Graph? Tree equivalent?).
- [ ]  Send output of data structure to database, also send it to frontend to render the map.
- [ ]  Write Dijkstra’s Algorithm equivalent on data structure in javascript.

## Notes on Tasks

- Note that you can’t use writeHead and send together, if you want to send a particular header then you need to send 200 only.
- The tricky bit for the addEdge() function will be to figure out what the edge actually is and in what order it would need to be added. This can probably be done based on the id key in the object? Try drawing a few cases out to check.
- To solve this I have added previousNode which is basically the last node we had traversed to. An edge can be created from the previous node to the next node, weights are sent as part of the query. Note that previousNode will need to be reassigned everytime the node method is called.
- Create a python file and populate a variable with a list of lists of edges. Use Dijkstra's algorithm to create and solve the shortest path tree in the python file and then pipe these values back to the javascript file.
- Use req.body to parse the json in the POST methods.
