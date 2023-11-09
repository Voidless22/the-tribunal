const { ChannelType, ModalSubmitInteraction, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const db = require('../../db')
const utils = require('../../utils');

const petitionType = 'camp-dispute'

async function checkMembers(members) {
    for (let i = 0; i < members.length; i++) {
        let dbResults = await utils.confirmCharExists(members[i]);
        if (!dbResults.length > 0) {
            return false;
        }
    }
    return true;
}

module.exports = {
    customId: `${petitionType}-modal`,

    run: async (client, interaction) => {
        //Form Input Values
        const characterName = interaction.fields.getTextInputValue('character-name');
        const accountUsername = interaction.fields.getTextInputValue('account-username');
        const partyMemberNames = interaction.fields.getTextInputValue('party-member-names');
        const violatorName = interaction.fields.getTextInputValue('violator-name');
        const staffRole = await utils.getStaffRoleId(interaction.guild.id);
        const petitionChannelId = await utils.getPetitionChannel(interaction.guild.id);
        const staffSectionId = await utils.getStaffPetitionCategory(interaction.guild.id);
        const petitionChannel = interaction.guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.id == petitionChannelId);
        const GMPetitionSection = interaction.guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.name === petitionType && channel.parent == staffSectionId);

        const partyMembers = utils.seperateValues(partyMemberNames)
        partyMembers.push(violatorName)
        const confirmPetitioner = await utils.validateCharAccount(characterName, accountUsername);


        if (await checkMembers(partyMembers) && confirmPetitioner.length > 0) {
            const date = new Date();

            await utils.createPetitionThread(`${characterName} - ${petitionType}`, petitionChannel);
            await utils.createPetitionThread(`${characterName}-${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`, GMPetitionSection);

            const staffThread = interaction.guild.channels.cache.find(thread => thread.name == `${characterName}-${date.getMonth()}/${date.getDate()}/${date.getFullYear()}` && thread.isThread() && thread.parent === GMPetitionSection);
            const petitionThread = interaction.guild.channels.cache.find(thread => thread.name == `${characterName} - ${petitionType}` && thread.isThread() && thread.parent === petitionChannel);
            const embed = new EmbedBuilder()
                .setTitle(`${petitionType.replace(/-/g, ' ')} Petition`)
                .addFields(
                    { name: 'Discord User Submitting Petition:', value: `<@${interaction.user.id}>` },
                    { name: 'Petitioner Character:', value: `${characterName}` },
                    { name: 'Petitioner Username:', value: `${accountUsername}` },
                    { name: 'Party Members:', value: `${partyMemberNames}` },
                    { name: 'Violator Name:', value: `${violatorName}` })
                .setTimestamp()
            
            
            if (staffThread) {
                staffThread.send({ embeds: [embed] })
                GMPetitionSection.send(`**New Petition Submitted:** Public: ${petitionThread} CSR: ${staffThread}`)

            }
            if (petitionThread) {
                petitionThread.send({ embeds: [embed] })
                petitionThread.send(`<@${interaction.user.id}>,<@&${staffRole}> will be with you soon.`)

            }

            await interaction.reply({
                content: ` Your Petition request has been submitted for ${characterName}.`,
                ephemeral: true
            });
        }
        else {
            await interaction.reply({
                content: `One or more of the supplied character names and/or account names supplied were not found.`,
                ephemeral: true
            })

        }
    }


};