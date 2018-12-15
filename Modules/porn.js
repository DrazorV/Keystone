const Discord = require('discord.js');
const embed = new Discord.RichEmbed();
const Pornsearch = require('pornsearch');

module.exports = {
    command: function (args,message) {
        if(message.channel.nsfw) {
            let mes = args.join(" ");
            var result=null;
            const Searcher = new Pornsearch(mes,"Sex");
            try {
                var result = Searcher.gifs();
            }catch (error) {
                console.log(error)
            }
            if(result != null) {
                result
                    .then(gifs => {
                        gifs = gifs.splice(gifs.length - 10);
                        let gif = gifs[Math.floor(Math.random() * gifs.length)];
                        embed.setTitle("Here is the " + args + " you ordered! 📦");
                        embed.setImage(gif.url);
                        embed.setColor(message.member.colorRole.color);
                        embed.setTimestamp(new Date());
                        embed.setFooter("Automated message", message.guild.iconURL);
                        embed.setURL(gif.url);
                        message.channel.send(embed);
                    });
            }else{
                message.channel.send("❌No results for '"+mes+"'.")
            }
        }else{
            message.channel.send("❌You have to be in a NSFW🔞 channel to use this command")
        }
    }
};
