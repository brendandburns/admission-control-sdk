exports.install = (controllerName, controllerNamespace, imageName, kc) => {
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
                    imagePullSecrets: [{
                        name: 'pull-secret'
                    }],
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

    appsApi.createNamespacedDeployment(controllerNamespace, deployment)
        .then(() => console.log('admission deployment created.'))
        .catch(err => console.log(err));

    coreApi.createNamespacedService(controllerNamespace, service)
        .then(() => console.log('admission service created.'))
        .catch(err => console.log(err));
}

exports.uninstall = (controllerName, controllerNamespace, kc) => {
    const appsApi = kc.makeApiClient(k8s.AppsV1Api);
    const coreApi = kc.makeApiClient(k8s.CoreV1Api);

    appsApi.deleteNamespacedDeployment(controllerName, controllerNamespace)
        .then(() => console.log('admission deployment deleted.'))
        .catch(handleError);

    coreApi.deleteNamespacedService(controllerName, controllerNamespace)
        .then(() => console.log('admission service deleted.'))
        .catch(handleError);
}