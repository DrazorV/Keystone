const winston = require('../utils/winston');
const meme = require("../commands/meme");
const stats = require("../commands/stats");
const CronJob  = require('cron').CronJob;
const Keyv = require("keyv");
const food = require("../commands/food");

const db = new Keyv('sqlite://json.sqlite', {
    table:"Server",
});

const ServerStats = new Keyv('sqlite://json.sqlite', {
    table:"ServerStats",
});

module.exports = async client =>{
    client.users.cache.get("183890143525076992").send("Restarted")
    let clans = client.guilds.cache.array();
    while (clans.length > 0) {
        let clan = clans.pop();
        if (await db.get(`Server_${clan.id}`) === undefined){
            await db.set(`Server_${clan.id}`, {
                prefix:"-",
                meme: "",
                food: ""
            })
        }
        if (await ServerStats.get(`Stats_${clan.id}`) === undefined){
            await ServerStats.set(`Stats_${clan.id}`, {
                guildId: clan.id,
                totUsers: undefined,
                memberCount: undefined,
                botCount: undefined,
                online: undefined,
                categoryId: undefined
            })
        }
    }

    winston.info("Keystone has been initialized...");
    client.user.setActivity("🍑Extra Mythicc🍑",{type: 'WATCHING'})
        .then(presence => winston.info(`Activity set to ${presence.activities[0].name}`))
        .catch(winston.error);

    new CronJob('0 0 18 * * *', function () {
        meme.job(client)
    },null, true);

    new CronJob('0 0 18 * * *', function () {
        food.job(client)
    },null, true);

    new CronJob('30 * * * * *', function () {
        stats.job(client)
    },null, true);
};