const meme = require("../../app/commands/meme");
const stats = require("../../app/commands/stats");
const CronJob  = require('cron').CronJob;
const Keyv = require("keyv");
const db = new Keyv('sqlite://json.sqlite', {
    table:"Server",
});

const ServerStats = new Keyv('sqlite://json.sqlite', {
    table:"ServerStats",
});


module.exports = async client =>{
    let clans = client.guilds.cache.array();
    while (clans.length > 0) {
        let clan = clans.pop();
        if (await db.get(`Server_${clan.id}`) === undefined){
            await db.set(`Server_${clan.id}`, {
                prefix:"/",
                meme: "",
                food: ""
            })
        }
        if (await ServerStats.get(`Stats_${clan.id}`) === undefined){
            await ServerStats.set(`Stats_${clan.id}`, {
                guildId: clan.id,
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

    new CronJob('30 * * * * *', function () {
        stats.job(client)
    },null, true);
};