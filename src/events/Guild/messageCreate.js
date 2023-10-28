const { ChannelType, Message } = require('discord.js');
const config = require('../../config');
const ExtendedClient = require('../../class/ExtendedClient');

const cooldown = new Map();

module.exports = {
    event: 'messageCreate',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @returns 
     */
    run: async (client, message) => {
        if (message.author.bot || message.channel.type === ChannelType.DM) return;
        if (!config.handler.commands.prefix) return;

        let prefix = config.handler.prefix;
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandInput = args.shift().toLowerCase();

        if (!commandInput.length) return;

        let command = client.collection.prefixcommands.get(commandInput) || client.collection.prefixcommands.get(client.collection.aliases.get(commandInput));
        if (command) {
            try {
                if (command.structure?.permissions && !message.member.permissions.has(command.structure?.permissions)) {
                    await message.reply({
                        content: 'You do not have the permission to use this command.'
                    });
                    return;
                };

                if (command.structure?.cooldown) {
                    const cooldownFunction = () => {
                        let data = cooldown.get(message.author.id);
                        data.push(commandInput);
                        cooldown.set(message.author.id, data);

                        setTimeout(() => {
                            let data = cooldown.get(message.author.id);
                            data = data.filter((v) => v !== commandInput);

                            if (data.length <= 0) {
                                cooldown.delete(message.author.id);
                            } else {
                                cooldown.set(message.author.id, data);
                            };
                        }, command.structure?.cooldown);
                    };

                    if (cooldown.has(message.author.id)) {
                        let data = cooldown.get(message.author.id);

                        if (data.some((v) => v === commandInput)) {
                            await message.reply({
                                content: 'Slow down buddy! You\'re too fast to use this command.'
                            });

                            return;
                        } else {
                            cooldownFunction();
                        };
                    } else {
                        cooldown.set(message.author.id, [commandInput]);
                        cooldownFunction();
                    };
                };

                command.run(client, message, args);
            } catch (error) {
                console.log(error, 'err');
            }
        }
    },
};