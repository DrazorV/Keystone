const winston = require('../utils/winston');
const embed = require("../utils/embed")

let options = {
    maxAge: 6000,
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
        //ignore private messages
        if (message.channel.type === "dm") return;

        let mentionedRoleMembers = [];

        //Cache all online user from the @mentioned role
        for (const role of message.mentions.roles.array())
            for (const member of role.members.array())
                if(!member.user.bot && member.user.presence.status === "online")
                    mentionedRoleMembers.push(member.user);

        //Cache all @mentioned users
        let mentioned;
        for (const user of message.mentions.users.array())
            if(!user.bot)
                mentioned.push(user);

        //Collect all
        for (const member of mentionedRoleMembers)
            if (!mentioned.includes(member))
                mentioned.push(member);


        if (mentioned === undefined) return message.channel.send("❌ Inactive users and bots cannot be invited.");
        if (mentioned.length === 1 && mentioned[0] === message.author)
            await message.channel.send("❌ You can't invite yourself!")
        else
            for (let user of mentioned)
                if (user !== message.author)
                    await message.channel.send(createEmbed(message, user))
    }
}


function createEmbed(message,user){
    let description,
        author = message.author.username + " said:",
        authorUrl = message.author.avatarURL({"format":"png","dynamic":true,"size":4096}),
        title = "Join the voice chat on " + message.guild.name,
        color = message.member.roles.color.color,
        footerText = "Automated message",
        footerValue = message.guild.iconURL(),
        channel = message.member.voice.channel

    if (channel == null) {
        description = "You can choose one of the voice channels and he will join you ASAP";
        let emb = embed.create(author, authorUrl, title, description, null, null, color, footerText, footerValue)
        user.send(emb);
    } else {
        if (channel.members.has(user.id)) return "❌ " + user.username + " is already in your voice channel!"
        description = ":arrow_down: Click the button bellow to join him :arrow_down:";
        let emb = embed.create(author, authorUrl, title, description, null, null, color, footerText, footerValue)
        user.send(emb)
            .then(message.member.voice.channel.createInvite(options)
                .then(invite => user.send(invite.toString()))
                .catch(winston.error));
    }
    return "✅ " + user.username + " has been informed!"
}