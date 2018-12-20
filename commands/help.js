const Discord = require('discord.js');
const prefixs = require("../data/prefixs.json");

exports.run = async (client,message,args)=>{
    const prefix = prefixs[message.guild.name];
    const embed = new Discord.RichEmbed();
    embed.setTitle("List of Commands 📋");
    embed.setColor([255,90,0]);
    embed.addField(prefix + "avatar @mention","🎴 See anyone's guild avatar at full resolution",false);
    embed.addField(prefix + "come @mention","🤙 Send invitations at your friends to join you in your voice channel",false);
    embed.addField(prefix + "setdefault [name/id]","🗓️ Set a channel to become your source of daily memes, as this bot will post memes daily");
    embed.addField(prefix + "meme","🚧 Get a random meme from a huge collection",false);
    embed.addField(prefix + "ping","🏓 Check the ping of the bot and its server",false);
    embed.addField(prefix + "porn [input]","🔞 Search hot porn gifs",false);
    embed.addField(prefix + "prefix","🏷️ Change the prefix of the bot commands",false);
    embed.setTimestamp(new Date());
    embed.setFooter("Automated message", "https://i.imgur.com/5Px5FeR.png");
    message.channel.send(embed);
};