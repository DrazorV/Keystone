const Discord = require('discord.js');
const client = new Discord.Client();
var come = require('./Modules/come.js');
var help = require('./Modules/help.js');
var avatar = require('./Modules/avatar.js');
const porn = require('./Modules/porn.js');
const meme = require('./Modules/meme.js');
const ping = require('./Modules/ping.js');
const prefix = require('./Modules/prefix.js');
const defaultChannel = require('./Modules/defaultChannel.js');
var CronJob  = require('cron').CronJob;

client.on('warn', console.warn);

client.on('error', console.error);

const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);


client.on('ready',()=> {
    console.log("Keystone has been initialized...");
    client.user.setActivity("🍑Extra MyThicc🍑",{type: 'WATCHING'})
        .then(presence => console.log("Activity set to " + presence.game))
        .catch(console.error);

    if(process.env.channel!=="") {
        new CronJob('0 6 * * * *', function () {
            var guilds = client.guilds.array();
            while (guilds.length > 0) {
                var guil = guilds.pop();
                if (guil.channels.get(process.env.channel) != null) {
                    meme.schedule(guil.channels.get(process.env.channel));
                }

            }
        }, null, true);
    }
});

client.on("disconnect",() => console.log("I just disconnected, just making sure you know, I will reconnect now.."));

client.on("guildCreate", guild => {console.log("Joined a new guild: " + guild.name);});

client.on("guildDelete", guild => {console.log("Left a guild: " + guild.name)});

client.on('message', (message) => {
    // Our bot needs to know if it will execute a command
    if (!message.content.startsWith(process.env.prefix) || message.author.bot) return;
    if (message.content.substring(0,1) === process.env.prefix) {
        const args = message.content.slice(process.env.prefix.length).trim().split(/ +/g);
        let cmd = args.shift().toLowerCase();
        switch(cmd) {
            case 'ping':
                ping.command(message);
                break;
            case "come" :
                come.command(message);
                break;
            case "avatar":
                avatar.command(message);
                break;
            case "help":
                help.command(message,process.env.prefix);
                break;
            case "porn":
                porn.command(args,message);
                break;
            case "meme":
                meme.command(message);
                break;
            case "prefix":
                prefix.command(message);
                break;
            case "default":
                 defaultChannel.command(args[0],message);
                break;
        }
    }
});

client.login(process.env.TOKEN);