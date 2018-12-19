const Discord = require('discord.js');
const client = new Discord.Client();
const come = require('./Modules/come.js');
const help = require('./Modules/help.js');
const avatar = require('./Modules/avatar.js');
const porn = require('./Modules/porn.js');
const meme = require('./Modules/meme.js');
const ping = require('./Modules/ping.js');
const prefix = require('./Modules/prefix.js');
const defaultChannel = require('./Modules/defaultChannel.js');
const CronJob  = require('cron').CronJob;
const prefixs = require(__dirname + "/Modules/prefixs.json");
const fs = require('fs');
const guilds = require(__dirname + "/Modules/guilds.json");
const http = require('http');
const express = require('express');
const app = express();
const webhook = require('./Modules/webhooks.js');

app.get("/", (request, response) => {
    console.log(Date.now() + " Ping Received");
    response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

client.on('warn', console.warn);
client.on('error', console.error);

client.on('ready',()=> {
    console.log("Keystone has been initialized...");
    client.user.setActivity("🍑Extra MyThicc🍑",{type: 'WATCHING'})
        .then(presence => console.log("Activity set to " + presence.game))
        .catch(console.error);
    new CronJob('0 20 * * *', function () {
        defaultChannel.job(client)
    },null, true)
});


client.on("disconnect",() => console.log("I just disconnected, just making sure you know, I will reconnect now.."));

client.on("guildCreate", guild => {
    prefixs[guild.name] = "/";
    guilds[guild.name] = "";
    fs.writeFileSync(__dirname + "/Modules/guilds.json",JSON.stringify(guilds,null,"\t"),"utf8");
    fs.writeFileSync(__dirname + "/Modules/guilds.json",JSON.stringify(prefixs,null,"\t"),"utf8");
    console.log("Joined a new guild: " + guild.name);
    console.log(prefixs);
});

client.on("guildDelete", guild => {console.log("Left a guild: " + guild.name)});

client.on('message', (message) => {
    // Our bot needs to know if it will execute a command
  if(message.channel.type !== "dm") {
    if (!message.content.startsWith(prefixs[message.guild.name]) || message.author.bot) return;
    if (message.content.substring(0,1) === prefixs[message.guild.name]) {
        const args = message.content.slice(prefixs[message.guild.name].length).trim().split(/ +/g);
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
                help.command(message,prefixs[message.guild.name]);
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
            case "webhook":
                webhook.command(message);
                break;
        }
    }
  }
});

//client.login(process.env.TOKEN).catch(error => console.log(error));