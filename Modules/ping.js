const Discord = require('discord.js');


module.exports = {
    command: function (message) {
        const embed = new Discord.RichEmbed();
        embed.setColor(0x2ed32e);
        embed.setTimestamp(new Date());
        embed.setFooter("Automated message", message.guild.iconURL);
        message.channel.send("Pinging ...")
            .then((msg) => {
                      msg.delete()
            });
        embed.addField("⏱Server" ,Math.round(message.client.ping) + ' ms');
        embed.addField("⌛Keystone" , Date.now() - message.createdTimestamp + ' ms');
        message.channel.send(embed);
    }
};