const fs = require('fs');
const k8s = require('@kubernetes/client-node');
const https = require('https');

const register = require('./register');
const generate = require('./generate');
const server = require('./server.js');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const controllerName = 'admitit';
const controllerNamespace = 'default';

if (!fs.existsSync('certs/ca.crt')) {
    generate.generateCerts('Admission SDK', 'Admission SDK', controllerName, controllerNamespace);
} else {
    console.log('skipping certificate creation');
}
register.registerNamespaced('admission.example.com', serviceName, serviceNamespace, kc, '', 'v1', ['CREATE'], 'pods')
    .then(() => console.log('admission controller created.'))
    .catch(err => console.log(err));

const options = {
    key: fs.readFileSync(`certs/${controllerName}-key.pem`),
    cert: fs.readFileSync(`certs/${controllerName}-crt.pem`)
};

https.createServer(options, server.serve).listen(8443);