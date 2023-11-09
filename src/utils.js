
const { ChannelType, ModalSubmitInteraction } = require('discord.js');
const ExtendedClient = require('./class/ExtendedClient');
const fs = require('fs')
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
async function validateCharAccount(charName, accountName) {
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

async function queryChatLogs(charName) {

    const sql = 'SELECT * FROM qs_player_speech WHERE `from` in (?) OR `to` in (?) ORDER BY timerecorded DESC';
    const values = [charName, charName];

    try {
        const results = await db.dbQuery(sql, values, "PQ");
        return results;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
function formatDate(inputDate) {
    const date = new Date(inputDate); // Parse the input string into a Date object

    // Extract individual components
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Format the components as Month/Day/Year Hour:Minutes
    const formattedDate = `${month}/${day}/${year} ${hour}:${minutes}`;

    return formattedDate;
}

function seperateValues(values) {
    return values.split(/(?<![A-Za-z])|(?![A-Za-z])/);
}

function writeToFileWithTiming(data, filePath) {
    // Record the start time
    const startTime = new Date().getTime();
  
    // Write data to the file asynchronously
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        // Record the end time
        const endTime = new Date().getTime();
  
        // Calculate the time taken to write the file
        const timeTaken = endTime - startTime;
  
        console.log(`Data has been written to the file in ${timeTaken} milliseconds.`);
        

    }
    });
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

function deleteFile(filePath) {
    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting the file:', err);
      } else {
        console.log('File deleted successfully.');
      }
    });
  }

module.exports = {
    getStaffPetitionCategory: getStaffPetitionCategory,
    getPetitionChannel: getPetitionChannel,
    createPetitionThread: createPetitionThread,
    getStaffRoleId: getStaffRoleId,
    validateCharAccount: validateCharAccount,
    confirmCharExists: confirmCharExists,
    seperateValues: seperateValues,
    queryChatLogs: queryChatLogs,
    formatDate: formatDate,
    writeToFileWithTiming:writeToFileWithTiming,
    deleteFile:deleteFile
}
