const fs = require('fs');
module.exports = class DataManager {
    constructor() {
        this.discordServerData = JSON.parse(fs.readFileSync('./data/discordServerData.json', 'utf8'));
        this.minecraftServerData = JSON.parse(fs.readFileSync('./data/minecraftServerData.json', 'utf8'));
    }
    set discordServerData(data) {
        this._discordServerData = data;
        fs.writeFileSync('./data/discordServerData.json', JSON.stringify(data, null, 4), 'utf8');
    }
    get discordServerData() {
        return this._discordServerData;
    }
    set minecraftServerData(data) {
        this._minecraftServerData = data;
        fs.writeFileSync('./data/minecraftServerData.json', JSON.stringify(data, null, 4), 'utf8');
    }
    get minecraftServerData() {
        return this._minecraftServerData;
    }
}
