const k8s = require('@kubernetes/client-node');
const fs = require('fs');

exports.unregisterNamespaced = function(controllerName, kc) {
  const admissionApi = kc.makeApiClient(k8s.AdmissionregistrationV1Api);
  return admissionApi.deleteValidatingWebhookConfiguration(controllerName);
}

exports.registerNamespaced = function(controllerName, serviceName, serviceNamespace, kc, apiGroup, apiVersion, operations, resource) {
    const admissionApi = kc.makeApiClient(k8s.AdmissionregistrationV1Api);

    const config = {
        apiVersion: 'admissionregistration.k8s.io/v1',
        kind: 'ValidatingWebhookConfiguration',
        metadata: {
            name: controllerName
        },
        webhooks: [{
            name: controllerName,
            failurePolicy: 'Fail',
            rules: [{
                apiGroups:   [apiGroup],
                apiVersions: [apiVersion],
                operations:  operations,
                resources:   [resource],
                scope:       'Namespaced'
            }],
            clientConfig: {
              service: {
                namespace: serviceNamespace,
                name: serviceName
              },
              caBundle: null,
            },
            admissionReviewVersions: ['v1', 'v1beta1'],
            sideEffects: 'None',
            timeoutSeconds: 5
        }]
      };
    config.webhooks[0].clientConfig.caBundle = fs.readFileSync('certs/ca.crt').toString('base64');
    return admissionApi.createValidatingWebhookConfiguration(config);    
}
