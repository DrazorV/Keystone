const Discord = require('discord.js');
const config = require('./lib/config.json');
const client = new Discord.Client();







client.on('ready',()=> {
    console.log("I am ready!");
});

client.on('message', (message) => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    if (message.content.substring(0,1) == config.prefix) {
        const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        let cmd = args.shift().toLowerCase();
        switch(cmd) {
            case 'ping':
                message.channel.send("pong!")
                break;
            case "come" :

                let targets = message.mentions.users.array();
                while (targets.length>0){
                    console.log(targets.pop().username);
                }

        }
    }
});

client.login(config.token);