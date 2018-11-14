module.exports = {
    command: function (message) {
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

        if (true) {

        }else{

        }
    }
};

