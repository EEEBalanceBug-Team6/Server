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
- [x]  In the client datadump method, you need to reset the newdata object to a blank version of it because of the updation requirements.
- [x]  Put requests into data structure (Graph? Tree equivalent?).
- [x]  Add a POST request that also adds data to the “data” json.
- [x]  Extend API contract with the methods needed for ESP32 communication.
- [x]  Test the checkOptions function.
- [x]  Finish the update and turn methods. (Added the turn as a response to the node method)
- [x]  Add code for backtracking of the rover in case it encounters a node it has seen before.(This is done with a boolean)
- [x]  Write Dijkstra’s Algorithm equivalent on data structure in javascript.
- [x]  Test the Dijkstra's code using the debug statements recently added.
- [ ]  Check if the last bullet point about response of update function has been implemented.
- [ ]  Check that newdata is updated even when you encounter a node that you have been to before. 
- [ ]  Send output of data structure to database.
- [ ]  Refactor the node, start and update methods with sam's suggestions. 
- [ ]  Use the Math triangulation module to check what the location is, 2 or 3 beacons depending on the compass module.

## Notes on Tasks

- As part of the response of the update method, the rover receives "options" for the node it is currently at. The decision needs to be stored in "childDirection" and sent as part of the next update post request. Since you are doing based on bearings, it should be in terms of degrees.
- Another thing to note as Sam said: Weights are not needed to be sent as part of the request and can be deduced from the 
previous node (offset of the x or y coordinate). The decision to take a turn should be sent as part of the response to turn 
maybe? Depends on the last option not yet considered.
