const Discord = require('discord.js');
const embed = new Discord.RichEmbed();


module.exports = {
    command: function (message) {
        embed.setAuthor(message.author.username + " said:", message.author.avatarURL);
        if (message.channel.type !== "dm") {
            embed.setColor(message.member.colorRole.color);
            embed.setTitle("Join the voice chat on " + message.guild.name);
            embed.setTimestamp(new Date());
            embed.setFooter("Automated message", message.guild.iconURL);
            let targets = message.mentions.users.array();
            const channel = message.member.voiceChannel;
            if (channel == null) {
                while (targets.length > 0) {
                    const user = targets.pop();
                    if (user.bot) {
                        message.channel.send("❌ Bots usually don't hang out with humans!")
                    } else {

                        embed.setDescription("You can choose one of the voice channels and he will join you ASAP");
                        user.send(embed);
                        message.channel.send("✅ " + user.username + " has been informed!");
                    }
                }
            } else {
                embed.setDescription(":arrow_down: Click the button bellow to join him :arrow_down:");
                while (targets.length > 0) {
                    var options = {
                        maxAge: 600,
                        maxUses: 1,
                        unique: true
                    };
                    const user = targets.pop();
                    if (user.bot) {
                        message.channel.send("❌ Bots usually don't hang out with humans!")
                    } else {
                        if (!channel.members.has(user.id)) {
                            message.channel.send("✅ " + user.username + " has been informed!");
                            user.send("",embed);
                            if (channel != null) {
                                message.member.voiceChannel.createInvite(options)
                                    .then(invite => user.send(invite.toString()))
                                    .catch(console.error);
                            }
                        }
                        else {
                            message.channel.send("❌ " + user.username + " is already in your voice channel!");
                        }
                    }
                }
            }
        }
    }
};