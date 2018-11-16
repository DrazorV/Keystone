const Discord = require('discord.js');
const embed = new Discord.RichEmbed();




module.exports = {
    command: function (message,prefix) {
        embed.setTitle("List of Commands 📋");
        embed.setColor([255,90,0]);
        embed.addField(prefix +"come @mention","🤙 Informs one or more server members that you are waiting for them in one of the voice channels",false);
        embed.addField(prefix + "avatar @mention","🎴 Gives you a link with his avatar",false);
        embed.addField(prefix + "ping","🏓 Starts a crazy ping-pong game",false);
        embed.addField(prefix + "prefix","🏷️ Lets you change the default prefix",false);
        embed.setTimestamp(new Date());
        embed.setFooter("Automated message", message.guild.iconURL);
        message.channel.send(embed);
    }
};