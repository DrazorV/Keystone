const defaults = require("../commands/setdefault");
const CronJob  = require('cron').CronJob;
const http = require('http');
const app = require('express')();


module.exports = async client =>{
    console.log("Keystone has been initialized...");
    client.user.setActivity("🍑Extra MyThicc🍑",{type: 'WATCHING'})
        .then(presence => console.log("Activity set to " + presence.game))
        .catch(console.error);
    new CronJob('0 0 18 * * *', function () {
        defaults.job(client)
    },null, true);

    app.get("/", (request, response) => {
        console.log(Date.now() + " Ping Received");
        response.sendStatus(200);
    });
    app.listen(process.env.PORT);
    setInterval(() => {
        http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
    },280000);

};