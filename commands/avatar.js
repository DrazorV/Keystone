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
            const embed = new Discord.MessageEmbed();
            embed.setURL(user.avatarURL())
            .setTitle("🖼️ Here is " + user.username + "'s Avatar")
            .setImage(user.avatarURL({"format":"png","dynamic":true,"size":4096}))
            .setColor(message.member.roles.color.color)
            .setTimestamp(new Date())
            .setFooter("Automated message", "https://cdn.discordapp.com/icons/308903005875470338/a306375be4d56f9dd85c5321f3f92343.jpg");
            await message.channel.send(embed);
        }catch (e) {
            await message.channel.send("This user has no Avatar.")
        }
    }
};