const fs = require('fs');
const k8s = require('@kubernetes/client-node');
const https = require('https');

const register = require('./register');
const generate = require('./generate');
const server = require('./server.js');

const options = {
    key: fs.readFileSync(`certs/${controllerName}-key.pem`),
    cert: fs.readFileSync(`certs/${controllerName}-crt.pem`)
};

https.createServer(options, server.serve).listen(8443);