const embed = require("../utils/embed")

module.exports = {
    name: 'ping',
    description: '',
    aliases: ['echo', 'ms'],
    usage: '[command]',
    args: false,
    cooldown: 1,
    async run(client, message) {
        message.channel.send("Pinging ...").then((msg) => msg.delete());
        let field = {
            name: "⏱Server",
            value: Math.round(message.client.ws.ping) + ' ms'
        }
        let field1 = {
            name: "⌛Keystone",
            value: Math.abs(Date.now() - message.createdTimestamp) + ' ms'
        }

        let fields = [field, field1]
        let emb = await embed.create(
            null,
            null,
            "Keystone ⏳",
            null,
            fields,
            null,
            0x2ed32e,
            "Automated message",
            message.guild.iconURL(),
            null
        )

        await message.channel.send(emb);
    }
}