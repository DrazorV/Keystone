const prefixs = require('../Modules/prefixs.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    command: function (message) {
        if(message.member.hasPermission("ADMINISTRATOR")){
            message.channel.send("Please ⌨ the new prefix: ");
            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
            collector.on("collect",prefix =>{
                prefixs[message.guild.name] = prefix.content;
                fs.writeFileSync(__dirname + "/prefixs.json", JSON.stringify(prefixs, null, "\t"), "utf8");
                console.log(prefix.content);
                message.channel.send("The new prefix is set to '" + prefixs[message.guild.name] + "'")
            });
        }else {
            message.channel.send("You need to be an admin to change the prefix of the bot.")
        }
    }
};