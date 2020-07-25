const embed = require("../utils/embed")

exports.run = async (client,message,args)=>{
    message.channel.send("Pinging ...").then((msg) => msg.delete());
    let field = {
        name:"⏱Server",
        value: Math.round(message.client.ws.ping) + ' ms'
    }
    let field1 = {
        name: "⌛Keystone" ,
        value: Math.abs(Date.now() - message.createdTimestamp) + ' ms'
    }

    let fields = [field, field1]
    let emb = await embed.create(
        null,
        null,
        "Keystone ⏳",
        null,
        fields,
        null,
        0x2ed32e,
        "Automated message",
        message.guild.iconURL,
    )

    await message.channel.send(emb);
};