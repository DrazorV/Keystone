module.exports = {
    command: function (client,message) {
        var guild = client.guilds.get(message.guild.id);
        if (guild.voiceConnection) {
            guild.voiceConnection.disconnect()
            message.channel.send("🚀 I am outy See Ya later!!")
        } else {
            message.channel.send("💤 I have to join a channel first");
        }
    }
};