const embed = require("../utils/embed")
const PornSearch = require('pornsearch');

exports.run = async (client,message,args)=>{
    if(message.channel.nsfw) {
        let mes = args.join(" ");
        let result = null;
        if(mes==="") mes = "porn";
        const Searcher = new PornSearch(mes,"Pornhub");
        try {
            result = Searcher.gifs();
        }catch (error) {
            console.log(error)
        }
        let emb;
        if(result != null) {
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
        }else{
            await message.channel.send("❌No results for '"+mes+"'.")
        }
    }else{
        await message.channel.send("❌You have to be in a NSFW🔞 channel to use this command")
    }
};
