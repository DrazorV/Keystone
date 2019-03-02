const Discord = require('discord.js');

exports.run = async (client,message,args)=>{
    let targets = message.mentions.users.array();
    try{
        message.delete();
    }catch (e) {
    }
    while (targets.length>0){
        const user = targets.pop();
        try {
            const embed = new Discord.RichEmbed();
            embed.setURL(user.avatarURL);
            embed.setTitle("🖼️ Here is " + user.username + "'s Avatar");
            embed.setImage(user.avatarURL);
            embed.setColor(message.member.colorRole.color);
            embed.setTimestamp(new Date());
            embed.setFooter("Automated message", "https://cdn.discordapp.com/icons/308903005875470338/a306375be4d56f9dd85c5321f3f92343.jpg");
            message.channel.send(embed);
        }catch (e) {
            message.channel.send("This user has no Avatar.")
        }
    }
};