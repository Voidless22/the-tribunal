const { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, PermissionsBitField } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const db = require('../../../db')
const config = require('../../../config');

function checkPerms(interaction) {
    return interaction.member.permissions.has([PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles])
}
module.exports = {
    structure: new SlashCommandBuilder()
        .setName('genstaffpetitionsection')
        .setDescription('Creates the petition category and channels with permissions for the supplied role')
        .addRoleOption(option => 
            option.setName('staff-role')
                  .setDescription('The role to give permissions to')
                  .setRequired(true)
            ),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {[]} args 
     */
    run: async (client, interaction, args) => {
        const staffRole = interaction.options.getRole('staff-role');
        const petitionCategories = config.petitionCategories;

        if (!checkPerms(interaction)) {
            await interaction.reply('You need permission to manage channels and roles to use this command.');
            return;
        }

        if (!interaction.guild.channels.cache.find(channel => channel.type === ChannelType.GuildCategory && channel.name == 'Staff-Petitions')) {
            // Create the category and default it so that nobody can see the it
            const petitionChannelCategory = interaction.guild.channels.create({
                name: 'Staff-Petitions',
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: staffRole.id,
                        allow: [PermissionsBitField.Flags.ViewChannel]
                    }
                ]
            });

            for (var i = 0; i < petitionCategories.length; i++) {
                const channelName = petitionCategories[i].replace(/ /g, '-').toLowerCase();
                if (!interaction.guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.name === 'Staff-Petitions')) {
                    interaction.guild.channels.create({ name: channelName, type: ChannelType.GuildText, parent: (await petitionChannelCategory).id });
                }
            }

            await db.dbQuery("UPDATE guilds SET staff_petition_category =? WHERE guild_id =?", [(await petitionChannelCategory).id, interaction.guild.id], "Discord");
            await db.dbQuery("UPDATE guilds SET staff_role_id = ? WHERE guild_id =?", [staffRole.id, interaction.guild.id],"Discord");
        }
        await interaction.reply('Staff Petition channels created successfully.')
    }
}