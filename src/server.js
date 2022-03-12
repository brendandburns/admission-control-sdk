const https = require('https');
const fs = require('fs');

exports.serve = (controllerName, handler) => {
    const options = {
        key: fs.readFileSync(`certs/${controllerName}-key.pem`),
        cert: fs.readFileSync(`certs/${controllerName}-crt.pem`)
    };
    
    https.createServer(options, (req, res) => {    
        let objStr = '';
        req.on('data', chunk => {
            objStr += chunk;
        })
        req.on('end', () => {
            const obj = JSON.parse(objStr);
            const result = handler(obj);
    
            res.writeHead(200);
            res.end(JSON.stringify(result));
        });
    }).listen(8443);
}
