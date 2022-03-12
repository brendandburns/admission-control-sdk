const k8s = require('@kubernetes/client-node');
const admit = require('admission-sdk');
const installer = admit.installer;
const register = admit.register;

const controllerName = 'admitit';
const controllerNamespace = 'default';
const controllerDomain = 'admission.example.com';
const apiGroup = '';
const apiVersion = 'v1';
const verbs = ['CREATE'];
const resource = 'pods';
const imageName = 'burns.azurecr.io/test:v2';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const secrets = [{ name: 'pull-secret' }];

installer.install(controllerName, controllerNamespace, imageName, secrets, kc)
    .then(() => console.log('admission service created.'))
    .catch(err => console.log(err));

// TODO: Actually validate that the deployment and service our healthy instead of just sleeping.
// This is a hack.
setTimeout(() => {
    register.registerNamespaced(controllerDomain, controllerName, controllerNamespace, kc, apiGroup, apiVersion, verbs, resource)
        .then(() => console.log('admission controller created.'))
        .catch(err => console.log(err));
}, 1000);

