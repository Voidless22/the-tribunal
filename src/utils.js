const { ChannelType, ModalSubmitInteraction } = require("discord.js");
const ExtendedClient = require("./class/ExtendedClient");
const fs = require("fs");
const db = require("./db");

// returns staff role id
async function getStaffRoleId(guildId) {
  const sql = "SELECT staff_role_id FROM guilds WHERE guild_id =?";
  const values = [guildId];
  try {
    const results = await db.dbQuery(sql, values, "Discord");
    return results[0].staff_role_id;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
// returns channel id

async function getStaffPetitionCategory(guildId) {
  const sql = "SELECT staff_petition_category FROM guilds WHERE guild_id = ?";
  const values = [guildId];
  try {
    const results = await db.dbQuery(sql, values, "Discord");
    return results[0].staff_petition_category;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function getPetitionChannel(guildId) {
  const sql = "SELECT ticket_channel_id FROM guilds WHERE guild_id = ?";
  const values = [guildId];
  try {
    const results = await db.dbQuery(sql, values, "Discord");
    return results[0].ticket_channel_id;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
// returns true if supplied values are found
async function confirmUserInfo(charName, accountName) {
  const sql =
    "SELECT name, charname FROM account WHERE name like ? AND charname like ?";
  const values = [accountName, charName];
  try {
    const results = await db.dbQuery(sql, values, "PQ");
    if (results.length != 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//
async function findCharacterId(charName) {
  const sql = "SELECT id FROM character_data WHERE name like ?";
  const values = [charName];
  try {
    const results = await db.dbQuery(sql, values, "PQ");
    return results[0].id;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function queryChatLogs(charName) {
  const sql =
    "SELECT * FROM qs_player_speech WHERE `from` in (?) OR `to` in (?) ORDER BY timerecorded DESC;";
  const values = [charName, charName];

  try {
    const results = await db.dbQuery(sql, values, "PQ");
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function verifyItemExists(item) {
  const sql = "SELECT id FROM items WHERE Name in (?)";
  const values = [item];
  try {
    const queryResults = await db.dbQuery(sql, values, "PQ");
    return queryResults;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function validateInput(inputType, input) {
  let query;
  let queryValues;
  let queryResults;
  switch (inputType) {
    case 'Account':
      query = "SELECT name, charname FROM account WHERE name LIKE ? AND charname LIKE ?"
      queryValues = [input.accountName, input.charName]

      break;
    case 'Item Exists':
      query = "SELECT name, id FROM items WHERE name in (?)"
      queryValues = [input.itemName]
      break;
    case 'Character Exists':
      query = "SELECT name,id FROM character_data WHERE name LIKE ?"
      queryValues = [input.charName];
      break;
    case 'Guild Exists':
      query = "SELECT name,id FROM guilds WHERE name LIKE ?";
      queryValues = [input.guildName];
      break;
  }
  try {
    queryResults = await db.dbQuery(query, queryValues, "PQ");
    console.log(queryResults.length)
  } catch (error) {
    console.error(error);
    throw error;
  }

  if (queryResults.length > 0) { return true; } else { return false; }
}


async function createPetitionThread(threadName, petitionSection) {
  // If it does exist, create a new thread with the formatting of **submitting character** - **other characters involved** in the staff only section under the petition type channel
  if (petitionSection) {
    await petitionSection.threads.create({
      name: threadName,
      autoArchiveDuration: 10080,
      type: ChannelType.PrivateThread,
    });
    // Join the thread so we can see and send messages
    petitionSection.threads.cache
      .find((thread) => thread.name == threadName)
      .join();
  }
}




function seperateValues(values) {
  return values.split(/(?<![A-Za-z])|(?![A-Za-z])/);
}

module.exports = {
  getStaffPetitionCategory: getStaffPetitionCategory,
  getPetitionChannel: getPetitionChannel,
  createPetitionThread: createPetitionThread,
  getStaffRoleId: getStaffRoleId,
  validateCharAccount: confirmUserInfo,
  confirmCharExists: findCharacterId,
  seperateValues: seperateValues,
  queryChatLogs: queryChatLogs,
  verifyItemExists: verifyItemExists,
  validateInput:validateInput
};
