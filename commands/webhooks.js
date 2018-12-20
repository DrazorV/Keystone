const Discord = require('discord.js');

exports.run = async (client,message,args)=>{
    const embed = new Discord.RichEmbed();
    //  message.channel.createWebhook('Keystone⏳', 'https://i.imgur.com/5Px5FeR.png')
    //.then(webhook => console.log(`Created webhook ${webhook}`))
    //.catch(console.error);

    embedmaker(embed);
    choices(embed);
    message.channel.send(embed);
    const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 100000 });
    collector.on("collect",response =>{
        switch(response.content) {
            case "1":
                const embed0 = new Discord.RichEmbed();
                embedmaker(embed0);
                embed0.setDescription("Time to choose subreddit");
                embed0.addField("Please insert the link of the subreddit","Example: https://www.reddit.com/r/gaming",false);
                message.channel.send(embed0);
                return;
            case "2":
                const embed1 = new Discord.RichEmbed();
                embedmaker(embed1);
                embed1.setDescription("Time to choose hashtag");
                embed1.addField("Please insert the Instagram hashtag","Example: https://www.instagram.com/explore/tags/gaming/",false)
                message.channel.send(embed1);
                return;
            default:
                const embed2 = new Discord.RichEmbed();
                embedmaker(embed2);
                choices(embed2);
                embed2.setDescription("❌ Please type a valid number 🔢");
                message.channel.send(embed2);
        }
    });
};


function embedmaker(embed) {
    embed.setDescription("Where would you like your webhook to be posting data from:");
    embed.setTitle("Webhook Creation 🎣");
    embed.setColor([255,90,0]);
    embed.setTimestamp(new Date());
    embed.setFooter("Automated message", "https://i.imgur.com/5Px5FeR.png");
}

function choices(embed) {
    embed.addField("1. Reddit 📕","Create a webhook for hot new posts of a specific subreddit",false);
    embed.addField("2. Instagram 📷","Create a webhook for all the new posts of a hashtag",false);
}

