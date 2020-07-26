const Discord = require("discord.js");



exports.create = (author, authorUrl, title, description, fields , url, color, footerText, footerUrl, img) => {
    const embed = new Discord.MessageEmbed();
    if (fields !== null){
        for(let i = 0; i < fields.length; i++){
            if (fields[i].name !== null) embed.addField(fields[i].name, fields[i].value, false);
        }
    }

    if (author !== null) embed.setAuthor(author);
    if (title !== null) embed.setTitle(title);
    if (description !== null) embed.setDescription(description);
    if (url !== null) embed.setURL(url);
    if (color !== null) embed.setColor(color);
    embed.setTimestamp(new Date());
    if (footerText !== null) embed.setFooter(footerText, footerUrl);
    if (img !== null) embed.setImage(img)
    return embed;
};