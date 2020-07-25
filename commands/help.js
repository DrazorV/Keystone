const db = require('quick.db');
const Server = new db.table('Server',null);
const embed = require("../utils/embed")

exports.run = async (client,message,args)=>{

    const prefix = Server.fetch(`Server_${message.guild.id}`,{ target: '.prefix' });

    let field = {
        name: prefix + "avatar @mention",
        value: "🎴 Gives you a link with his avatar"
    }
    let field1 = {
        name: prefix + "come @mention",
        value: "🤙 Informs one or more server members that you are waiting for them in one of the voice channels"
    }
    let field2 = {
        name: prefix + "default [name/id]",
        value: "🗓️ Sets the channel where the bot posts memes daily"
    }
    let field3 = {
        name: prefix + "meme",
        value: "🚧 To get a random meme from a huge collection"
    }
    let field4 = {
        name: prefix + "ping",
        value: "🏓 Checks the ping of the server"
    }
    let field5 = {
        name: prefix + "porn [input]",
        value: "🔞 To get a random porn gif based on the input"
    }
    let field6 = {
        name: prefix + "prefix",
        value: "🏷️ Lets you change the default prefix"
    }
    let field7 = {
        name: "@Keystone",
        value: "💡 If you ever forget the bot prefix, just mention it!"
    }


    let fields = [field, field1, field2, field3, field4, field5, field6, field7]
    let emb = await embed.create(
        null,
        null,
        "List of Commands 📋",
        null,
        fields,
        "https://github.com/DrazorV/Keystone",
        [255,90,0],
        "Automated message",
        "https://i.imgur.com/5Px5FeR.png",
        null
    )

    await message.channel.send(emb);
};