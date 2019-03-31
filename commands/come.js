const Discord = require('discord.js');
let options = {
    maxAge: 600,
    maxUses: 1,
    unique: true
};

exports.run = async (client,message,args)=>{
    if (message.channel.type === "dm") return;
    const embed = new Discord.RichEmbed();
    embed.setAuthor(message.author.username + " said:", message.author.avatarURL);
    embed.setColor(message.member.colorRole.color);
    embed.setTitle("Join the voice chat on " + message.guild.name);
    embed.setTimestamp(new Date());
    embed.setFooter("Automated message", message.guild.iconURL);
    let roles = [];
    let bool = false,bool2 = true,bool3 = false;
    for(const rol of message.mentions.roles.array()) for(const mem of rol.members.array()) roles.push(mem.user);
    let targets = message.mentions.users.array();
    if(targets.length > 0) bool3 = true;
    for (const rol of roles) if (!targets.includes(rol)) targets.push(rol);
    if(targets.length === 1) bool3 = true;

    while (targets.length > 0) {
        const user = targets.pop();
        if ((user.bot||user.presence.status !== "online")&& !bool3) bool = true;
        else {
            const channel = message.member.voiceChannel;
            if (channel == null) {
                embed.setDescription("You can choose one of the voice channels and he will join you ASAP");
                if (user !== message.author) {
                    user.send(embed);
                    message.channel.send("✅ " + user.username + " has been informed!");
                    bool2 = false;
                }
            } else {
                embed.setDescription(":arrow_down: Click the button bellow to join him :arrow_down:");
                if (!channel.members.has(user.id)) {
                    message.channel.send("✅ " + user.username + " has been informed!");
                    bool2 = false;
                    user.send(embed)
                        .then(message.member.voiceChannel.createInvite(options)
                            .then(invite => user.send(invite.toString()))
                            .catch(console.error));
                } else if (user !== message.author) message.channel.send("❌ " + user.username + " is already in your voice channel!");
            }
        }
    }
    if(bool && bool2) message.channel.send("❌ Offline users and bots cannot be invited.");
};