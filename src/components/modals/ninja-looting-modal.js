const { ChannelType, ModalSubmitInteraction, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const db = require('../../db')
const utils = require('../../utils');

const petitionType = 'ninja-looting'

module.exports = {
    customId: `${petitionType}-modal`,

    run: async (client, interaction) => {
        //Form Input Values
        const characterName = interaction.fields.getTextInputValue('character-name');
        const accountUsername = interaction.fields.getTextInputValue('account-username');
        const fullItemName = interaction.fields.getTextInputValue('full-item-name');
        const ninjaLooterName = interaction.fields.getTextInputValue('ninja-looter');

        if (!await utils.validateInput("Account", { accountName: accountUsername, charName: characterName }) ||
            !await utils.validateInput("Character Exists", { charName: ninjaLooterName }) || 
            !await utils.validateInput("Item Exists", { itemName: fullItemName})) {
            await interaction.reply({ content: `One or more required form inputs are invalid.`, ephemeral: true });
        } else {

        const staffRole = await utils.getStaffRoleId(interaction.guild.id);
        const petitionChannelId = await utils.getPetitionChannel(interaction.guild.id);
        const staffSectionId = await utils.getStaffPetitionCategory(interaction.guild.id);
        const petitionChannel = interaction.guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.id == petitionChannelId);
        const GMPetitionSection = interaction.guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.name === petitionType &&channel.parent == staffSectionId); 


        const date = new Date();
        const threadName = `${characterName} - ${petitionType}`;
        const staffThreadName = `${characterName}-${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
        await utils.createPetitionThread(threadName, petitionChannel);
        await utils.createPetitionThread(staffThreadName, GMPetitionSection);
        const staffThread = interaction.guild.channels.cache.find(thread => thread.name == staffThreadName && thread.isThread() && thread.parent === GMPetitionSection);
        const petitionThread = interaction.guild.channels.cache.find(thread => thread.name == threadName && thread.isThread() && thread.parent === petitionChannel);
        const embed = new EmbedBuilder()
        .setTitle(`${petitionType.replace(/-/g, ' ')} Petition`)
        .addFields(
            {name: 'Discord User Submitting Petition:', value: `<@${interaction.user.id}>`},
            {name: 'Petitioner Character:', value: `${characterName}`},
            {name: 'Petitioner Username:', value: `${accountUsername}`},
            {name: 'Full Item Name:', value: `${fullItemName}`},
            {name: 'Ninja Looter:', value: `${ninjaLooterName}`})
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
}


};