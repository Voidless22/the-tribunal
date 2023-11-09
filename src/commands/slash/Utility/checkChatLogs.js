const { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const db = require('../../../db')
const config = require('../../../config');
const utils = require('../../../utils');
module.exports = {
    structure: new SlashCommandBuilder()
        .setName('checkchatlogs')
        .setDescription('SQL query test')
        .addStringOption(option =>
            option.setName("characters")
                .setDescription('Character Names')
                .setRequired(true)),

    run: async (client, interaction, args) => {

        const charName = interaction.options.getString('characters');
        const charNameArray = utils.seperateValues(charName).map(entry => entry.replace(/["\s,]/g, '')).filter(Boolean);

        const results = await utils.queryChatLogs(charNameArray)
  
            let logs = [];
            for(let i=0; i <= results.length ; i++) {
                let timestamp = utils.formatDate(results[i].timerecorded);
                let fromUser = results[i].from;
                let toUser = results[i].to;
                let messageContent = results[i].message
                let fieldTitle = `**[${timestamp}] From: ${fromUser} To: ${toUser}**`
                
                logs.push(`[${fieldTitle}] ${messageContent}`)
            }

        logs = logs.reverse()
        let logsTxt = logs.join('\n');
        
        utils.writeToFileWithTiming(logsTxt, `${charName}-Chat-Logs.txt`);

        if (results.length != 0) {
            await interaction.channel.send({files: [`${charName}-Chat-Logs.txt`] })
            utils.deleteFile(`${charName}-Chat-Logs.txt`);
            await interaction.reply("Success.")

        }
        else {
            await interaction.reply("Error")
        }

    }
};
