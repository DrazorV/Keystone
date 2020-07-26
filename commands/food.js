const Axios = require('axios');
const db = require('quick.db');
const Server = new db.table('Server',null);
const setdefault = require("./setdefault")
const embed = require("../utils/embed")

const subreddits = {
    "en": ['foodporn'],
};


module.exports.run = async (client,message,args)=>{
    const defaultChannel = Server.fetch(`Server_${message.guild.id}`,{ target: '.food' });

    if(defaultChannel === undefined){
        await setdefault.food(client, message);
    }

    const url = `https://www.reddit.com/r/${subreddits.en[randomNumber(subreddits.en.length)]}/hot/.json?count=100`;
    let data = await buildFood(url);

    let field = {
        name: "You can find more on the the subreddit: ",
        value:" https://www.reddit.com/r/" + data.subreddit
    }

    let fields = [field]

    let emb = await embed.create(
        null,
        null,
        "Here is the food you ordered! 📦",
        "🚛 Title: \n" + data.title,
        fields,
        "https://www.reddit.com" + data.permalink,
        message.member.roles.color.color,
        "Automated message",
        data.thumbnail,
        data.url
    )

    await message.channel.send(emb);
};


exports.job = async (client,message)=>{

    let clans = client.guilds.cache.array();
    while (clans.length > 0){
        let clan = clans.pop();
        const defaultChannel = Server.fetch(`Server_${clan.id}`,{ target: '.default' });
        if(defaultChannel !== undefined){
            const url = `https://www.reddit.com/r/${subreddits.en[randomNumber(subreddits.en.length)]}/hot/.json?count=100`;

            let data = await buildFood(url);

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
                "https://i.imgur.com/5Px5FeR.png",
                data.url
            )

            await message.channel.send(emb);
        }
    }
};

function randomNumber(nm) {
    return Math.floor(Math.random() * nm);
}

function checkURL(url) {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}

async function buildFood(url) {
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
