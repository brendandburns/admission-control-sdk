const admit = require('admission-sdk');
const server = admit.server;

server.serve('admitit', (obj) => {
    const uid = obj.request.uid;
    console.log(obj);
    return {
        apiVersion: 'admission.k8s.io/v1',
        kind: 'AdmissionReview',
        response: {
            uid: uid,
            allowed: true,
            status: {
                code: 200,
                message: 'OK',
            },
        },
    };
});
