const register = require('./register.js');
const installer = require('./installer.js');
const k8s = require('@kubernetes/client-node');

const controllerName = 'admitit';
const controllerNamespace = 'default';
const controllerDomain = 'admission.example.com';
const apiGroup = '';
const apiVersion = 'v1';
const verbs = ['CREATE'];
const resource = 'pods';
const imageName = 'burns.azurecr.io/admission-sdk:v14';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

installer.install(controllerName, controllerNamespace, imageName, kc)
    .then(() => console.log('admission service created.'))
    .catch(err => console.log(err));

// TODO: Actually validate that the deployment and service our healthy instead of just sleeping.
// This is a hack.
setTimeout(() => {
    register.registerNamespaced(controllerDomain, controllerName, controllerNamespace, kc, apiGroup, apiVersion, verbs, resource)
        .then(() => console.log('admission controller created.'))
        .catch(err => console.log(err));
}, 1000);

