require('dotenv').config();
const ExtendedClient = require('./class/ExtendedClient');
const mysql = require('mysql')
const db = require('./db')
const client = new ExtendedClient();
client.start();

client.on('guildCreate', async (guild) => {
    await db.dbQuery("INSERT INTO guilds (guild_id, owner_id) VALUES (?, ?)", [guild.id, guild.ownerId], "Discord");
    console.log(`Guild ${guild.name} (${guild.id}) has been added to the database.`)
});

// Handles errors and avoids crashes, better to not remove them.
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);