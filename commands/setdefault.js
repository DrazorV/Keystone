const db = require('quick.db');
const Server = new db.table('Server',null);

exports.run = async (client,message,args)=>{
    if(message.member.hasPermission("ADMINISTRATOR")) {
        const channels = message.guild.channels.cache.array();
        while (channels.length > 0) {
            const target = channels.pop();
            if ((args[0].name === target.name) || (args[0] === target.id)) {
                Server.set(`Server_${message.guild.id}.meme`, target.id)
                target.send("🚧 This is the default channel for memes.");
                return;
            }
        }
        await message.channel.send("❌ This channel does not exist!");
    }else{
        await message.channel.send("❌ You need to be an admin to do that.")
    }
};



exports.meme = async (client,message)=>{
    if(message.member.hasPermission("ADMINISTRATOR")) {
        Server.set(`Server_${message.guild.id}.meme`, message.channel.id)
        await message.channel.send("🚧 This is the default channel for memes.");
    }else{
        await message.channel.send("❌ You need to be an admin to do that.")
    }
};

exports.food = async (client,message)=>{
    if(message.member.hasPermission("ADMINISTRATOR")) {
        Server.set(`Server_${message.guild.id}.food`, message.channel.id)
        await message.channel.send("🍔 This is the default channel for food.");
    }else{
        await message.channel.send("❌ You need to be an admin to do that.")
    }
};