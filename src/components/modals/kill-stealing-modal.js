const { ChannelType, ModalSubmitInteraction, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const db = require('../../db')
const utils = require('../../utils');

const petitionType = 'kill-stealing'

module.exports = {
    customId: `${petitionType}-modal`,

    run: async (client, interaction) => {
        //Form Input Values
        const characterName = interaction.fields.getTextInputValue('character-name');
        const accountUsername = interaction.fields.getTextInputValue('account-username');
        const violatorNames = interaction.fields.getTextInputValue('violator-names');

        const staffRole = await utils.getStaffRoleId(interaction.guild.id);
        const petitionChannelId = await utils.getPetitionChannel(interaction.guild.id);
        const staffSectionId = await utils.getStaffPetitionCategory(interaction.guild.id);
        const petitionChannel = interaction.guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.id == petitionChannelId);
        const GMPetitionSection = interaction.guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.name === petitionType &&channel.parent == staffSectionId); 


        await utils.createThreads(`${characterName} - ${petitionType}`, GMPetitionSection, petitionChannel);

        const staffThread = interaction.guild.channels.cache.find(thread => thread.name == `${characterName} - ${petitionType}` && thread.isThread() && thread.parent === GMPetitionSection);
        const petitionThread = interaction.guild.channels.cache.find(thread => thread.name == `${characterName} - ${petitionType}` && thread.isThread() && thread.parent === petitionChannel);

        const embed = new EmbedBuilder()
        .setTitle(`${petitionType.replace(/-/g, ' ')} Petition`)
        .addFields(
            {name: 'Discord User Submitting Petition:', value: `<@${interaction.user.id}>`},
            {name: 'Petitioner Character:', value: `${characterName}`},
            {name: 'Petitioner Username:', value: `${accountUsername}`},
            {name: 'Violator Name(s):', value: `${violatorNames}`})
        .setTimestamp()

        if (staffThread) {
            staffThread.send({embeds: [embed]})
            GMPetitionSection.send(`**New Petition Submitted:** Public: ${petitionThread} CSR: ${staffThread}`)
        }
        if (petitionThread) {
            petitionThread.send({embeds: [embed]})
            petitionThread.send(`<@${interaction.user.id}>, <@&${staffRole}> will be with you soon.`)
        }
        // this is really only here to satisfy the dumb discord api and confirm the interaction is done and not pending
        await interaction.reply({
            content: `Your Petition request has been submitted for ${characterName}.`,
            ephemeral: true
        });
    }

};