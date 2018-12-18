const guilds = require(__dirname + "/guilds.json");
const meme = require("../Modules/meme.js");

module.exports = {
    command: function (channel,message) {
        if(message.member.hasPermission("ADMINISTRATOR")) {
            const fs = require('fs');
            const channels = message.guild.channels.array();
            while (channels.length > 0) {
                const target = channels.pop();
                if ((channel === target.name) || (channel === target.id)) {
                    guilds[message.guild.name] = target.id;
                    fs.writeFileSync(__dirname + "/guilds.json", JSON.stringify(guilds,null,"\t"), "utf8");
                    target.send("This is the default channel for memes.");
                    return;
                }
            }
            message.channel.send("This channel does not exist!");
        }else{
            message.channel.send("You need to be an admin to change the prefix of the bot.")
        }
    },
    job: function (client) {
        let clans = client.guilds.array();
        while (clans.length > 0){
            let clan = clans.pop();
            JSON.stringify(guilds);
            if(guilds[clan.name]!==""){
                meme.schedule(clan.channels.get(guilds[clan.name]));
            }
        }
    }

};