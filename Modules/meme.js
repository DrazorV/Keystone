const Discord = require('discord.js');
const embed = new Discord.RichEmbed();
const config = require('../config.json');
var getMemeUrls  = require('get-meme-urls');

var categories = ["Willy Wonka","Philosoraptor",
                    "Liberal Douche Garofalo","Awkward Seal",
                    "Donald Trump","skeptical black kid",
                    "sixth sense","i see dead people",
                    "Crying Tobey Maguire","Winter is Coming",
                    "Bad Luck Brian","Feminist Cunt",
                    "GUESS WHO YOU","Stalin Says",
                    "Imagination","fuck me right jonah hill",
                    "Dr Evil meme","Forever Alone",
                    "Osama","buddy jesus",
                    "old lady","Angry Cat Meme"];

const options = {
   apiKey: process.env.meme_api
};

module.exports = {
    command: function (message) {
        getMemeUrls(categories[Math.floor(Math.random()*categories.length)],options).then(result =>{
            var first = result[Math.floor(Math.random() * result.length)];
            embed.setImage(first);
            embed.setTitle("Here is the meme you ordered! 📦");
            embed.setColor(message.member.colorRole.color);
            embed.setTimestamp(new Date());
            embed.setFooter("Automated message", message.guild.iconURL);
            message.channel.send(embed);
        }).catch(err =>{
            console.log(err)
        });
    }
};
