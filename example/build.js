const fs = require('fs');
const admit = require('admission-sdk');
const generate = admit.generate;

const imageName = 'burns.azurecr.io/test:v2';
const controllerName = 'admitit';
const controllerNamespace = 'default';
const organization = 'Admission SDK';
const caName = organization;

if (!fs.existsSync('certs/ca.crt')) {
    generate.generateCerts(organization, caName, controllerName, controllerNamespace);
} else {
    console.log('skipping certificate creation');
}

generate.build(imageName, controllerName);


