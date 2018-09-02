const express = require('express');
const path = require('path');
const favicon = require('static-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocketServer = require('ws').Server;
const Models = require('./models/Models.js');
const database = require('./database/database.js');
const cors = require('cors');
const userRoute = require('./api/routes/users.js');
const loginRoute = require('./api/routes/login.js');
const searchRoute = require('./api/routes/search.js');
const channelRoute = require('./api/routes/channels.js');
const messageRoute = require('./api/routes/messages.js');
const registerRoute = require('./api/routes/register.js');
const logoutRoute = require('./api/routes/logout.js');
//////////////////////////////////CREATE SERVER/////////////////////////////////////////
var app = express();
app.server = http.createServer(app);
//////////////////////////////////////////////////////////////////////////////////////

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

//////////////////////////////////////////////////////////////////////////////////////
app.wss = new WebSocketServer({
    server: app.server,
})
//////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////CREATE MODELS/////////////////////////////////////////
app.models = new Models(app);
//////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////CREATE DATABASE//////////////////////////////////////
database.connect().then((db) => {
    console.log("connect database success");
    app.db = db;
}).catch((err) => {
    throw(err);
})

///////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////CREATE ROUTER/////////////////////////////////////////
userRoute(app);
loginRoute(app);
searchRoute(app);
channelRoute(app);
messageRoute(app);
registerRoute(app);
logoutRoute(app);
///////////////////////////////////////////////////////////////////////////////////


app.server.listen(process.env.PORT || 3001, () => {
    console.log(`App running on port: ${app.server.address().port}`);
});


module.exports = app;
