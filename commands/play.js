
module.exports.run = async (client,message,args)=>{
    if (!message.member.voice.channel) return message.channel.send("You're not in a voice channel?");

    let song = await client.player.play(message.member.voice.channel, args.join(" "),message.member.user.tag);

    song.song;
};