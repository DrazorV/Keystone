const Discord = require('discord.js');

exports.run = async (client,message,args)=>{
    const embed = new Discord.MessageEmbed();
    embed.setColor(0x2ed32e);
    embed.setTimestamp(new Date());
    embed.setFooter("Automated message", message.guild.iconURL);
    message.channel.send("Pinging ...").then((msg) => msg.delete());
    embed.addField("⏱Server" ,Math.round(message.client.ws.ping) + ' ms');
    embed.addField("⌛Keystone" , Date.now() - message.createdTimestamp + ' ms');
    await message.channel.send(embed);
};