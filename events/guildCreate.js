const Keyv = require("keyv");
const db = new Keyv('sqlite://json.sqlite', {
    table:"Server",
});

const ServerStats = new Keyv('sqlite://json.sqlite', {
    table:"ServerStats",
});



module.exports = async (client, guild) => {
    await db.set(`Server_${guild.id}`, {
        prefix: "/",
        meme: "",
        food: ""
    }).then()

    await ServerStats.set(`Stats_${guild.id}`, {
        guildId: guild.id,
        totUsers: undefined,
        memberCount: undefined,
        botCount: undefined,
        online: undefined,
        categoryId: undefined
    }).then()



    console.log("Joined a new guild: " + guild.name);
};