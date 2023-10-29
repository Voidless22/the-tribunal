const { StringSelectMenuInteraction, ChatInputCommandInteraction, SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ActionRow } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');

function textInput(label, id, style, required, maxLength) {
    return new TextInputBuilder()
        .setLabel(label)
        .setCustomId(id)
        .setStyle(style)
        .setRequired(required)
        .setMaxLength(maxLength)
}

module.exports = {
    customId: 'petition-reason',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {StringSelectMenuInteraction} interaction 
     */
    run: async (client, interaction) => {

        const value = interaction.values[0];
        const petitionType = value.replace(/ /g, '-').toLowerCase();
        const modal = new ModalBuilder()
            .setCustomId(`petition-modal`)
            .setTitle(`${value}`)

        //Define all our Text Inputs

        // Base Req for all forms
        const charNameInput = textInput('Petition Submitter Character Name', 'character-name', TextInputStyle.Short, true, 15);
        const accountUsernameInput = textInput('Petition Submitter Account Name', 'account-username', TextInputStyle.Short, true, 20);
        
        // Ip Exemption
        const additionalAccountNamesInput = textInput('Additional Account Names', 'additional-account-names', TextInputStyle.Short, true, 20);
        const maxSimultaneousUsers = textInput('Maximum Players Active Simultaniously', 'max-simultaneous-users', TextInputStyle.Short, true, 15);

        //Camp Dispute
        const partyMemberNames = textInput('Party Member Names', 'party-member-names', TextInputStyle.Short, true, 250);
        const violatorNames = textInput('Violator Name(s)', 'violator-names', TextInputStyle.Short, true, 100);

        //Guild Dispute
        const otherInvolvedGuild = textInput('Other Involved Guild', 'other-involved-guild', TextInputStyle.Short, true, 100);

        //Raid Dispute
        const petitionerRaidLeader = textInput('Petitioner Raid Leader', 'petitioner-raid-leader', TextInputStyle.Short, true, 100);
        const otherInvolvedRaidLeader = textInput('Other Involved Raid Leader', 'other-raid-leader', TextInputStyle.Short, true, 100);
    
        //Lost Item
        const fullItemName = textInput('Full Item Name', 'full-item-name', TextInputStyle.Short, true, 250);
        let actionRows = [];

        actionRows.push(new ActionRowBuilder().addComponents(charNameInput));
        actionRows.push(new ActionRowBuilder().addComponents(accountUsernameInput));

        switch (value) {
            case 'IP Exemption':
                actionRows.push(new ActionRowBuilder().addComponents(maxSimultaneousUsers));
                actionRows.push(new ActionRowBuilder().addComponents(additionalAccountNamesInput));
                break;
            case 'Camp Dispute':
                actionRows.push(new ActionRowBuilder().addComponents(partyMemberNames));
                actionRows.push(new ActionRowBuilder().addComponents(violatorNames));
                break;
            case 'Guild Dispute':
                actionRows.push(new ActionRowBuilder().addComponents(otherInvolvedGuild));
                break;
            case 'Raid Dispute':
                actionRows.push(new ActionRowBuilder().addComponents(petitionerRaidLeader));
                actionRows.push(new ActionRowBuilder().addComponents(otherInvolvedRaidLeader));
                break;
            case 'Lost Corpse':
                break;
            case 'Lost Item':
                actionRows.push(new ActionRowBuilder().addComponents(fullItemName));
                break;
            default:
                break;

        }

        for (const row of actionRows) {
            modal.addComponents(row);
        }

        modal.setCustomId(`${petitionType}-modal`);

        await interaction.showModal(modal);

        // Get the Modal Submit Interaction that is emitted once the User submits the Modal
        const submitted = await interaction.awaitModalSubmit({
            // Timeout after a minute of not receiving any valid Modals
            time: 60000,
            // Make sure we only accept Modals from the User who sent the original Interaction we're responding to
            filter: i => i.user.id === interaction.user.id,
        }).catch(error => {
            // Catch any Errors that are thrown (e.g. if the awaitModalSubmit times out after 60000 ms)
            //   console.error(error)
            return null
        })
    }
};