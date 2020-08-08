const winston = require('../utils/winston');
const Keyv = require("keyv");
const db = new Keyv('sqlite://json.sqlite', {
    table:"Server",
});

module.exports = async (client, guild) => {
    await db.delete(`Server_${guild.id}`).then()
    winston.info("Left a guild: " + guild.name);
}
