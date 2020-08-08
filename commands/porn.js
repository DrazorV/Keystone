const winston = require('../utils/winston');
const embed = require("../utils/embed")
const PornSearch = require('pornsearch');

module.exports = {
    name: 'porn',
    description: '',
    aliases: ['pornhub','prn','porno'],
    usage: '[command]',
    args: true,
    cooldown: 15,
    async run(client, message, args) {
        if (message.channel.nsfw) {
            let mes = args.join(" ");
            let result = null;
            if (mes === "") mes = "porn";
            const Searcher = new PornSearch(mes, "Pornhub");
            try {
                result = Searcher.gifs();
            } catch (error) {
                winston.error(error)
            }
            let emb;
            if (result != null) {
                let gif;
                result.then(gifs => {
                    gif = gifs[Math.floor(Math.random() * gifs.length)];
                    emb = embed.create(
                        null,
                        null,
                        "Here is the " + mes + " you ordered! 📦",
                        null,
                        null,
                        gif.url,
                        message.member.roles.color.color,
                        "Automated message",
                        message.guild.iconURL(),
                        gif.url
                    )

                    message.channel.send(emb).then(sent => {
                        sent.delete({
                            timeout: 600000
                        })
                    })
                })
            } else await message.channel.send("❌No results for '" + mes + "'.")
        } else await message.channel.send("❌You have to be in a NSFW🔞 channel to use this command")

    }
}
