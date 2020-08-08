const embed = require("../utils/embed")

module.exports = {
    name: 'avatar',
    description: '',
    aliases: ['icon', 'pfp','av','avat','ic','pic'],
    usage: '[@mention]',
    args: false,
    cooldown: 5,
    async run (client,message) {
        let targets = message.mentions.users.array();
        for(let user of targets){
            let avatar;
            try {
                avatar = user.avatarURL()
            }catch (e) {
                await message.channel.send("❌ This user has no Avatar.")
            }

            let emb = await embed.create(
                null,
                null,
                "🖼️ Here is " + user.username + "'s Avatar",
                null,
                null,
                avatar,
                message.member.roles.color.color,
                "Automated message",
                "https://cdn.discordapp.com/avatars/509836105932079133/7d0e92ee1040a9a83d74230a854c79d7.webp",
                user.avatarURL({"format":"png","dynamic":true,"size":4096})
            )

            await message.channel.send(emb);
        }
    }
}