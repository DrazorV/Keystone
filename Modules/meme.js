const Discord = require('discord.js');
const embed = new Discord.RichEmbed();
const meme = require('memejsfork');



module.exports = {
    command: function (message) {
        meme(function(data) {
            embed.setURL("https://www.reddit.com/r/"+data.subreddit[0]);
            embed.setDescription(data.title[0]);
            embed.setImage(data.url[0]);
            embed.setTitle("Here is the meme you ordered! 📦");
            embed.setColor(message.member.colorRole.color);
            embed.setTimestamp(new Date());
            embed.setFooter("Automated message", message.guild.iconURL);
            message.channel.send(embed);
        });
    }
};
