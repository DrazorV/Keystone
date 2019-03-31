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
    let bool = false, bool2 = true;
    for(const rol of message.mentions.roles.array()) for(const mem of rol.members.array()) roles.push(mem.user);
    let targets = message.mentions.users.array();
    let targets2 = [];
    for (const rol of roles) if (!targets.includes(rol)) targets2.push(rol);

    while (targets.length > 0) {
        const user = targets.pop();
        if (user.bot||user.presence.status === "offline") bool = true;
        else {
            createEmbed(message,embed,user)
        }
    }

    if(targets2 !== null) {
        while (targets2.length > 0) {
            const user = targets2.pop();
            if (user.bot || user.presence.status !== "online") bool = true;
            else {
                const channel = message.member.voiceChannel;
                if (channel == null) {
                    if (user !== message.author) bool2 = false;
                } else {
                    if (!channel.members.has(user.id)) bool2 = false;
                }
                createEmbed(message, embed, user)
            }
        }
    }
    if(bool && bool2) message.channel.send("❌ Inactive users and bots cannot be invited.");
};


function createEmbed(message, embed,user){
    const channel = message.member.voiceChannel;
    if (channel == null) {
        embed.setDescription("You can choose one of the voice channels and he will join you ASAP");
        if (user !== message.author) {
            user.send(embed);
            message.channel.send("✅ " + user.username + " has been informed!");
        }
    } else {
        embed.setDescription(":arrow_down: Click the button bellow to join him :arrow_down:");
        if (!channel.members.has(user.id)) {
            message.channel.send("✅ " + user.username + " has been informed!");
            user.send(embed)
                .then(message.member.voiceChannel.createInvite(options)
                    .then(invite => user.send(invite.toString()))
                    .catch(console.error));
        } else if (user !== message.author) message.channel.send("❌ " + user.username + " is already in your voice channel!");
    }
}