const prefixs = require('../data/prefixs.json');
const stats = require('../data/stats.json')
const fs = require('fs');


exports.run = async (client,message,args)=>{
    if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send(`:x: You need **MANAGE_GUILD** permission to use this command.`)
    if (!args[0]) return message.channel.send(":x: Invalid parameters. Correct usage: `" + prefixs[message.guild.id]+"stats enable` |`" + prefixs[message.guild.id] + "stats disable`.");
    if(args[0] === 'enable') {
        if(stats[message.guild.id][0]) return message.channel.send(`:x: Server stats are already enabled for this server.`)
        if(!message.guild.me.hasPermission(`MANAGE_CHANNELS`)) return message.channel.send(`:x: I don't have **MANAGE_CHANNELS** permission.`);
        const totalSize = message.guild.memberCount;
        const botSize = message.guild.members.cache.filter(m => m.user.bot).size;
        const humanSize = totalSize - botSize;
        const onlineSize = message.guild.members.cache.filter(m => m.user.presence.status!=="offline").size;

        message.guild.channels.create('📈Server Statistics📈', {
            type:'category',
            id: message.guild.id,
            deny: ['CONNECT']
        }).then(channel => {
            channel.setPosition(0)
            let w = channel.id
            message.guild.channels.create("🌍 Total Users : " + totalSize, {
                type: 'voice',
                id: message.guild.id,
                deny: ['CONNECT']
            }).then(channel1 => {
                channel1.setParent(channel.id)
                let x = channel1.id
                message.guild.channels.create("🤵 Human Users  : " + humanSize, {
                    type: 'voice',
                    id: message.guild.id,
                    deny: ['CONNECT']
                }).then(channel2 => {
                    channel2.setParent(channel.id)
                    let y = channel2.id
                    message.guild.channels.create("🤖 Bot Users : " + botSize, {
                        type: 'voice',
                        id: message.guild.id,
                        deny: ['CONNECT']
                    }).then(channel3 => {
                        channel3.setParent(channel.id)
                        let z = channel3.id
                        message.guild.channels.create("🔴 Online Users: " + onlineSize, {
                            type: 'voice',
                            id: message.guild.id,
                            deny: ['CONNECT']
                        }).then(channel4 =>{
                            channel4.setParent(channel.id)
                            let xy = channel4.id
                            stats[message.guild.id][0] = true;
                            stats[message.guild.id][1] = w;
                            stats[message.guild.id][2] = x;
                            stats[message.guild.id][3] = y;
                            stats[message.guild.id][4] = z;
                            stats[message.guild.id][5] = xy;
                            fs.writeFileSync(__dirname + "..\\..\\data\\stats.json",JSON.stringify(stats,null,"\t"),"utf8");
                            message.channel.send(`:white_check_mark: Server Stats enabled for this server.`)
                        })
                    })
                })
            })
        })
    } else if (args[0] === 'disable') {
        if(!stats[message.guild.id][0]){
            client.channels.cache.get(client.channels.cache.find(channel => channel.name.includes("Users: "))).delete()
            return message.channel.send(`:x: Server Stats for this server is not enabled.`)
        } else {
            try {
                client.channels.cache.get(stats[message.guild.id][1]).delete()
                client.channels.cache.get(stats[message.guild.id][2]).delete()
                client.channels.cache.get(stats[message.guild.id][3]).delete()
                client.channels.cache.get(stats[message.guild.id][4]).delete()
                client.channels.cache.get(stats[message.guild.id][5]).delete()
            }catch (e) {
                client.channels.cache.get(client.channels.cache.find(channel => channel.name.includes("Users: "))).delete()
            }
        }

        stats[message.guild.id][0] = false;
        stats[message.guild.id][1] = "";
        stats[message.guild.id][2] = "";
        stats[message.guild.id][3] = "";
        stats[message.guild.id][4] = "";
        stats[message.guild.id][5] = "";
        fs.writeFileSync(__dirname + "..\\..\\data\\stats.json",JSON.stringify(stats,null,"\t"),"utf8");
        await message.channel.send(`:white_check_mark: Server Stats disabled for this server.`)
    }
}

exports.job = async (client) =>{

    let clans = client.guilds.cache.array();
    while (clans.length > 0) {
        let clan = clans.pop();
        if (stats[clan.id] !== undefined) {
            if (stats[clan.id][0]) {
                const totalSize = clan.memberCount;
                const botSize = clan.members.cache.filter(m => m.user.bot).size;
                const humanSize = totalSize - botSize;
                const onlineSize = clan.members.cache.filter(m => m.user.presence.status !== "offline").size;

                let cache_ = client.channels.cache;
                if (cache_.get(stats[clan.id][1]) !== undefined) {
                    cache_.get(stats[clan.id][2]).setName("🌍 Total Users : " + totalSize)
                    cache_.get(stats[clan.id][3]).setName("🤵 Human Users  : " + humanSize)
                    cache_.get(stats[clan.id][4]).setName("🤖 Bot Users : " + botSize)
                    cache_.get(stats[clan.id][5]).setName("🔴 Online Users: " + onlineSize)
                    console.log("------------------Stats updated!------------------")
                }else {
                    clan.channels.create('📈Server Statistics📈', {
                        type:'category',
                        id: clan.id,
                        deny: ['CONNECT']
                    }).then(channel => {
                        channel.setPosition(0)
                        let w = channel.id
                        clan.channels.create("🌍 Total Users : " + totalSize, {
                            type: 'voice',
                            id: clan.id,
                            deny: ['CONNECT']
                        }).then(channel1 => {
                            channel1.setParent(channel.id)
                            let x = channel1.id
                            clan.channels.create("🤵 Human Users  : " + humanSize, {
                                type: 'voice',
                                id: clan.id,
                                deny: ['CONNECT']
                            }).then(channel2 => {
                                channel2.setParent(channel.id)
                                let y = channel2.id
                                clan.channels.create("🤖 Bot Users : " + botSize, {
                                    type: 'voice',
                                    id: clan.id,
                                    deny: ['CONNECT']
                                }).then(channel3 => {
                                    channel3.setParent(channel.id)
                                    let z = channel3.id
                                    clan.channels.create("🔴 Online Users: " + onlineSize, {
                                        type: 'voice',
                                        id: clan.id,
                                        deny: ['CONNECT']
                                    }).then(channel4 => {
                                        channel4.setParent(channel.id)
                                        let xy = channel4.id
                                        stats[clan.id][0] = true;
                                        stats[clan.id][1] = w;
                                        stats[clan.id][2] = x;
                                        stats[clan.id][3] = y;
                                        stats[clan.id][4] = z;
                                        stats[clan.id][5] = xy;
                                        fs.writeFileSync(__dirname + "..\\..\\data\\stats.json", JSON.stringify(stats, null, "\t"), "utf8");
                                    })
                                })
                            })
                        })
                    })
                }
            } else {
                stats[clan.id][0] = false;
                stats[clan.id][1] = "";
                stats[clan.id][2] = "";
                stats[clan.id][3] = "";
                stats[clan.id][4] = "";
                stats[clan.id][5] = "";
                fs.writeFileSync(__dirname + "..\\..\\data\\stats.json", JSON.stringify(stats, null, "\t"), "utf8");
            }
        }
    }
}
