const guilds = require("../data/guilds");
const meme = require("./meme.js");

exports.run = async (client,message,args)=>{
    if(message.member.hasPermission("ADMINISTRATOR")) {
        const fs = require('fs');
        const channels = message.guild.channels.cache.array();
        while (channels.length > 0) {
            const target = channels.pop();
            if ((message.channel === target.name) || (message.channel === target.id)) {
                guilds[message.guild.id] = target.id;
                fs.writeFileSync("/data/guilds.json", JSON.stringify(guilds,null,"\t"), "utf8");
                target.send("🚧 This is the default channel for memes.");
                return;
            }
        }
        await message.channel.send("❌ This channel does not exist!");
    }else{
        await message.channel.send("❌ You need to be an admin to change the prefix of the bot.")
    }
};

exports.job = async (client,message,args)=>{
    let clans = client.guilds.cache.array();
    while (clans.length > 0){
        let clan = clans.pop();
        JSON.stringify(guilds);
        if(guilds[clan.id]!==""){
            await meme.schedule(clan.channels.cache.get(guilds[clan.id]));
        }
    }
};