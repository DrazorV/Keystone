const prefixs = require('../Modules/prefixs.json');
const fs = require('fs');

module.exports = {
    command: function (message) {
        if(message.member.hasPermission("ADMINISTRATOR")){
            message.channel.send("Please ⌨ the new prefix: ");
            message.client.on("message",prefix=>{
                prefixs[message.guild.name] = prefix.content;
                fs.writeFileSync(__dirname + "/guilds.json", JSON.stringify(prefixs,null,"\t"), "utf8");
                console.log(prefix.content);
                message.channel.send("The new prefix is set to '"+prefixs[message.guild.name]+"'")
            });
        }else {
            message.channel.send("You need to be an admin to change the prefix of the bot.")
        }
    }
};