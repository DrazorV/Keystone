const guilds = require(__dirname + "/guilds.json");
const fs = require("fs");

module.exports = {
    command: function (channel,message) {
        const fs = require('fs');
        const channels = message.guild.channels.array();
        while (channels.length > 0) {
            const target = channels.pop();
            if ((channel === target.name) || (channel === target.id)) {
                guilds[message.guild.name] = target.id;
                fs.writeFileSync(__dirname + "/guilds.json",JSON.stringify(guilds,null," "),"utf8");
                target.send("This is the default channel for memes.");
                return;
            }
        }
        message.channel.send("This channel does not exist!");
    }
};