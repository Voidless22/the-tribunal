const { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, PermissionsBitField } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const db = require('../../../db')
const config = require('../../../config');
const utils = require('../../../utils');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('checkcharaccount')
        .setDescription('SQL query test')
        .addStringOption(option =>
            option.setName("character")
            .setDescription('Character Name')
            .setRequired(true))
        .addStringOption(option =>
            option.setName("account")
            .setDescription('Account Name')
            .setRequired(true)),

    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {[]} args 
     */
    run: async (client, interaction, args) => {
        
        charName = interaction.options.getString('character');
        accountName = interaction.options.getString('account');
        results = await utils.validateInput('Account', { accountName: accountName,charName: charName});
        if (results.length != 0) {
        await interaction.reply(`${results}`);
        }
        else {
            await interaction.reply("The supplied username and character combination could not be found.")
        }

    }
};
