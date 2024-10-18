"use strict";

const express = require("express");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const session = require("express-session");
// const csrf = require('csurf');
const consolidate = require("consolidate"); // Templating library adapter for Express
const swig = require("swig");
// const helmet = require("helmet");
const MongoClient = require("mongodb").MongoClient; // Driver for connecting to MongoDB
const http = require("http");
const marked = require("marked");
//const nosniff = require('dont-sniff-mimetype');
const app = express(); // Web framework to handle routing requests
const routes = require("./app/routes");
const { port, db, cookieSecret } = require("./config/config"); // Application config properties
/*
// Fix for A6-Sensitive Data Exposure
// Load keys for establishing secure HTTPS connection
const fs = require("fs");
const https = require("https");
const path = require("path");
const httpsOptions = {
    key: fs.readFileSync(path.resolve(__dirname, "./artifacts/cert/server.key")),
    cert: fs.readFileSync(path.resolve(__dirname, "./artifacts/cert/server.crt"))
};
*/

(err, db) => {
    if (err) {
        console.log("Error: DB: connect");
        console.log(err);
        process.exit(1);
    }
    console.log(`Connected to the database`);

    app.disable("x-powered-by");
    app.use(helmet.frameguard());
    app.use(helmet.noCache());
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "trusted-cdn.com"],
            styleSrc: ["'self'", "trusted-cdn.com"],
        }
    }));
    app.use(helmet.hsts({
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    }));
    app.use(helmet.xssFilter({ setOnOldIE: true }));
    app.use(nosniff());

    app.use(favicon(path.join(__dirname, 'app', 'assets', 'favicon.ico')));
    app.use(bodyParser.json({ limit: '1mb' }));
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(session({
        secret: cookieSecret,
        saveUninitialized: true,
        resave: true,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        }
    }));

    app.use(csrf());
    app.use((req, res, next) => {
        res.locals.csrfToken = req.csrfToken();
        next();
    });

    app.engine(".html", consolidate.swig);
    app.set("view engine", "html");
    app.set("views", path.join(__dirname, 'app', 'views'));
    app.use(express.static(path.join(__dirname, 'app', 'assets')));

    marked.setOptions({
        sanitize: false
    });
    app.locals.marked = marked;

    routes(app, db);

    swig.setDefaults({
        autoescape: true
    });

    const options = {
        key: fs.readFileSync('/path/to/key.pem'),
        cert: fs.readFileSync('/path/to/cert.pem')
    };

    https.createServer(options, app).listen(port, () => {
        console.log(`Express https server listening on port ${port}`);
    });
}


}



}




































