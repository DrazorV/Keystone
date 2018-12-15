const Discord = require('discord.js');
const embed = new Discord.RichEmbed();
const Pornsearch = require('pornsearch');


module.exports = {
    command: function (args,message) {
        let mes = args.join(" ");

        Pornsearch
            .search(mes)
            .gifs(1)
            .then(gifs => {
                gifs = gifs.splice(gifs.length-10);
                let gif = gifs[Math.floor(Math.random()*gifs.length)];
                embed.setTitle("Here is the "+args+" you ordered! 📦");
                embed.setImage(gif.url);
                embed.setColor(message.member.colorRole.color);
                embed.setTimestamp(new Date());
                embed.setFooter("Automated message", message.guild.iconURL);
                message.channel.send(embed);
        });
    }
};