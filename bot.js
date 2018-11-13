const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');

client.on('warn', console.warn);

client.on('error', console.error);

const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);


client.on('ready',()=> {
    console.log("Keystone has been initialized...");
    client.user.setActivity("🍑Extra MyThicc🍑",{type: 'WATCHING'})
        .then(presence => console.log("Activity set to " +presence.game))
        .catch(console.error);
});

client.on("disconnect",() => console.log("I just disconnected, just making sure you know, I will reconnect now.."));

client.on("guildCreate", guild => {console.log("Joined a new guild: " + guild.name)});

client.on("guildDelete", guild => {console.log("Left a guild: " + guild.name)});

client.on('message', (message) => {
    // Our bot needs to know if it will execute a command
    if (!message.content.startsWith(process.env.prefix) || message.author.bot) return;

    if (message.content.substring(0,1) === process.env.prefix) {
        const args = message.content.slice(process.env.prefix.length).trim().split(/ +/g);
        let cmd = args.shift().toLowerCase();
        const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
        switch(cmd) {
            case 'ping':
                message.channel.send("pong!");
                break;
            case "come" :
                const embed = new Discord.RichEmbed();
                embed.setAuthor(message.author.username + " said:" , message.author.avatarURL);
                if(message.channel.type!=="dm"){
                    embed.setColor(message.member.colorRole.color);
                    embed.setTitle("Join the voice chat on " + message.guild.name);
                    embed.setTimestamp(new Date());
                    embed.setFooter("Automated message",message.guild.iconURL);
                    let targets = message.mentions.users.array();
                    const channel = message.member.voiceChannel;
                    if(channel==null){
                        while (targets.length > 0) {
                            const user = targets.pop();
                            embed.setDescription("You can choose one of the voice channels and he will join you ASAP");
                            user.send(embed);
                            message.channel.send("✅ " + user.username + " has been informed!");
                        }
                    }else {
                        embed.setDescription(":arrow_down: Click the button bellow to join him :arrow_down:");
                        while (targets.length > 0) {
                            var options = {
                                maxAge: 600,
                                maxUses: 1,
                                unique: true
                            };
                            const user = targets.pop();
                            if (!channel.members.has(user.id)) {
                                message.channel.send("✅ " + user.username + " has been informed!");
                                user.send(embed);
                                if (channel != null) {
                                    message.member.voiceChannel.createInvite(options)
                                        .then(invite => user.send(invite.toString()))
                                        .catch(console.error);
                                }
                            }
                            else {
                                message.channel.send("❌ " + user.username + " is already in your voice channel!");
                            }
                        }
                    }
                }
                break;

            case "join":
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
                break;

            case "play":
               const voiceChannel = message.member.voiceChannel;
               if(!voiceChannel) return message.channel.send("You need to be in a voice channel to play music!");
               const permissions = voiceChannel.permissionsFor(message.client.user);
               if(!permissions.has('CONNECT')) return message.channel.send("I cannot connect to your voice channel, make sure I have the proper permissions!");
               if(!permissions.has("SPEAK")) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
               if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
               }else{
               }
               break;

            case "avatar":
                let targets = message.mentions.users.array();

                while (targets.length>0){
                    const user = targets.pop();
                    message.channel.send(user.avatarURL);
                }
                break;


        }
    }
});

client.login(process.env.TOKEN);