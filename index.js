const discordSAM = require('./discordSAM');
const httpsSAM = require('./httpsSAM');
const fs = require('fs');
const cron = require('node-cron');
const dataManager = require('./modules/dataManager');
const config = require('./config.json');

class SAM {
    constructor() {
        this.discordJS = new discordSAM();
        this.https = new httpsSAM();
    }
}

const sam = new SAM();
