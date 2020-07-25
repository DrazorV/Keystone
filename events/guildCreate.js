const db = require('quick.db');
const Server = new db.table('Server',null);


module.exports = (client, guild) =>{
    Server.set(`Server_${guild.id}`, {
        prefix: "/",
        default: "",
    })
    console.log("Joined a new guild: " + guild.name);
};