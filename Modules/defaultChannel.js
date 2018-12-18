module.exports = {
    command: function (channel,message) {
        var channels = message.guild.channels.array();
        while (channels.length > 0) {
            var target = channels.pop();
            if ((channel === target.name) || (channel === target.id)) {
                process.env.channel = target.id;
                console.log(process.env.channel);
                target.send("✅ This is the default meme's channel from now on.⚓");
                return;
            }
        }
        message.channel.send("❌This channel does not exist.\n Please try again!");
    }
};