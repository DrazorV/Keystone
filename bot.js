const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const fs = require('fs');
require('dotenv').config()
const winston = require('./utils/winston');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    winston.info(`Attempting to load command ${commandName}`);
    client.commands.set(command.name, command);
}

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    let eventName  = file.split(".")[0];
    winston.info(`Attempting to load event ${eventName}`);
    client.on(eventName ,event.bind(null,client));
}

client.on("disconnect",() => winston.info("I just disconnected, just making sure you know, I will reconnect now.."));
client.on("guildDelete", guild => {winston.info("Left a guild: " + guild.name)});

client.login(process.env.TOKEN).catch(error => winston.info(error));