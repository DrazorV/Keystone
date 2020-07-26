const db = require('quick.db');
const Server = new db.table('Server',null);


module.exports = (client, guild) =>{
    Server.set(`Server_${guild.id}`, {
        prefix: "/",
        meme: "",
        food: ""
    })

    let a = guild.channels.cache.find(channel =>
        channel.name.includes("general") ||
        channel.name.includes("welcome") ||
        channel.name.includes("main") ||
        channel.name.includes("lobby") ||
        channel.name.includes("chat")
    )

    console.log(a)

    console.log("Joined a new guild: " + guild.name);
};