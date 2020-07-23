const defaults = require("../../app/commands/setdefault");
const CronJob  = require('cron').CronJob;
const stats = require("../../app/commands/stats");


module.exports = async client =>{
    console.log("Keystone has been initialized...");
    client.user.setActivity("🍑Extra MyThicc🍑",{type: 'WATCHING'})
        .then(presence => console.log("Activity set to " + presence.game))
        .catch(console.error);
    new CronJob('0 0 18 * * *', function () {
        defaults.job(client)
    },null, true);

    new CronJob('*/1 * * * *', function () {
        stats.job(client)
    },null, true);
};