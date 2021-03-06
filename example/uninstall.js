const k8s = require('@kubernetes/client-node');
const admit = require('admission-sdk');
const register = admit.register;
const installer = admit.installer;

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const controllerName = 'admitit';
const controllerNamespace = 'default';
const controllerDomain = 'admission.example.com';

function handleError(err) { if (err.statusCode != 404) console.log(err) };

register.unregisterNamespaced(controllerDomain, kc)
    .then(() => console.log('admission controller unregistered'))
    .catch(handleError);

// TODO: this is a hack to make sure the controller is unregistered before
// we try to delete, in case it affects the deletes.

setTimeout(() => {
    installer.uninstall(controllerName, controllerNamespace, kc)
        .then(() => console.log('admission service deleted'))
        .catch(handleError);
}, 1000);

