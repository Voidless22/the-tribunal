const { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, PermissionsBitField } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const db = require('../../../db')
const config = require('../../../config');






module.exports = {
    structure: new SlashCommandBuilder()
        .setName('setticketchannel')
        .setDescription('Sets the default channel for users to create tickets in.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to echo into')
                // Ensure the user can only select a TextChannel for output
                .addChannelTypes(ChannelType.GuildText)),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {[]} args 
     */
    run: async (client, interaction, args) => {


        const channelId = client.channels.cache.get(interaction.options.getChannel('channel').id);

        if (!interaction.member.permissions.has([PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles])) {
            await interaction.reply('You need permission to manage channels and roles to use this command.');
            return;
        }

        const createPetitionButton = new ButtonBuilder()
            .setCustomId('create-petition')
            .setLabel('Create Petition')
            .setStyle(1);

        const row = new ActionRowBuilder().addComponents(createPetitionButton);

        await channelId.send({ content: 'Create Petition:', components: [row] });

        await db.dbQuery("UPDATE guilds SET ticket_channel_id =? WHERE guild_id =?", [channelId.id, interaction.guild.id]);


        await interaction.reply('Set the default channel for users to create petitions in to <#' + channelId.id + '>')
    }
}


