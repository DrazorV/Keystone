const db = require('quick.db');
const serverstats = new db.table('ServerStats',null);
const prefixs = require('../data/prefixs.json');
const stats = require('../data/stats.json')
const fs = require('fs');


exports.run = async (client,message,args)=>{
    let totusers = await serverstats.fetch(`Stats_${message.guild.id}`, { target: '.totusers' })
    let membcount = await serverstats.fetch(`Stats_${message.guild.id}`, { target: '.membcount' })
    let botcount = await serverstats.fetch(`Stats_${message.guild.id}`, { target: '.botcount' })
    let online = await serverstats.fetch(`Stats_${message.guild.id}`,{target: '.online'})

    if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send(`:x: You need **MANAGE_GUILD** permission to use this command.`)
    if (!args[0]) return message.channel.send(":x: Invalid parameters. Correct usage: `" + prefixs[message.guild.id]+"stats enable` |`" + prefixs[message.guild.id] + "stats disable`.");
    if(args[0] === 'enable') {
        if(totusers !== null || membcount !== null || botcount !== null || online !== null) return message.channel.send(`:x: Server stats are already enabled for this server.`)
        if(!message.guild.me.hasPermission(`MANAGE_CHANNELS`)) return message.channel.send(`:x: I don't have **MANAGE_CHANNELS** permission.`);
        const totalsize = message.guild.memberCount;
        const botsize = message.guild.members.filter(m => m.user.bot).size;
        const humansize = totalsize - botsize;
        const onlinesize = message.guild.members.filter(m => m.user.presence.status!=="offline").size;

        message.guild.createChannel('📈Server Statistics📈', 'category', [{
            id: message.guild.id,
            deny: ['CONNECT']
        }]).then(channel => {
            channel.setPosition(0)
            message.guild.createChannel("Total Users : " + totalsize, 'voice', [{
                id: message.guild.id,
                deny: ['CONNECT']
            }]).then(channel1 => {
                channel1.setParent(channel.id)
                let x = channel1.id
                message.guild.createChannel("Human Users  : " + humansize, 'voice', [{
                    id: message.guild.id,
                    deny: ['CONNECT']
                }]).then(channel2 => {
                    channel2.setParent(channel.id)
                    let y = channel2.id
                    message.guild.createChannel("Bot Users : " + botsize, 'voice', [{
                        id: message.guild.id,
                        deny: ['CONNECT']
                    }]).then(channel3 => {
                        channel3.setParent(channel.id)
                        let z = channel3.id
                        message.guild.createChannel("Online Users: " + onlinesize, 'voice',[{
                            id: message.guild.id,
                            deny: ['CONNECT']
                        }]).then(channel4 =>{
                            channel4.setParent(channel.id)
                            let xy =channel4.id
                            serverstats.set(`Stats_${message.guild.id}`, { guildid: message.guild.id, totusers: x, membcount: y, botcount: z, online: xy, categid: channel.id})
                        })
                    })
                })
            })
        })
        stats[message.guild.id] = 'true';
        fs.writeFileSync(__dirname + "..\\..\\data\\stats.json",JSON.stringify(stats,null,"\t"),"utf8");
        message.channel.send(`:white_check_mark: Server Stats enabled for this server.`)
    } else if (args[0] === 'disable') {
        let categ = await serverstats.fetch(`Stats_${message.guild.id}`, { target: '.categid' })

        if(totusers === null || membcount === null || botcount === null || online === null) return message.channel.send(`:x: Serverstats for this server is not enabled.`)
        client.channels.get(totusers).delete()
        client.channels.get(membcount).delete()
        client.channels.get(botcount).delete()
        client.channels.get(online).delete()
        client.channels.get(categ).delete()

        serverstats.delete(`Stats_${message.guild.id}`)
        stats[message.guild.id] = 'false';
        fs.writeFileSync(__dirname + "..\\..\\data\\stats.json",JSON.stringify(stats,null,"\t"),"utf8");
        message.channel.send(`:white_check_mark: Server Stats disabled for this server.`)
    }
}

exports.job = async (client) =>{

    let clans = client.guilds.array();
    while (clans.length > 0) {
        let clan = clans.pop();
        if(stats[clan.id]===("true")) {
            const totalsize = clan.memberCount;
            const botsize = clan.members.filter(m => m.user.bot).size;
            const humansize = totalsize - botsize;
            const onlinesize = clan.members.filter(m => m.user.presence.status !== "offline").size;

            let totusers = serverstats.fetch(`Stats_${clan.id}`, {target: '.totusers'})
            let membcount = serverstats.fetch(`Stats_${clan.id}`, {target: '.membcount'})
            let botcount = serverstats.fetch(`Stats_${clan.id}`, {target: '.botcount'})
            let online = serverstats.fetch(`Stats_${clan.id}`, {target: '.online'})

            client.channels.get(totusers).setName("Total Users : " + totalsize)
            client.channels.get(membcount).setName("Human Users  : " + humansize)
            client.channels.get(botcount).setName("Bot Users : " + botsize)
            client.channels.get(online).setName("Online Users: " + onlinesize)
        }
    }
}
