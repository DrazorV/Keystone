const ytdl = require("ytdl-core");
const join = require('./join');
const YouTube = require('simple-youtube-api');

const youtube = new YouTube('./env.goggle_api');
const queue = new Map();
const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
const searchString = args.slice(1).join(' ');
const serverQueue = queue.get(message.guild.id);

var exports = module.exports = {
    command: function (client,message) {
        var guild = client.guilds.get(message.guild.id);
        const voiceChannel = message.member.voiceChannel;
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if(!voiceChannel) {
            return message.channel.send("❌ You need to be in a voice channel to play music!");
        }

        if(!permissions.has('CONNECT')) {
            return message.channel.send("❌ I cannot connect to your voice channel, make sure I have the proper permissions!");
        }
        if(!permissions.has("SPEAK")){
            return message.channel.send('❌ I cannot speak in this voice channel, make sure I have the proper permissions!');
        }

        if (!guild.voiceConnection) {
            join.voiceJoin(message);
        }
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = youtube.getPlaylist(url);
            const videos = playlist.getVideos();
            for (const video of Object.values(videos)) {
                const video2 = youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                exports.handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
            }
            return message.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
        } else {
            try {
                var video =  youtube.getVideo(url);
            } catch (error) {
                try {
                    var videos = youtube.searchVideos(searchString, 10);
                    var video = youtube.getVideoByID(videos[0].id);
                }catch (err) {
                    console.error(err);
                    return message.channel.send('🆘 I could not obtain any search results.');
                }
                return exports.handleVideo(video, message, voiceChannel);
            }
        }
    },
    handleVideo: function(video, message, voiceChannel, playlist = false) {
        const serverQueue = queue.get(message.guild.id);
        console.log(video);
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
                queueConstruct.connection = voiceChannel.join();
                exports.play(message.guild, queueConstruct.songs[0]);
            } catch (error) {
                console.error(`I could not join the voice channel: ${error}`);
                queue.delete(message.guild.id);
                return message.channel.send(`I could not join the voice channel: ${error}`);
            }
        } else {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            if (playlist) return undefined;
            else return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
        }
        return undefined;
    },
    play: function(guild,song) {
        const serverQueue = queue.get(guild.id);
        if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }
        console.log(serverQueue.songs);
        const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
            .on('end', reason => {
                if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
                else console.log(reason);
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            })
            .on('error', error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`);
    }
};

