const prefixs = require("../data/prefixs.json");
const fs = require('fs');
const guilds = require( "../data/guilds.json");


module.exports = (client, guild) =>{
    prefixs[guild.id] = "/";
    guilds[guild.id] = "";
    fs.writeFileSync(__dirname + "/data/guilds.json",JSON.stringify(guilds,null,"\t"),"utf8");
    fs.writeFileSync(__dirname + "/data/guilds.json",JSON.stringify(prefixs,null,"\t"),"utf8");
    console.log("Joined a new guild: " + guild.name);
    console.log(prefixs);
};