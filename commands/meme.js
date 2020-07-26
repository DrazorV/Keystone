const db = require('quick.db');
const Server = new db.table('Server',null);
const setdefault = require("./setdefault")
const embed = require("../utils/embed")
const reddit = require("../utils/reddit")

const subreddits = {
    "en": ['memes', 'dankmemes', 'meirl'],
};


module.exports.run = async (client,message)=>{
    const defaultChannel = Server.fetch(`Server_${message.guild.id}`,{ target: '.meme' });

    if(defaultChannel === undefined){
        await setdefault.meme(client, message);
    }

    const url = `https://www.reddit.com/r/${subreddits.en[reddit.randomNumber(subreddits.en.length)]}/hot/.json?count=100`;
    let data = await reddit.build(url);

    let field = {
        name: "You can find more on the the subreddit: ",
        value:" https://www.reddit.com/r/" + data.subreddit
    }

    let fields = [field]


    let emb = await embed.create(
        null,
        null,
        "Here is the meme you ordered! 📦",
        "🚛 Title: \n" + data.title,
        fields,
        "https://www.reddit.com" + data.permalink,
        message.member.roles.color.color,
        "Automated message",
        "https://i.imgur.com/5Px5FeR.png",
        data.url
    )

    await message.channel.send(emb);
};


exports.job = async (client,message)=>{

    let clans = client.guilds.cache.array();
    while (clans.length > 0){
        let clan = clans.pop();
        const defaultChannel = Server.fetch(`Server_${clan.id}`,{ target: '.meme' });


        if(defaultChannel !== undefined){
            const url = `https://www.reddit.com/r/${subreddits.en[reddit.randomNumber(subreddits.en.length)]}/hot/.json?count=100`;

            let data = await reddit.build(url);

            let field = {
                name: "You can find more on the the subreddit: ",
                value:" https://www.reddit.com/r/" + data.subreddit
            }

            let fields = [field]

            let emb = await embed.create(
                null,
                null,
                "⚡Meme of the Day! 📦 ",
                "🚛 Title: \n" + data.title,
                fields,
                "https://www.reddit.com" + data.permalink,
                '#017E2D',
                "Automated message",
                data.thumbnail,
                data.url
            )

            await message.channel.send(emb);
        }
    }
};