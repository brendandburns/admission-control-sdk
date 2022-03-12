const shelljs = require('shelljs');
const fs = require('fs');

exports.generateCerts = function (org, caName, serviceName, serviceNamespace) {
    fs.writeFileSync('certs/ext.txt', `subjectAltName = DNS:${serviceName}, DNS:${serviceName}.${serviceNamespace}.svc\n`);

    const commands = [
        'openssl genrsa -out certs/ca.key 2048',
        `openssl req -new -x509 -days 365 -key certs/ca.key -subj "/C=US/ST=WA/O=${org}/CN=${caName}" -out certs/ca.crt`,
        `openssl req -newkey rsa:2048 -nodes -keyout certs/${serviceName}-key.pem -subj "/C=US/ST=WA/O=${org}/CN=${serviceName}.${serviceNamespace}.svc" -out certs/${serviceName}.csr`,
        `openssl x509 -req -extfile certs/ext.txt -days 365 -in certs/${serviceName}.csr -CA certs/ca.crt -CAkey certs/ca.key -CAcreateserial -out certs/${serviceName}-crt.pem`
    ]

    commands.forEach((cmd) => shelljs.exec(cmd));

    const paths = [
        `certs/ext.txt`,
        `certs/${serviceName}.csr`,
        'certs/ca.srl'
    ]
    paths.forEach((path) => fs.rmSync(path));
}

exports.build = (imageName, controllerName) => {
    shelljs.exec(`docker build -t ${imageName} .`, { env: { ADMIT_NAME: controllerName } });
    shelljs.exec(`docker push ${imageName}`);
}