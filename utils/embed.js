const Discord = require("discord.js");



exports.create = (author, authorUrl, title, description, fields , url, color, footerText, footerUrl, img) => {
    const embed = new Discord.MessageEmbed();
    if (fields !== null){
        fields.forEach(function (field) {
            if (field.name !== null) embed.addField(field.name, field.value, false);
        })
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