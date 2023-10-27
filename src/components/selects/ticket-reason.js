const { StringSelectMenuInteraction, ChatInputCommandInteraction, SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

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
        const maxSimultaniousUsers = textInput('Maximum Players Active Simultaniously', 'max-simultanious-users', TextInputStyle.Short, true, 15);

        // Exploit Report
        const exploitTypeInput = textInput('Exploit Type', 'exploit-type', TextInputStyle.Short, true, 4000);
        const exploitZoneInput = textInput('Exploit Zone', 'exploit-zone', TextInputStyle.Short, false, 4000);


        // Optional Req for most forms
        const othersInvolvedInput = textInput('Others Involved', 'others-involved', TextInputStyle.Short, false, 30);
        // Guild/Raid Disputes
        const petitioningGuildInput = textInput('Petitioning Guild', 'petitioning-guild', TextInputStyle.Short, true, 30);
        const guildsInvolvedInput = textInput('Other Guilds Involved', 'guilds-involved', TextInputStyle.Short, true, 30);
        // Corpse Lost
        const zoneInput = textInput('Zone', 'zone', TextInputStyle.Short, true, 60);
        // Items Lost
        const itemsLostInput = textInput('Items Lost', 'items-lost', TextInputStyle.Short, true, 30);


        const firstActionRow = new ActionRowBuilder().addComponents(charNameInput);
        const secondActionRow = new ActionRowBuilder().addComponents(accountUsernameInput);

        if (value === 'IP Exemption') {
            const thirdActionRow = new ActionRowBuilder().addComponents(maxSimultaniousUsers);
            const fourthActionRow = new ActionRowBuilder().addComponents(additionalAccountNamesInput);
            modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

        }
        else {

            const thirdActionRow = new ActionRowBuilder().addComponents(othersInvolvedInput);
            modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

        }

        modal.setCustomId(`${petitionType}-modal`);
        console.log(`${petitionType}-modal`);
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

