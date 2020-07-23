const prefixs = require('../data/prefixs.json');
const fs = require('fs');

exports.run = async (client,message,args)=>{
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You need to be an admin to change the prefix of the bot.");
    await message.channel.send("💻 Please type the new prefix");
    message.channel.awaitMessages(m => m.author.id === message.author.id, {max: 1, time: 30000}).then(collected => {
        prefixs[message.guild.id] = collected.first().content;
        fs.writeFileSync('./data/prefixs.json', JSON.stringify(prefixs, null, "\t"), "utf8");
        message.channel.send("🎉 The 🆕 prefix is set to \"" + prefixs[message.guild.id] + "\"");
    }).catch(()=>{
        message.channel.send("I've got tired of waiting! 😫 \nPlease try again! 🔁");
    })
};