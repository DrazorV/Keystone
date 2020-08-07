const Keyv = require("keyv");
const db = new Keyv('sqlite://json.sqlite', {
    table:"Server",
});

const embed = require("../utils/embed")
const reddit = require("../utils/reddit")

const subreddits = {
    "en": ['foodporn'],
};


module.exports = {
    name: 'food',
    description: '',
    aliases: ['f','fd'],
    usage: '[command]',
    async run (client,message) {
        let json = await db.get(`Server_${message.guild.id}`);
        const defaultChannel = json.food;

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
            "Here is the food you ordered! 📦",
            "🚛 Title: \n" + data.title,
            fields,
            "https://www.reddit.com" + data.permalink,
            message.member.roles.color.color,
            "Automated message",
            "https://i.imgur.com/5Px5FeR.png",
            data.url
        )

        if(defaultChannel === undefined || defaultChannel === "")
            await message.channel.send(emb);
        else
            await message.guild.channels.cache.find(channel => channel.id === defaultChannel).send(emb)
    },

    async job (client){
        let clans = client.guilds.cache.array();
        for(let clan of clans){
            let json = await db.get(`Server_${clan.id}`);
            const defaultChannel = json.food;

            if(defaultChannel !== "" && defaultChannel !== undefined){
                const url = `https://www.reddit.com/r/${subreddits.en[reddit.randomNumber(subreddits.en.length)]}/hot/.json?limit=100?count=` + (Math.floor(Math.random() * 1000) + 1);

                let data = await reddit.build(url);

                let field = {
                    name: "You can find more on the the subreddit: ",
                    value:" https://www.reddit.com/r/" + data.subreddit
                }

                let fields = [field]

                let emb = await embed.create(
                    null,
                    null,
                    "⚡Food of the Day! 📦 ",
                    "🚛 Title: \n" + data.title,
                    fields,
                    "https://www.reddit.com" + data.permalink,
                    '#017E2D',
                    "Automated message",
                    "https://i.imgur.com/5Px5FeR.png",
                    data.url
                )

                await clan.channels.cache.find(channel => channel.id === defaultChannel).send(emb);
            }
        }
    }
}
