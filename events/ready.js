const meme = require("../../app/commands/meme");
const stats = require("../../app/commands/stats");
const CronJob  = require('cron').CronJob;
const db = require('quick.db');
const Server = new db.table('Server',null);


module.exports = async client =>{
    let clans = client.guilds.cache.array();
    while (clans.length > 0) {
        let clan = clans.pop();
        if (Server.fetch(`Server_${clan.id}`) === null){
            Server.set(`Server_${clan.id}`, {
                prefix: "/",
                default: "",
            })
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