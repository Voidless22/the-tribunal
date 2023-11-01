
const { ChannelType, ModalSubmitInteraction } = require('discord.js');
const ExtendedClient = require('./class/ExtendedClient');
const db = require('./db')

async function getStaffRoleId(guildId) {
    const sql = "SELECT staff_role_id FROM guilds WHERE guild_id =?";
    const values = [guildId]
    const results = await db.dbQuery(sql, values, "Discord")
    return results[0].staff_role_id;
}

async function getStaffPetitionCategory(guildId) {
    const sql = "SELECT staff_petition_category FROM guilds WHERE guild_id = ?";
    const values = [guildId]
    const results = await db.dbQuery(sql, values, "Discord")
    return results[0].staff_petition_category;
}

async function getPetitionChannel(guildId) {
    const sql = "SELECT ticket_channel_id FROM guilds WHERE guild_id = ?";
    const values = [guildId]
    const results = await db.dbQuery(sql, values, "Discord")
    return results[0].ticket_channel_id;
}
async function confirmCharAccount(charName, accountName) {
    const sql = "SELECT name, charname FROM account WHERE name like ? AND charname like ?";
    const values = [accountName, charName]
    const results = await db.dbQuery(sql, values, "PQ")
    console.log(results)
    return results
}

async function confirmCharExists(charName) {
    const sql = "SELECT charname FROM account WHERE charname like ?";
    const values = [charName]
    const results = await db.dbQuery(sql, values, "PQ")
    console.log(results)
    return results
}
async function createPetitionThread(threadName, petitionSection) {
    // If it does exist, create a new thread with the formatting of **submitting character** - **other characters involved** in the staff only section under the petition type channel
    if (petitionSection) {
        await petitionSection.threads.create({
            name: threadName,
            autoArchiveDuration: 10080,
            type: ChannelType.PrivateThread
        });
        // Join the thread so we can see and send messages
        petitionSection.threads.cache.find(thread => thread.name == threadName).join();
    }



}

module.exports = {
    getStaffPetitionCategory: getStaffPetitionCategory,
    getPetitionChannel: getPetitionChannel,
    createPetitionThread: createPetitionThread,
    getStaffRoleId: getStaffRoleId,
    confirmCharAccount: confirmCharAccount,
    confirmCharExists: confirmCharExists
}
