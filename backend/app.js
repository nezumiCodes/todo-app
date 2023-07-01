require('dotenv').config({path: './config/secret.env'});
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const cookieParser = require('cookie-parser');
const fileup = require('express-fileupload');
const db = require('./config/database'); // require the database connection file (.js)

const app = express();
const port = 5000;

// Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cookie Parser Middleware
app.use(cookieParser(process.env.SESSION_KEY));

// File upload Middleware
app.use(fileup());

// TODO:
// Set up a session database and configure active sessions based on express-session-sqlite
// https://nwcourses.github.io/COM518/topic8.html
// Configuring session middleware
app.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_KEY, 
    resave: false, // regenerate session on each request to keep in active
    saveUninitialized: false, 
    rolling: true, 
    unset: 'destroy', 
    proxy: true, // allow session cookies to pass through proxy servers -- for production 
    cookie: {
      path: '/',
      maxAge: 600000, // in ms
      httpOnly: false, // allow client-side code to access the session cookies, 
      secure: false // set true only when using HTTPS
    },
    store: new SQLiteStore({db: 'sessions.db', concurrentDB: true}) // concurrentDB allows for multiple DB connections to be created simultaneously
  })
);

// Mount routes
const todoRoutes = require('./server/routes/todo');
const userRoutes = require('./server/routes/user');
app.use('/', todoRoutes);
app.use('/', userRoutes);

// Listen to port 
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

