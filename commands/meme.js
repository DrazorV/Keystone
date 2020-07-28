const Keyv = require("keyv");
const db = new Keyv('sqlite://json.sqlite', {
    table:"Server",
});

const setdefault = require("./setdefault")
const embed = require("../utils/embed")
const reddit = require("../utils/reddit")

const subreddits = {
    "en": ['memes', 'dankmemes', 'meirl'],
};


module.exports.run = async (client,message)=>{
    let json = await db.get(`Server_${message.guild.id}`);
    const defaultChannel = json.meme;

    if(defaultChannel === undefined || defaultChannel === ""){
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


exports.job = async (client)=>{
    let clans = client.guilds.cache.array();
    for(let clan of clans){
        let json = await db.get(`Server_${clan.id}`);
        const defaultChannel = json.meme;


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

            clan.channels.cache.find(channel => channel.id === defaultChannel).send(emb)
        }
    }
};