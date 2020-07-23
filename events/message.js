const prefixs = require('../data/prefixs');
const Discord = require("discord.js");

module.exports = async (client, message) => {
    if(message.author.bot) return;
    if(message.mentions.has(client.user)) await message.channel.send(createEmbed(message));
    if(!message.content.startsWith(prefixs[message.guild.id])) return;

    const args = message.content.slice(prefixs[message.guild.id].length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.guild && !message.member) await message.guild.fetch(message.author);

    const cmd = client.commands.get(command);
    if (!cmd) return;

    cmd.run(client, message, args);
};



function createEmbed(message) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Keystone ⏳");
    embed.setDescription("The bot prefix is \""+prefixs[message.guild.id]+"\"");
    embed.addField("💁‍ You can always use the command \""+prefixs[message.guild.id]+"help\"", "There you can find anything you need🔰", false);
    embed.setURL("https://github.com/DrazorV/Keystone");
    try{
        embed.setColor(message.member.roles.color.color);
    }catch (e) {
        
    }
    embed.setTimestamp(new Date());
    embed.setFooter("Automated message", "https://cdn.discordapp.com/icons/308903005875470338/a306375be4d56f9dd85c5321f3f92343.jpg");
    return embed;
}