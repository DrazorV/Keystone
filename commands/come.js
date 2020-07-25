const embed = require("../utils/embed")

let options = {
    maxAge: 600,
    maxUses: 1,
    unique: true
};

exports.run = async (client,message,args)=>{
    if (message.channel.type === "dm") return;
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
            await createEmbed(message, user)
        }
    }

    if(targets2 !== null) {
        while (targets2.length > 0) {
            const user = targets2.pop();
            if (user.bot || user.presence.status !== "online") bool = true;
            else {
                const channel = message.member.voice.channel
                if (channel == null) {
                    if (user !== message.author) bool2 = false;
                } else {
                    if (!channel.members.has(user.id)) bool2 = false;
                }
                await createEmbed(message, user)
            }
        }
    }
    if(bool && bool2) await message.channel.send("❌ Inactive users and bots cannot be invited.");
};


async function createEmbed(message,user){
    let description;
    let author = message.author.username + " said:";
    let authorUrl = message.author.avatarURL({"format":"png","dynamic":true,"size":4096});
    let title = "Join the voice chat on " + message.guild.name;
    let color = message.member.roles.color.color;
    let url = "https://github.com/DrazorV/Keystone";
    let footerText = "Automated message";
    let footerValue = message.guild.iconURL;
    const channel = message.member.voice.channel;

    if (channel == null) {
        description = "You can choose one of the voice channels and he will join you ASAP";
        if (user !== message.author) {
            let emb = await embed.create(author, authorUrl, title, description, null, url, color, footerText, footerValue)
            user.send(emb);
            await message.channel.send("✅ " + user.username + " has been informed!");
        }else await message.channel.send("❌ You can't invite yourself!");

    } else {
        description = ":arrow_down: Click the button bellow to join him :arrow_down:";
        if (!channel.members.has(user.id)) {
            await message.channel.send("✅ " + user.username + " has been informed!");
            let emb = await embed.create(author, authorUrl, title, description, null, url, color, footerText, footerValue)
            user.send(emb)
                .then(message.member.voice.channel.createInvite(options)
                    .then(invite => user.send(invite.toString()))
                    .catch(console.error));
        } else if (user !== message.author) await message.channel.send("❌ " + user.username + " is already in your voice channel!");
        else await message.channel.send("❌ You can't invite yourself!");
    }
}