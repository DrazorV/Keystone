const Keyv = require("keyv");

const Server = new Keyv('sqlite://json.sqlite', {
    table:"Server",
});

module.exports = {
    name: 'clear',
    description: '',
    aliases: ['delete', 'remove','del','clr','rem'],
    usage: '[number]',
    args: true,
    cooldown: 5,
    async run(client, message, args) {
        let json = await Server.get(`Server_${message.guild.id}`), prefix = json.prefix
        if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send(`:x: You need **MANAGE_GUILD** permission to use this command.`)
        const user = message.mentions.users.first();
        let amount = !!parseInt(args[0]) ? parseInt(args[0]) : parseInt(args[1])
        if (isNaN(args[0]) && isNaN(args[1])) return message.channel.send(":x: Invalid parameters. Correct usage: `" + prefix + "clear [amount]` or `" + prefix + "clear @mention [amount]`");
        if (amount < 1000) {

            if (user) {
                while (amount >= 100) {
                    let messages = await message.channel.messages.fetch({limit: 100})
                    messages = await messages.filter(m => m.author.id === user.toString() ? user.id : client.user.id).array().slice(0, 100);
                    await message.channel.bulkDelete(messages)
                    amount -= 100;
                }
                let messages = await message.channel.messages.fetch({limit: 100})
                messages = await messages.filter(m => m.author.id === user.toString() ? user.id : client.user.id).array().slice(0, amount);
                await message.channel.bulkDelete(messages)
            } else {
                while (amount >= 100) {
                    await message.channel.bulkDelete(100)
                    amount -= 100;
                }
                await message.channel.bulkDelete(amount + 1)
            }


            await message.channel.send("🧹 Cleared " + args[0] + " messages!").then(sent => {
                sent.delete({
                    timeout: 5000
                })
            })
        } else {
            await message.channel.send(":x: Can't delete more than 1000 messages at once!")
        }
    }
}