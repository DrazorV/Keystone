const ytdl = require("ytdl-core");
const streamOptions = { seek: 0, volume: 0.5};
const join = require('./join');



module.exports = {
    command: function (client,message) {
        var guild = client.guilds.get(message.guild.id);
        const voiceChannel = message.member.voiceChannel;
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if(!voiceChannel) {
            return message.channel.send("You need to be in a voice channel to play music!");
        }

        if(!permissions.has('CONNECT')) {
            return message.channel.send("I cannot connect to your voice channel, make sure I have the proper permissions!");
        }
        if(!permissions.has("SPEAK")){
            return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
        }

        if (!guild.voiceConnection) {
            join.voiceJoin(message)

        }else{

        }
    }
};

