const Discord = require('discord.js');
const embed = new Discord.RichEmbed();
const meme = require('memejsfork');
const isImageUrl = require('is-image-url');


var modules = module.exports = {
    command: function (message) {
        meme(function(data) {
            if(isImageUrl(data.url[0])){
                modules.createEmbed(message,data);
                message.channel.send(embed);
            }else{
                modules.command(message)
            }
        });
    },
    schedule: function (channel) {
        meme(function (data) {
            if(isImageUrl(data.url[0])) {
                modules.createEmbed2(channel, data);
                channel.send(embed);
            }else {
                modules.schedule(channel);
            }
        })
    },
    createEmbed:function (message,data) {
        embed.setURL(data.url[0]);
        embed.setTitle("Here is the meme you ordered! 📦");
        embed.setDescription("🚛 Title: \n" + data.title[0]);
        embed.addField("You can find more on the the subreddit: ", "https://www.reddit.com/r/" + data.subreddit[0], false);
        embed.setImage(data.url[0]);
        embed.setColor(message.member.colorRole.color);
        embed.setTimestamp(new Date());
        embed.setFooter("Automated message", "https://cdn.discordapp.com/icons/308903005875470338/a306375be4d56f9dd85c5321f3f92343.jpg");
    },
    createEmbed2:function (channel,data) {
        embed.setURL(data.url[0]);
        embed.setTitle("⚡Meme of the Day! 📦 ");
        embed.setDescription("🚛 Title: " + data.title[0]);
        embed.addField("You can find more on the the subreddit: ", "https://www.reddit.com/r/" + data.subreddit[0], false);
        embed.setImage(data.url[0]);
        embed.setColor('#017E2D');
        embed.setTimestamp(new Date());
        embed.setFooter("Automated message", "https://cdn.discordapp.com/icons/308903005875470338/a306375be4d56f9dd85c5321f3f92343.jpg");
    }
};
