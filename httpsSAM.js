const https = require('https');
const fs = require('fs');
const cron = require('node-cron');
const dataManager = require('./modules/dataManager');
const config = require('./config.json');

class httpsSAM {
    constructor() {
        this.options = {
            key: fs.readFileSync(config.https.key),
            cert: fs.readFileSync(config.https.cert)
        };
        this.server = https.createServer(this.options, (req, res) => {
            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }
            else if (req.method === 'POST') {
                let body = '';
                req.on('data', (data) => {
                    body += data;
                });
                req.on('end', () => {
                    let data;
                    try {
                        data = JSON.parse(body);
                    }
                    catch (e) {
                        res.writeHead(400);
                        res.end();
                        console.log(e);
                        return;
                    }
                    if (data.sender === 'server') {
                        dataManager.serverData(data);// data is sent from server
                    }
                    else if (data.sender === 'user') {
                        // User is sending data
                        if (data.action === 'sendData') {
                            dataManager.userData(data);
                        }
                        else if (data.action === 'getServerData') {
                            let serverData = dataManager.getServerData();
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.write(JSON.stringify(serverData));
                            res.end();
                            return;
                        }
                    }
                    res.writeHead(200);
                    res.end();
                });
            }
            else if (req.method === 'GET') {
                let path = req.url.split('?')[0];
                if (path.endsWith('/')) path += 'index.html';
                console.log(`GET: ${path}`);
                fs.readFile(`./public${path}`, (err, data) => {
                    if (err) {
                        res.writeHead(404);
                        res.end();
                        return;
                    }
                    res.writeHead(200);
                    res.write(data);
                    res.end();
                });
            }
            else {
                res.writeHead(405);
                res.end();
            }
        });
        this.server.listen(config.https.port, () => {
            console.log(`HTTPS Server running on port ${config.https.port}`);
        });
    }
}

module.exports = httpsSAM;
