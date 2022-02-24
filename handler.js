exports.handle = (obj) => {
    const uid = obj.request.uid;
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
};
