const prefixs = require('../data/prefixs.json');
const fs = require('fs');
const Discord = require('discord.js');

exports.run = async (client,message,args)=>{
    if(message.member.hasPermission("ADMINISTRATOR")){
        message.channel.send("Please ⌨ the new prefix: ");
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
        if(collector.ended) if(collector.received === 0) message.channel.send("I got tired of waiting! Please start again.");
        collector.on("collect",prefix => {
            prefixs[message.guild.name] = prefix.content;
            fs.writeFileSync('./data/prefixs.json', JSON.stringify(prefixs, null, "\t"), "utf8");
            console.log(prefix.content);
            message.channel.send("The new prefix is set to '" + prefixs[message.guild.name] + "'");
        });
    }else {
        message.channel.send("You need to be an admin to change the prefix of the bot.")
    }
};