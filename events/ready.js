const meme = require("../../app/commands/meme");
const stats = require("../../app/commands/stats");
const CronJob  = require('cron').CronJob;
const prefixs = require('../data/prefixs.json');
const guilds = require('../data/guilds.json')
const fs = require('fs')


module.exports = async client =>{
    let clans = client.guilds.cache.array();
    while (clans.length > 0) {
        let clan = clans.pop();
        if (stats[clan.id] === undefined){
            stats[clan.id] = ["false","","","","",""]
            prefixs[clan.id] = "/";
            guilds[clan.id] = "";
            fs.writeFileSync(__dirname + "..\\..\\data\\guilds.json",JSON.stringify(guilds,null,"\t"),"utf8");
            fs.writeFileSync(__dirname + "..\\..\\data\\guilds.json",JSON.stringify(prefixs,null,"\t"),"utf8");
            fs.writeFileSync(__dirname + "..\\..\\data\\guilds.json",JSON.stringify(stats,null,"\t"),"utf8");
        }
    }

    console.log("Keystone has been initialized...");
    client.user.setActivity("🍑Extra Mythicc🍑",{type: 'WATCHING'})
        .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
        .catch(console.error);
    new CronJob('0 0 18 * * *', function () {
        meme.job(client)
    },null, true);

    new CronJob('*/1 * * * *', function () {
        stats.job(client)
    },null, true);

};