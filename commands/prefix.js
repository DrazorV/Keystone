const prefixs = require('../data/prefixs.json');
const fs = require('fs');
const Discord = require('discord.js');

exports.run = async (client,message,args)=>{
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You need to be an admin to change the prefix of the bot.");
    message.channel.send("💻 Please type the new prefix");
    const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {maxMatches: 1, time: 15000 });
    collector.on("collect",prefix => {
        prefixs[message.guild.id] = prefix.content;
        fs.writeFileSync('./data/prefixs.json', JSON.stringify(prefixs, null, "\t"), "utf8");
    });
    collector.on("end",received => {
        if (received.array().length===0) message.channel.send("I've got tired of waiting! 😫 \nPlease try again! 🔁");
        else message.channel.send("🎉 The 🆕 prefix is set to \"" + prefixs[message.guild.id] + "\"");
    });
};