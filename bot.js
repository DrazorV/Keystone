const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const Enmap = require("enmap");
const http = require('http');
const app = require('express')();
const { Player } = require("discord-music-player"); // Require the module
const player = new Player(client, process.env.google_api);
client.commands = new Enmap();
client.player = player;


const init = async () => {
    fs.readdir("./commands/",(err,files) =>{
        if (err) return console.error(err);
        files.forEach(file => {
            if (!file.endsWith(".js")) return;
            const command = require(`./commands/${file}`);
            let commandName = file.split(".")[0];
            console.log(`Attempting to load command ${commandName}`);
            client.commands.set(commandName,command)
        });
    });

    fs.readdir("./events/",(err,files) =>{
        if (err) return console.error(err);
        files.forEach(file => {
            const event = require(`./events/${file}`);
            let eventName  = file.split(".")[0];
            console.log(`Attempting to load event ${eventName}`);
            client.on(eventName ,event.bind(null,client));
        });
    });
    client.login(process.env.TOKEN).catch(error => console.log(error));
};
app.get("/", (request, response) => {
    console.log(Date.now() + " Ping Received");
    response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.herokuapp.com/`);
},200000);
init().then();


