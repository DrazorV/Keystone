const prefixs = require('../data/prefixs.json');
const stats = require('../data/stats.json')
const fs = require('fs');


exports.run = async (client,message,args)=>{
    let categ = stats[message.guild.id][1]
    let totusers = stats[message.guild.id][2]
    let membcount = stats[message.guild.id][3]
    let botcount = stats[message.guild.id][4]
    let online =  stats[message.guild.id][5]

    if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send(`:x: You need **MANAGE_GUILD** permission to use this command.`)
    if (!args[0]) return message.channel.send(":x: Invalid parameters. Correct usage: `" + prefixs[message.guild.id]+"stats enable` |`" + prefixs[message.guild.id] + "stats disable`.");
    if(args[0] === 'enable') {
        if(categ !== "" ||totusers !== "" || membcount !== "" || botcount !== "" || online !== "") return message.channel.send(`:x: Server stats are already enabled for this server.`)
        if(!message.guild.me.hasPermission(`MANAGE_CHANNELS`)) return message.channel.send(`:x: I don't have **MANAGE_CHANNELS** permission.`);
        const totalsize = message.guild.memberCount;
        const botsize = message.guild.members.cache.filter(m => m.user.bot).size;
        const humansize = totalsize - botsize;
        const onlinesize = message.guild.members.cache.filter(m => m.user.presence.status!=="offline").size;

        message.guild.channels.create('📈Server Statistics📈', {
            type:'category',
            id: message.guild.id,
            deny: ['CONNECT']
        }).then(channel => {
            channel.setPosition(0)
            let w = channel.id
            message.guild.channels.create("🌍 Total Users : " + totalsize, {
                type: 'voice',
                id: message.guild.id,
                deny: ['CONNECT']
            }).then(channel1 => {
                channel1.setParent(channel.id)
                let x = channel1.id
                message.guild.channels.create("🤵 Human Users  : " + humansize, {
                    type: 'voice',
                    id: message.guild.id,
                    deny: ['CONNECT']
                }).then(channel2 => {
                    channel2.setParent(channel.id)
                    let y = channel2.id
                    message.guild.channels.create("🤖 Bot Users : " + botsize, {
                        type: 'voice',
                        id: message.guild.id,
                        deny: ['CONNECT']
                    }).then(channel3 => {
                        channel3.setParent(channel.id)
                        let z = channel3.id
                        message.guild.channels.create("🔴 Online Users: " + onlinesize, {
                            type: 'voice',
                            id: message.guild.id,
                            deny: ['CONNECT']
                        }).then(channel4 =>{
                            channel4.setParent(channel.id)
                            let xy = channel4.id
                            stats[message.guild.id][1] = w;
                            stats[message.guild.id][2] = x;
                            stats[message.guild.id][3] = y;
                            stats[message.guild.id][4] = z;
                            stats[message.guild.id][5] = xy;
                            fs.writeFileSync(__dirname + "..\\..\\data\\stats.json",JSON.stringify(stats,null,"\t"),"utf8");
                        })
                    })
                })
            })
        })
        stats[message.guild.id][0] = 'true';
        fs.writeFileSync(__dirname + "..\\..\\data\\stats.json",JSON.stringify(stats,null,"\t"),"utf8");
        await message.channel.send(`:white_check_mark: Server Stats enabled for this server.`)
    } else if (args[0] === 'disable') {

        if(categ === "" ||totusers === "" || membcount === "" || botcount === "" || online === "") return message.channel.send(`:x: Serverstats for this server is not enabled.`)
        client.channels.cache.get(totusers).delete()
        client.channels.cache.get(membcount).delete()
        client.channels.cache.get(botcount).delete()
        client.channels.cache.get(online).delete()
        client.channels.cache.get(categ).delete()
        stats[message.guild.id][0] = 'false';
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
        if (stats[clan.id] !== null){
            console.log(clan.name);
            console.log(stats[clan.id]);
            console.log(stats[clan.id][0]);
            if(stats[clan.id][0]===("true")) {
                const totalsize = clan.memberCount;
                const botsize = clan.members.cache.filter(m => m.user.bot).size;
                const humansize = totalsize - botsize;
                const onlinesize = clan.members.cache.filter(m => m.user.presence.status !== "offline").size;


                let totusers = stats[clan.id][2]
                let membcount = stats[clan.id][3]
                let botcount = stats[clan.id][4]
                let online =  stats[clan.id][5]


                let cache_ = client.channels.cache;
                if(cache_.get(totusers) !== undefined){
                    cache_.get(totusers).setName("🌍 Total Users : " + totalsize)
                    cache_.get(membcount).setName("🤵 Human Users  : " + humansize)
                    cache_.get(botcount).setName("🤖 Bot Users : " + botsize)
                    cache_.get(online).setName("🔴 Online Users: " + onlinesize)
                }
            }
        }
    }
}
