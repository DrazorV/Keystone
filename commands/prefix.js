const Keyv = require("keyv");
const db = new Keyv('sqlite://json.sqlite', {
    table:"Server",
});
let prefix

module.exports = {
    name: 'prefix',
    description: '',
    aliases: [],
    usage: '[command]',
    args: false,
    cooldown: 30,
    async run(client, message) {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You need to be an admin to change the prefix of the bot.");
        await message.channel.send("💻 Please type the new prefix");
        await message.channel.awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            time: 30000
        }).then(collected => {
            prefix = collected.first().content;
        }).catch(() => {
            return message.channel.send("I've got tired of waiting! 😫 \nPlease try again! 🔁");
        })

        let json = await db.get(`Server_${message.guild.id}`);
        await db.set(`Server_${message.guild.id}`, {
            prefix: prefix,
            meme: json.meme,
            food: json.food
        })
        await message.channel.send("🎉 The 🆕 prefix is set to \"" + prefix + "\"");
    }
}