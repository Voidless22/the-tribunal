const { ChannelType, ModalSubmitInteraction } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const db = require('../../db')
const utils = require('../../utils');

const petitionType = 'bug-report'

module.exports = {
    customId: `${petitionType}-modal`,

    run: async (client, interaction) => {
        //Form Input Values
        const characterName = interaction.fields.getTextInputValue('character-name');
        const accountUsername = interaction.fields.getTextInputValue('account-username');
        const petitionDescription = interaction.fields.getTextInputValue('ticket-description');
        const otherCharacters = interaction.fields.getTextInputValue('others-involved');

        const staffRole = await utils.getStaffRoleId(interaction.guild.id);
        const petitionChannelId = await utils.getPetitionChannel(interaction.guild.id);
        const staffSectionId = await utils.getStaffPetitionCategory(interaction.guild.id);
        const petitionChannel = interaction.guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.id == petitionChannelId);
        const GMPetitionSection = interaction.guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.name === petitionType &&channel.parent == staffSectionId); 


        await utils.createThreads(`${characterName} - ${petitionType}`, GMPetitionSection, petitionChannel);

        const staffThread = interaction.guild.channels.cache.find(thread => thread.name == `${characterName} - ${petitionType}` && thread.isThread() && thread.parent === GMPetitionSection);
        const petitionThread = interaction.guild.channels.cache.find(thread => thread.name == `${characterName} - ${petitionType}` && thread.isThread() && thread.parent === petitionChannel);

        // BIG TODO: TURN THESE INTO EMBEDS GOOD GOD THE NOTIFICATION SPAM
        if (staffThread) {
            staffThread.send(`**Discord User Submitting Petition:** <@${interaction.user.id}>`)
            staffThread.send(`**Character Submitting Petition:** ${characterName}`)
            staffThread.send(`**Other Characters Involved:** ${otherCharacters} `)
            staffThread.send(`**Account Usernames:** ${accountUsername}`)
            staffThread.send(`**Petition Description:** ${petitionDescription}`)
            GMPetitionSection.send(`**New Petition Submitted:** Public: ${petitionThread} CSR: ${staffThread}`)

        }
        if (petitionThread) {
            petitionThread.send(`**Discord User Submitting Petition:** <@${interaction.user.id}>`)
            petitionThread.send(`**Character Submitting Petition:** ${characterName}`)
            petitionThread.send(`**Other Characters Involved:** ${otherCharacters} `)
            petitionThread.send(`**Account Usernames:** ${accountUsername}`)
            petitionThread.send(`**Petition Description:** ${petitionDescription}`)
            petitionThread.send(`<@&${staffRole}> will be with you soon.`)

        }
        // this is really only here to satisfy the dumb discord api and confirm the interaction is done and not pending
        await interaction.reply({
            content: `Your Petition request has been submitted for ${characterName}.`,
            ephemeral: true
        });
    }

};