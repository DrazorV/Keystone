



module.exports = {
    command: function (message) {
        if(message.member.hasPermission("ADMINISTRATOR")){
            message.channel.send("Please ⌨ the new prefix: ");
            message.client.on("message",prefix=>{
                console.log(prefix.content);
                message.channel.send("The new prefix is set to '"+process.env.prefix+"'")
            });



        }else {
            message.channel.send("You need to be an admin to change the prefix of the bot.")
        }
    }
};