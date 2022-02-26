const fs = require('fs');
const shelljs = require('shelljs');

const imageName = 'burns.azurecr.io/test:v1';
const controllerName = 'admitit';
const controllerNamespace = 'default';
const organization = 'Admission SDK';
const caName = organization;

if (!fs.existsSync('certs/ca.crt')) {
    generate.generateCerts(organization, caName, controllerName, controllerNamespace);
} else {
    console.log('skipping certificate creation');
}

shelljs.exec(`docker build -t ${imageName} .`, { env: { ADMIT_NAME: controllerName } });
shelljs.exec(`docker push ${imageName}`);


