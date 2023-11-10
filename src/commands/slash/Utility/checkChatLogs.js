const { ChatInputCommandInteraction, SlashCommandBuilder, MessagePayload, ChannelType, AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField } = require('discord.js');
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

        let results = await utils.queryChatLogs(charNameArray)
        console.log(results[0].timerecorded)
        let logs = [];
        for (let i = 0; i < results.length; i++) {
            let timestamp = results[i].timerecorded;
            let fromUser = results[i].from;
            let toUser = results[i].to;
            let messageContent = results[i].message;
            let fieldTitle = `**[${timestamp}] From: ${fromUser} To: ${toUser}**`;

            logs.push(`[${fieldTitle}] ${messageContent}`);
        }

        logs = logs.reverse()
        let logsTxt = logs.join('\n');
        const buffer = Buffer.from(logsTxt);
        const attachment = new AttachmentBuilder()
            .setFile(buffer, `${charName}-Chat-Logs.txt`)
            .setName(`${charName}-chat-logs.txt`)


        if (results.length != 0) {
            await interaction.channel.send({ files: [attachment] })
            await interaction.reply("Success.")

        }
        else {
            await interaction.reply("Error")
        }

    }
};
