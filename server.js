const handler = require('./handler');

exports.serve = (req, res) => {
    console.log(req.body);
    console.log(req.method);

    let objStr = '';
    req.on('data', chunk => {
        objStr += chunk;
    })
    req.on('end', () => {
        console.log(objStr);
        const obj = JSON.parse(objStr);
        const result = handler.handle(obj);

        res.writeHead(200);
        res.end(JSON.stringify(result));
    });
}
