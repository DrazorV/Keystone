module.exports = {
    command: function (client,message) {
        if(message.member.voiceChannel) {
            var guild = client.guilds.get(message.guild.id);
            if (!guild.voiceConnection) {
                message.member.voiceChannel.join()
                    .then(connection => {
                        message.channel.send("Joined " + message.member.voiceChannel.name + " successfully ✅");
                    })
                    .catch(console.log);
            }else{
                if(guild.voiceConnection.channel.members.array().length>1){
                    message.channel.send("❌ I am already in " + guild.voiceConnection.channel.name)
                }else{
                    message.member.voiceChannel.join()
                        .then(connection => {
                            message.channel.send("Joined " + message.member.voiceChannel.name + " successfully ✅");
                        })
                        .catch(console.log);
                }

            }
        }else{
            message.reply("You need to join a voice channel to use this command!");
        }
    }
};