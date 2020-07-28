const Keyv = require("keyv");
const db = new Keyv('sqlite://json.sqlite', {
    table:"Server",
});

exports.run = async (client,message,args)=>{
    let channel;
    if (message.member.hasPermission("ADMINISTRATOR")) {
        if (args[0] === undefined) {
            let answer = "";
            await message.channel.send("❌ You didn't choose a channel!");
            await message.channel.send("❓ Do you want to make this as the default channel [Y/N]?");
            await message.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                time: 30000
            }).then(collected => {
                answer = collected.first().content;
            }).catch(() => {
                return message.channel.send("I've got tired of waiting! 😫 \nPlease try again! 🔁");
            })
            if (answer.toLowerCase() === "y") channel = message.channel
        } else {
            const channels = message.guild.channels.cache.array();
            for (let target of channels) if (target.name.includes(args[0]) || (args[0] === target.id)) channel = target;
        }
        if (channel === undefined) return await message.channel.send("❌ This channel does not exist!");
        let json = await db.get(`Server_${message.guild.id}`);
        await db.set(`Server_${message.guild.id}`, {
            prefix: json.prefix,
            meme: channel.id,
            food: json.food
        });
        channel.send("🚧 This is the default channel for memes.");
    } else {
        await message.channel.send("❌ You need to be an admin to do that.")
    }
};



exports.meme = async (client,message)=>{
    if(message.member.hasPermission("ADMINISTRATOR")) {
        let json = await db.get(`Server_${message.guild.id}`);
        await db.set(`Server_${message.guild.id}`,{
            prefix: json.prefix,
            meme: message.channel.id,
            food: json.food
        });
        await message.channel.send("🚧 This is the default channel for memes.");
    }else{
        await message.channel.send("❌ You need to be an admin to do that.")
    }
};

exports.food = async (client,message)=>{
    if(message.member.hasPermission("ADMINISTRATOR")) {
        let json = await db.get(`Server_${message.guild.id}`);
        await db.set(`Server_${message.guild.id}`, {
            prefix: json.prefix,
            meme: json.meme,
            food: message.channel.id
        });
        await message.channel.send("🍔 This is the default channel for food.");
    }else{
        await message.channel.send("❌ You need to be an admin to do that.")
    }
};