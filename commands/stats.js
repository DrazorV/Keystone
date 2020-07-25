const prefixs = require('../data/prefixs.json');
const db = require('quick.db');
const ServeStats = new db.table('ServerStats',null);


exports.run = async (client,message,args)=>{
    let totUsers = await ServeStats.fetch(`Stats_${message.guild.id}`, { target: '.totUsers' })
    let memberCount = await ServeStats.fetch(`Stats_${message.guild.id}`, { target: '.memberCount' })
    let botCount = await ServeStats.fetch(`Stats_${message.guild.id}`, { target: '.botCount' })
    let online = await ServeStats.fetch(`Stats_${message.guild.id}`,{target: '.online'})


    if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send(`:x: You need **MANAGE_GUILD** permission to use this command.`)
    if (!args[0]) return message.channel.send(":x: Invalid parameters. Correct usage: `" + prefixs[message.guild.id]+"stats enable` |`" + prefixs[message.guild.id] + "stats disable`.");
    if(args[0] === 'enable') {

        if(totUsers !== null || memberCount !== null || botCount !== null || online !== null) return message.channel.send(`:x: Server stats are already enabled for this server.`)
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
                            ServeStats.set(`Stats_${message.guild.id}`, {
                                guildId: message.guild.id,
                                totUsers: x,
                                memberCount: y,
                                botCount: z,
                                online: xy,
                                categoryId: channel.id
                            })
                            message.channel.send(`:white_check_mark: Server Stats enabled for this server.`)
                        })
                    })
                })
            })
        })
    } else if (args[0] === 'disable') {
        let category = await ServeStats.fetch(`Stats_${message.guild.id}`, { target: '.categoryId' })
        if(totUsers === null || memberCount === null || botCount === null || online === null) return message.channel.send(`:x: Server Stats for this server is not enabled.`)

        client.channels.cache.find(channel => channel.id === totUsers).delete()
        client.channels.cache.find(channel => channel.id === memberCount).delete()
        client.channels.cache.find(channel => channel.id === botCount).delete()
        client.channels.cache.find(channel => channel.id === online).delete()
        client.channels.cache.find(channel => channel.id === category).delete()

        await message.channel.send(`:white_check_mark: Server Stats disabled for this server.`)
    }
}

exports.job = async (client) =>{
    let clans = client.guilds.cache.array();
    while (clans.length > 0) {
        let clan = clans.pop();

        const totalSize = clan.memberCount;
        const botSize = clan.members.cache.filter(m => m.user.bot).size;
        const humanSize = totalSize - botSize;
        const onlineSize = clan.members.cache.filter(m => m.user.presence.status !== "offline").size;

        let totUsers = ServeStats.fetch(`Stats_${clan.id}`, {target: '.totUsers'})
        let memberCount = ServeStats.fetch(`Stats_${clan.id}`, {target: '.memberCount'})
        let botCount = ServeStats.fetch(`Stats_${clan.id}`, {target: '.botCount'})
        let online = ServeStats.fetch(`Stats_${clan.id}`, {target: '.online'})

        if(totUsers !== null || memberCount !== null || botCount !== null || online !== null){
            await clan.channels.cache.find(channel => channel.id === totUsers).setName("🌍 Total Users : " + totalSize)
            await clan.channels.cache.find(channel => channel.id === memberCount).setName("🤵 Human Users  : " + humanSize)
            await clan.channels.cache.find(channel => channel.id === botCount).setName("🤖 Bot Users : " + botSize)
            await clan.channels.cache.find(channel => channel.id === online).setName("🔴 Online Users: " + onlineSize)
            console.log("------------------Stats updated for" + clan.name + "------------------")
        }
    }
}
