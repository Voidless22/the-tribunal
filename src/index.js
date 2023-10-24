require('dotenv').config();
const ExtendedClient = require('./class/ExtendedClient');
const mysql = require('mysql')
const client = new ExtendedClient();
client.start();

const db = require('./db')



client.on('guildCreate', async (guild) => {
        db.connect(function (err) {
            if (err) throw err;
            console.log('Connected to the database.');
            db.query(`INSERT INTO guilds (guild_id, owner_id) VALUES ('${guild.id}', '${guild.ownerId}')`)
            console.log(`Guild ${guild.name} (${guild.id}) has been added to the database.`)
        })  

});



// Handles errors and avoids crashes, better to not remove them.
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);