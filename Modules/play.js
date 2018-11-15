const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube('AIzaSyCPY2W8byA60GchVn7fizxb6KaP1qjifZc');
const queue = new Map();
var ffmpeg = require('ffmpeg');

var  exports =  module.exports = {
    async command (client, message) {
        const args = message.content.slice(1).trim().split(/ +/g);
        const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
        const searchString = args.slice(1).join(' ');
        const voiceChannel = message.member.voiceChannel;
        if(!voiceChannel) {
            return message.channel.send("❌ You need to be in a voice channel to play music!");
        }
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) {
            return message.channel.send("❌ I cannot connect to your voice channel, make sure I have the proper permissions!");
        }
        if(!permissions.has("SPEAK")){
            return message.channel.send('❌ I cannot speak in this voice channel, make sure I have the proper permissions!');
        }
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                await exports.handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
            }
            return message.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
        } else {
            try {
                var videos = await youtube.searchVideos(searchString);
                var video = await youtube.getVideoByID(videos[1].id);
            }catch (err) {
                console.error(err);
                return message.channel.send('🆘 I could not obtain any search results.');
            }
            return exports.handleVideo(video, message, voiceChannel);
        }
    },
    async handleVideo(video, message, voiceChannel, playlist = false) {
        const serverQueue = queue.get(message.guild.id);
        const song = {
            id: video.id,
            title: video.title,
            url: `https://www.youtube.com/watch?v=${video.id}`
        };
        if (!serverQueue) {
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            };
            queue.set(message.guild.id, queueConstruct);

            queueConstruct.songs.push(song);

            try {
                queueConstruct.connection = await voiceChannel.join();
                const song = queueConstruct.songs.pop();
                exports.play(message.guild, song);
            } catch (error) {
                console.error(`I could not join the voice channel: ${error}`);
                queue.delete(message.guild.id);
                return message.channel.send(`I could not join the voice channel: ${error}`);
            }
        } else {
            serverQueue.songs.push(song);
            if (playlist) return undefined;
            else return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
        }
        return undefined;
    },
    async play(guild,song){
        const serverQueue = queue.get(guild.id);
        if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }

        const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
            .on('end', reason => {
                if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
                else console.log(reason);
                serverQueue.songs.shift();
                exports.play(guild, serverQueue.songs[0]);
            })
            .on('error', error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

        serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`);
    }
};



