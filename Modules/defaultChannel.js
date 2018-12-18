module.exports = {
    command: function (channel,message) {
        var channels = message.guild.channels.array();
        while (channels.length > 0) {
            var target = channels.pop();
            if ((channel === target.name) || (channel === target.id)) {
                return target;
            }
        }
        return null;
    }
};