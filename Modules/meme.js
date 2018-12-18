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
            embed.setFooter("Automated message", "https://cdn.discordapp.com/icons/308903005875470338/a306375be4d56f9dd85c5321f3f92343.jpg");
            message.channel.send(embed);
        });
    },
    schedule: function (channel) {
        meme(function (data) {
            embed.setURL("https://www.reddit.com/r/" + data.subreddit[0]);
            embed.setDescription(data.title[0]);
            embed.setImage(data.url[0]);
            embed.setTitle("⚡Meme of the Day! 📦");
            embed.setColor('#017E2D');
            embed.setTimestamp(new Date());
            embed.setFooter("Automated message", "https://cdn.discordapp.com/icons/308903005875470338/a306375be4d56f9dd85c5321f3f92343.jpg");
            channel.send(embed);
        })
    }
};
