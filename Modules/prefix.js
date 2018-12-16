const config = require('../config.json');
var Discord = require('discord.js');




module.exports = {
    command: function (message) {
        if(message.member.hasPermission("ADMINISTRATOR")){
            message.channel.send("Please ⌨ the new prefix: ");
            message.client.on("message",prefix=>{
                console.log(prefix.content);
                console.log(config.prefix);
                config.prefix = prefix.content;
                console.log(config.prefix);
                message.channel.send("The new prefix is set to '"+config.prefix+"'")
            });



        }else {
            message.channel.send("You need to be an admin to change the prefix of the bot.")
        }
    }
};