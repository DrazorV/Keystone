const Keyv = require("keyv");
const db = new Keyv('sqlite://json.sqlite', {
    table: "Server",
});

module.exports = {
    name: 'setchannel',
    description: '',
    aliases: ['set','setdefault','setdaily','daily'],
    usage: '[command]',
    args: true,
    cooldown: 60,
    async run(client, message, args) {
        let channel;
        let json = await db.get(`Server_${message.guild.id}`),
            prefix = json.prefix;
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("❌ You need to be an admin to do that.")
        if (args[0] !== "meme" && args[0] !== "food") return message.channel.send(":x: Invalid parameters. Correct usage: `" + prefix + "setchannel meme` |`" + prefix + "setchannel food`");
        let answer = ""
        await message.channel.send("🚧 Type the name of the channel that will host daily " + args[0] + "s!");
        await message.channel.awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            time: 30000
        }).then(collected => {
            answer = collected.first().content;
        }).catch(() => {
            return message.channel.send("I've got tired of waiting! 😫 \nPlease try again! 🔁");
        })
        const channels = message.guild.channels.cache.array();
        for (channel of channels) {
            if (channel.name.includes(answer)) {
                if (args[0] === "meme") {
                    await db.set(`Server_${message.guild.id}`, {
                        prefix: json.prefix,
                        meme: channel.id,
                        food: json.food
                    });
                    return await channel.send("🚧 This is the default channel for memes.");
                }
                if (args[0] === "food") {
                    await db.set(`Server_${message.guild.id}`, {
                        prefix: json.prefix,
                        meme: json.meme,
                        food: channel.id
                    });
                    return await channel.send("🍔 This is the default channel for food.");
                }
            }
        }
        return await message.channel.send("❌ This channel does not exist!");
    }
}