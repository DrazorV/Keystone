const Axios = require('axios');
const db = require('quick.db');
const Server = new db.table('Server',null);
const setdefault = require("./setdefault")
const embed = require("../utils/embed")

const subreddits = {
    "en": ['memes', 'dankmemes', 'meirl'],
};


module.exports.run = async (client,message,args)=>{
    const defaultChannel = Server.fetch(`Server_${message.guild.id}`,{ target: '.default' });
    if(defaultChannel === ""){
        await setdefault.run(client, message, args);
    }
    const url = `https://www.reddit.com/r/${subreddits.en[randomNumber(subreddits.en.length)]}/hot/.json?count=100`;
    let data = await buildMeme(url);

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
        data.thumbnail,
        data.url
    )

    await message.channel.send(emb);
};


exports.job = async (client,message,args)=>{

    let clans = client.guilds.cache.array();
    while (clans.length > 0){
        let clan = clans.pop();
        const defaultChannel = Server.fetch(`Server_${clan.id}`,{ target: '.default' });
        if(defaultChannel !== ""){
            const url = `https://www.reddit.com/r/${subreddits.en[randomNumber(subreddits.en.length)]}/hot/.json?count=100`;

            let field = {
                name: "You can find more on the the subreddit: ",
                value:" https://www.reddit.com/r/" + data.subreddit
            }

            let fields = [field]

            let data = await buildMeme(url);

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
