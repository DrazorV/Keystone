const prefixs = require('../data/prefixs');

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefixs[message.guild.name])) return;

    const args = message.content.slice(prefixs[message.guild.name].length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.guild && !message.member) await message.guild.fetchMember(message.author);

    const cmd = client.commands.get(command);
    if (!cmd) return;

    cmd.run(client, message, args);
};