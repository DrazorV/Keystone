const Keyv = require("keyv");
const db = new Keyv('sqlite://json.sqlite', {
    table:"Server",
});
const embed = require("../utils/embed")

module.exports = async (client, message) => {
    if(message.author.bot) return;
    if(message.webhookID) return;
    if(message.channel.type === "dm") return;

    let json = await db.get(`Server_${message.guild.id}`);
    let prefix = json.prefix;

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
        "https://i.imgur.com/5Px5FeR.png",
        null
    )
    if(message.mentions.has(client.user) && !message.content.startsWith(prefix)) await message.channel.send(emb);

    if(!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    if (message.guild && !message.member) await message.guild.fetch(message.author);

    const cmd = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!cmd) return;

    cmd.run(client, message, args);
};