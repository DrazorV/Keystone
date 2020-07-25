const db = require('quick.db');
const Server = new db.table('Server',null);
const embed = require("../utils/embed")

module.exports = async (client, message) => {
    if(message.author.bot) return;

    let prefix = Server.fetch(`Server_${message.guild.id}`,{ target: '.prefix' });
    let field = {
        name:"💁‍ You can always use the command \"" + prefix + "help\"",
        value:"There you can find anything you need🔰"
    }

    let fields = [field]
    let emb = await embed.create(
        null,
        null,
        "Keystone ⏳",
        "The bot prefix is \"" + prefix + "\"",
        fields,
        "https://github.com/DrazorV/Keystone",
        message.member.roles.color.color,
        "Automated message",
        "https://cdn.discordapp.com/icons/308903005875470338/a306375be4d56f9dd85c5321f3f92343.jpg",
        null
    )
    if(message.mentions.has(client.user)) await message.channel.send(emb);

    if(!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.guild && !message.member) await message.guild.fetch(message.author);

    const cmd = client.commands.get(command);
    if (!cmd) return;

    cmd.run(client, message, args);
};