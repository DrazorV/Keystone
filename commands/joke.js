const reddit = require("../utils/reddit")

const subreddits = {
    "en": ['jokes','oneliners','dirtyjokes','dadjokes'],
};

module.exports = {
    name: 'joke',
    description: '',
    aliases: ['j', 'jokes', 'pun'],
    usage: '[command]',
    async run(client, message) {
        const url = `https://www.reddit.com/r/${subreddits.en[reddit.randomNumber(subreddits.en.length)]}/new/.json?limit=100?count=` + (Math.floor(Math.random() * 1000) + 1);
        let data = await reddit.joke(url);

        await message.channel.send("```" + data.title + "\n\n" + data.selftext + " \n\n-" + data.author + "```")
    }
}