const winston = require('../utils/winston');
const Keyv = require("keyv");

const Server = new Keyv('sqlite://json.sqlite', {
    table:"Server",
});
const ServerStats = new Keyv('sqlite://json.sqlite', {
    table:"ServerStats",
});

module.exports = {
    name: 'stats',
    description: '',
    aliases: ['stat', 'st'],
    usage: '[command]',
    args: true,
    cooldown: 10,
    async run(client, message, args) {
        let json = await Server.get(`Server_${message.guild.id}`),
            StatsJson = await ServerStats.get(`Stats_${message.guild.id}`),
            prefix = json.prefix,
            totUsers = StatsJson.totUsers,
            memberCount = StatsJson.memberCount,
            botCount = StatsJson.botCount,
            online = StatsJson.online


        if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send(`:x: You need **MANAGE_GUILD** permission to use this command.`)
        if (!args[0]) return message.channel.send(":x: Invalid parameters. Correct usage: `" + prefix + "stats enable` |`" + prefix + "stats disable`.");
        if (args[0] === 'enable') {

            if (totUsers !== undefined || memberCount !== undefined || botCount !== undefined || online !== undefined) return message.channel.send(`:x: Server stats are already enabled for this server.`)
            if (!message.guild.me.hasPermission(`MANAGE_CHANNELS`)) return message.channel.send(`:x: I don't have **MANAGE_CHANNELS** permission.`);

            const totalSize = message.guild.memberCount;
            const botSize = message.guild.members.cache.filter(m => m.user.bot).size;
            const humanSize = totalSize - botSize;
            const onlineSize = message.guild.members.cache.filter(m => m.user.presence.status !== "offline").size;

            let channel = await message.guild.channels.create('📈Server Statistics📈', {
                type: 'category',
                id: message.guild.id,
                deny: ['CONNECT']
            })
            await channel.setPosition(0)
            let cat = channel.id;
            channel = await message.guild.channels.create("🌍 Total Users : " + totalSize, {
                type: 'voice',
                id: message.guild.id,
                deny: ['CONNECT']
            })
            await channel.setParent(cat)
            let tot = channel.id
            channel = await message.guild.channels.create("🤵 Human Users  : " + humanSize, {
                type: 'voice',
                id: message.guild.id,
                deny: ['CONNECT']
            })
            await channel.setParent(cat)
            let mem = channel.id
            channel = await message.guild.channels.create("🤖 Bot Users : " + botSize, {
                type: 'voice',
                id: message.guild.id,
                deny: ['CONNECT']
            })
            await channel.setParent(cat)
            let bot = channel.id
            channel = await message.guild.channels.create("🔴 Online Users: " + onlineSize, {
                type: 'voice',
                id: message.guild.id,
                deny: ['CONNECT']
            })
            await channel.setParent(cat)
            let on = channel.id

            await ServerStats.set(`Stats_${message.guild.id}`, {
                guildId: message.guild.id,
                totUsers: tot,
                memberCount: mem,
                botCount: bot,
                online: on,
                categoryId: cat
            })
            await message.channel.send(`:white_check_mark: Server Stats enabled for this server.`)
        } else if (args[0] === 'disable') {
            let category = StatsJson.categoryId

            try {
                await client.channels.cache.find(channel => channel.id === totUsers).delete()
                await client.channels.cache.find(channel => channel.id === memberCount).delete()
                await client.channels.cache.find(channel => channel.id === botCount).delete()
                await client.channels.cache.find(channel => channel.id === online).delete()
                await client.channels.cache.find(channel => channel.id === category).delete()
                winston.info("Stats deleted by id")
            } catch (e) {
                await finer(client, "Server Statistics");
                await finer(client, "Total Users")
                await finer(client, "Human Users")
                await finer(client, "Bot Users")
                await finer(client, "Online Users")
                await finer(client, "Server Statistics")
                winston.info("Stats deleted by name")
            }

            await ServerStats.set(`Stats_${message.guild.id}`, {
                guildId: message.guild.id,
                totUsers: undefined,
                memberCount: undefined,
                botCount: undefined,
                online: undefined,
                categoryId: undefined
            })

            await message.channel.send(`:white_check_mark: Server Stats disabled for this server.`)
        }
    },
    async job (client){
        let clans = client.guilds.cache.array();
        for(let clan of clans){

            const totalSize = clan.memberCount;
            const botSize = clan.members.cache.filter(m => m.user.bot).size;
            const humanSize = totalSize - botSize;
            const onlineSize = clan.members.cache.filter(m => m.user.presence.status !== "offline").size;

            let StatsJson = await ServerStats.get(`Stats_${clan.id}`);
            if(StatsJson !== undefined) {

                let totUsers = StatsJson.totUsers
                let memberCount = StatsJson.memberCount
                let botCount = StatsJson.botCount
                let online = StatsJson.online

                if (totUsers !== undefined || memberCount !== undefined || botCount !== undefined || online !== undefined) {
                    try {
                        await clan.channels.cache.find(channel => channel.id === totUsers).setName("🌍 Total Users : " + totalSize)
                        await clan.channels.cache.find(channel => channel.id === memberCount).setName("🤵 Human Users  : " + humanSize)
                        await clan.channels.cache.find(channel => channel.id === botCount).setName("🤖 Bot Users : " + botSize)
                        await clan.channels.cache.find(channel => channel.id === online).setName("🔴 Online Users: " + onlineSize)
                        winston.info("------------------Stats updated for " + clan.name + "------------------")
                    } catch (e) {
                        winston.info("------------------Couldn't update " + clan.name + "------------------")
                    }

                }
            }
        }
    }
}

async function finer(client,string){
    let find = await client.channels.cache.find(channel => channel.name.includes(string))
    if (find !== undefined) find.delete();
}
