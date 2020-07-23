const Discord = require('discord.js');
const Axios = require('axios');
const guilds = require("../data/guilds");
const setdefault = require("./setdefault")

const subreddits = {
    "en": ['memes', 'dankmemes', 'meirl'],
};


module.exports.run = async (client,message,args)=>{
    if(guilds[message.guild.id]===""){
        await setdefault.run(client, message, args);
    }
    const url = `https://www.reddit.com/r/${subreddits.en[randomNumber(subreddits.en.length)]}/hot/.json?count=100`;
    await message.channel.send(createEmbed(message, await buildMeme(url)));
};


exports.job = async (client,message,args)=>{
    let clans = client.guilds.cache.array();
    while (clans.length > 0){
        let clan = clans.pop();
        JSON.stringify(guilds);
        if(guilds[clan.id]!==""){
            const url = `https://www.reddit.com/r/${subreddits.en[randomNumber(subreddits.en.length)]}/hot/.json?count=100`;
            await message.channel.send(createEmbed2(await buildMeme(url)));
        }
    }
};

function randomNumber(nm) {
    return Math.floor(Math.random() * nm);
}

function checkURL(url) {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}

async function buildMeme(url) {
    try {
        const result = await Axios.get(url);

        if (result.status === 200) {
            const children = result.data.data.children;
            let post = children[randomNumber(children.length)].data;
            let trys = 0;

            while (!checkURL(post.url)) {
                post = children[randomNumber(children.length)].data;
                if (trys >= 50) new Error('Cannot get image post from ' + url)
                trys++;
            }
            return post;
        } else new Error('Cannot get image post from ' + url);

    } catch (e) {
        throw new Error(e);
    }
}

function createEmbed(message, data) {
    const embed = new Discord.MessageEmbed();
    embed.setURL("https://www.reddit.com" + data.permalink);
    embed.setTitle("Here is the meme you ordered! 📦");
    embed.setDescription("🚛 Title: \n" + data.title);
    embed.addField("You can find more on the the subreddit: ", "https://www.reddit.com/r/" + data.subreddit, false);
    embed.setImage(data.url);
    embed.setColor(message.member.roles.color.color);
    embed.setTimestamp(new Date());
    embed.setFooter("Automated message", data.thumbnail);
    return embed;
}


function createEmbed2(data) {
    const embed = new Discord.MessageEmbed();
    embed.setURL("https://www.reddit.com" + data.permalink);
    embed.setTitle("⚡Meme of the Day! 📦 ");
    embed.setDescription("🚛 Title: " + data.title);
    embed.addField("You can find more on the the subreddit: ", "https://www.reddit.com/r/" + data.subreddit, false);
    embed.setImage(data.url);
    embed.setColor('#017E2D');
    embed.setTimestamp(new Date());
    embed.setFooter("Automated message", data.thumbnail);
    return embed;
}