const winston = require('../utils/winston');
const embed = require("../utils/embed")

let options = {
    maxAge: 600,
    maxUses: 1,
    unique: true
};

module.exports = {
    name: 'invite',
    description: '',
    aliases: ['inv', 'come', 'cm'],
    usage: '[@mention]',
    args: false,
    cooldown: 5,
    async run(client, message) {
        if (message.channel.type === "dm") return;
        let roles = [];
        let bool = false, bool2 = true;
        for (const rol of message.mentions.roles.array()) for (const mem of rol.members.array()) roles.push(mem.user);
        let targets = message.mentions.users.array();
        let targets2 = [];
        for (const rol of roles) if (!targets.includes(rol)) targets2.push(rol);

        for (let user of targets) {
            if (user.bot || user.presence.status === "offline") bool = true;
            else {
                await message.channel.send(createEmbed(message, user))
            }
        }

        if (targets2 !== null) {
            for (let user of targets2) {
                if (user.bot || user.presence.status !== "online") bool = true;
                else {
                    const channel = message.member.voice.channel
                    if (channel == null && user !== message.author) bool2 = false;
                    else if (!channel.members.has(user.id)) bool2 = false;
                    await message.channel.send(createEmbed(message, user))
                }
            }
        }

        if (bool && bool2) await message.channel.send("❌ Inactive users and bots cannot be invited.");
    }
}


function createEmbed(message,user){
    let description,
        author = message.author.username + " said:",
        authorUrl = message.author.avatarURL({"format":"png","dynamic":true,"size":4096}),
        title = "Join the voice chat on " + message.guild.name,
        color = message.member.roles.color.color,
        url = "https://github.com/DrazorV/Keystone",
        footerText = "Automated message",
        footerValue = message.guild.iconURL(),
        channel = message.member.voice.channel

    if (channel == null) {
        description = "You can choose one of the voice channels and he will join you ASAP";
        if (user === message.author) return "❌ You can't invite yourself!"
        let emb = embed.create(author, authorUrl, title, description, null, url, color, footerText, footerValue)
        user.send(emb);
        return  "✅ " + user.username + " has been informed!"
    } else {
        description = ":arrow_down: Click the button bellow to join him :arrow_down:";
        if (channel.members.has(user.id)) return "❌ " + user.username + " is already in your voice channel!"
        if (user === message.author) return  "❌ You can't invite yourself!"
        let emb = embed.create(author, authorUrl, title, description, null, url, color, footerText, footerValue)
        user.send(emb)
            .then(message.member.voice.channel.createInvite(options)
                .then(invite => user.send(invite.toString()))
                .catch(winston.error));
        return "✅ " + user.username + " has been informed!"
    }
}