const k8s = require('@kubernetes/client-node');

exports.install = (controllerName, controllerNamespace, imageName, imageSecrets, kc) => {
    const deployment = {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
            name: controllerName,
            namespace: controllerNamespace
        },
        spec: {
            selector: {
                matchLabels: {
                    app: controllerName
                }
            },
            replicas: 1,
            template: {
                metadata: {
                    labels: {
                        app: controllerName
                    }
                },
                spec: {
                    imagePullSecrets: imageSecrets,
                    containers: [{
                        name: controllerName,
                        image: imageName,
                        command: ['node', '/index.js']
                    }]
                }
            }
        }
    }

    const service = {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: {
            name: controllerName,
            namespace: controllerNamespace
        },
        spec: {
            selector: {
                app: controllerName
            },
            ports: [{
                name: controllerName,
                port: 443,
                targetPort: 8443
            }]
        }
    }

    const appsApi = kc.makeApiClient(k8s.AppsV1Api);
    const coreApi = kc.makeApiClient(k8s.CoreV1Api);

    const p1 = appsApi.createNamespacedDeployment(controllerNamespace, deployment);
    const p2 = coreApi.createNamespacedService(controllerNamespace, service);

    return Promise.all([p1, p2]);
}

exports.uninstall = (controllerName, controllerNamespace, kc) => {
    const appsApi = kc.makeApiClient(k8s.AppsV1Api);
    const coreApi = kc.makeApiClient(k8s.CoreV1Api);

    const p1 = appsApi.deleteNamespacedDeployment(controllerName, controllerNamespace);
    const p2 = coreApi.deleteNamespacedService(controllerName, controllerNamespace);

    return Promise.all([p1, p2]);
}