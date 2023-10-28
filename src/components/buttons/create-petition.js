const { ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const setPetitionChannel = require('../../commands/slash/Utility/setTicketChannel');
const config = require('../../config')
module.exports = {
    customId: 'create-petition',
    
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    run: async (client, interaction) => {
        const petitionCategories = config.petitionCategories;

        const petitionReasonSelect = new StringSelectMenuBuilder()
            .setCustomId('petition-reason')
            .setPlaceholder('Petition Category')
            .addOptions(petitionCategories.map(category => { return {label: category, description: category, value: category} }));

        const petitionReasonRow = new ActionRowBuilder().addComponents([petitionReasonSelect]);

        await interaction.reply({
            content: `Petition Category:`, components: [petitionReasonRow],
            ephemeral: true
        })
    }
};
