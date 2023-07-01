# Todo List Project using the MERN Stack

### Setup: 
- Open up a terminal.
- `npm install`
- `node app.js` or `npm start`

### Testing out API calls: 
1) If you haven't already, download the `Thunder Client` extension in VSCode.
2) Create `New Request`.
3) Set the method of the request, `GET`, `POST`, `PUT`, `DELETE`, etc.
4) Give the approriate url. The url will be `http://localhost:PORT/ENDPOINT`. The port used by this application is `5000`. The endpoints are all available in `app.js`.
5) For the `POST` and `PUT` methods where we are taking information from the client, go to `Body` -> `Form-encoded` and create key/value pairs for `firstName`, `lastName`, `year` and `subject`.
6) Click on `Send`. If you get a status `200`, it means your request was successful, any other status code means there is an error. `500` will be a server error, `404` may mean that the URL you specified does not exist (maybe a typo).

<hr/>

## UPDATES
- Added `start` script in `package.json` to allow the use of a live server.

- `Completed` task route:
  - In the SQL query, changed `completed = 1` to `completed = NOT completed` to allow toggling between statuses.
  
## TODO: 
- Check all todo controllers. Authorisation has been enabled with sessions but when doing an API call `409` HTPP status gets returned. (is it maybe something that has to do with Thunder Client?)