const Discord = require('discord.js');
const embed = new Discord.RichEmbed();

module.exports = {
    command: function (message) {
        embed.setColor(0x2ed32e);
        embed.setTimestamp(new Date());
        embed.setFooter("Automated message", message.guild.iconURL);
        message.channel.send("Pinging ...")
            .then((msg) => {

                msg.delete();
                embed.addField("⏱Server" ,Math.round(message.client.ping) + ' ms');
                embed.addField("⌛Keystone" , message.createdTimestamp - Date.now() - 1000 + ' ms');
                message.channel.send(embed);
            })
    }
};