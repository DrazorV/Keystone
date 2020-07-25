const db = require('quick.db');
const Server = new db.table('Server',null);
let prefix

exports.run = async (client,message,args)=>{
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You need to be an admin to change the prefix of the bot.");
    await message.channel.send("💻 Please type the new prefix");
    message.channel.awaitMessages(m => m.author.id === message.author.id, {max: 1, time: 30000}).then(collected => {
        prefix = collected.first().content;
        Server.set(`Server_${message.guild.id}.prefix`, prefix)
        message.channel.send("🎉 The 🆕 prefix is set to \"" + prefix + "\"");
    }).catch(()=>{
        message.channel.send("I've got tired of waiting! 😫 \nPlease try again! 🔁");
    })
};